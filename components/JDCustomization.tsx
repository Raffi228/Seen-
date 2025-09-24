import React, { useState, useRef, useCallback } from 'react';
import { customizeResumeAndGreeting } from '../services/geminiService';
import { ResumeOutput } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResumePreview from './ResumePreview';
import { CopyIcon, DownloadIcon, FileIcon, UploadIcon } from './IconComponents';

// Add necessary window types for external scripts
declare global {
  interface Window {
    pdfjsLib: any;
    jspdf: any;
    html2canvas: any;
  }
}

const JDCustomization: React.FC = () => {
  const [baseResume, setBaseResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [output, setOutput] = useState<ResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      setBaseResume('');
      setOutput(null);
      setLoadingMessage('正在解析简历...');
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
          try {
              const typedArray = new Uint8Array(event.target!.result as ArrayBuffer);
              const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
              let fullText = '';
              for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const textContent = await page.getTextContent();
                  const pageText = textContent.items.map((s: any) => s.str).join(' ');
                  fullText += pageText + '\n\n';
              }
              setBaseResume(fullText);
          } catch (e) {
              console.error("Error parsing PDF", e);
              alert("解析PDF文件失败，请确保文件未损坏。");
              setFileName(null);
          } finally {
              setIsLoading(false);
              setLoadingMessage('');
          }
      };
      reader.readAsArrayBuffer(file);
    } else {
        alert('请上传 PDF 格式的简历文件。');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
      }
  }, [handleFile]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
      }
  };

  const handleSubmit = async () => {
    if (!baseResume.trim() || !jobDescription.trim()) {
      alert('请上传你的基础简历并填写目标岗位JD。');
      return;
    }
    setLoadingMessage('AI 正在为你定制...');
    setIsLoading(true);
    setOutput(null);
    const result = await customizeResumeAndGreeting(baseResume, jobDescription);
    setOutput(result);
    setIsLoading(false);
    setLoadingMessage('');
  };
  
  const handleCopyGreeting = () => {
    if (output?.greetingMessage) {
      navigator.clipboard.writeText(output.greetingMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPdf = async () => {
    if (!resumePreviewRef.current || !output) {
      alert('没有可下载的简历内容。');
      return;
    }
    setLoadingMessage('正在生成PDF...');
    setIsLoading(true);
    try {
      const { jsPDF } = window.jspdf;
      const content = resumePreviewRef.current;
      
      const canvas = await window.html2canvas(content, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = -pdf.internal.pageSize.getHeight() * (Math.floor(Math.abs(position) / pdf.internal.pageSize.getHeight()) + 1);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      pdf.save(`${output.companyName}-${output.positionName}-简历.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("生成PDF失败，请稍后重试。");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="baseResume" className="block text-lg font-semibold mb-2 text-slate-700">
            上传你的基础简历
          </label>
           <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileName ? (
              <div className="text-slate-700 flex flex-col items-center justify-center">
                <FileIcon />
                <p className="mt-2 font-semibold">{fileName}</p>
                <p className="text-sm text-slate-500">文件已加载。点击或拖拽可替换。</p>
              </div>
            ) : (
              <div className="text-slate-500 flex flex-col items-center justify-center">
                <UploadIcon />
                <p className="mt-2">点击或拖拽文件到此区域上传</p>
                <p className="text-sm">仅支持 PDF 格式</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="jobDescription" className="block text-lg font-semibold mb-2 text-slate-700">
            目标岗位 JD
          </label>
          <textarea
            id="jobDescription"
            rows={12}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="请在这里粘贴目标岗位的 JD (Job Description)..."
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-lg flex items-center justify-center disabled:bg-slate-400"
        >
          {isLoading && !output && <LoadingSpinner />}
          {isLoading && !output ? loadingMessage : '一键生成定制化简历和打招呼消息'}
        </button>
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        {isLoading && !output && (
             <div className="bg-white p-8 rounded-xl shadow-lg flex justify-center items-center h-full">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-slate-600">{loadingMessage || 'AI 正在为你定制，请稍候...'}</p>
                </div>
             </div>
        )}
        {output && (
          <>
            <div className="bg-white p-8 rounded-xl shadow-lg">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-slate-800">
                    {output.companyName} - {output.positionName} 简历
                  </h3>
                  <button onClick={handleDownloadPdf} disabled={isLoading} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-slate-400">
                    {isLoading && loadingMessage.includes('PDF') ? <LoadingSpinner /> : <DownloadIcon />}
                    <span>{isLoading && loadingMessage.includes('PDF') ? '生成中...' : '下载 PDF'}</span>
                  </button>
                </div>
              <ResumePreview ref={resumePreviewRef} content={output.customizedResume} />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-slate-800">建议打招呼消息</h3>
                  <button onClick={handleCopyGreeting} className="flex items-center space-x-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-md hover:bg-slate-200 transition">
                    <CopyIcon />
                    <span>{copied ? '已复制!' : '复制'}</span>
                  </button>
              </div>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-lg leading-relaxed">{output.greetingMessage}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JDCustomization;