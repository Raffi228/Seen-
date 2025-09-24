
import React, { useState } from 'react';
import { customizeResumeAndGreeting } from '../services/geminiService';
import { ResumeOutput } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResumePreview from './ResumePreview';
import { CopyIcon } from './IconComponents';

const JDCustomization: React.FC = () => {
  const [baseResume, setBaseResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [output, setOutput] = useState<ResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!baseResume.trim() || !jobDescription.trim()) {
      alert('请填写你的基础简历和目标岗位JD。');
      return;
    }
    setIsLoading(true);
    setOutput(null);
    const result = await customizeResumeAndGreeting(baseResume, jobDescription);
    setOutput(result);
    setIsLoading(false);
  };
  
  const handleCopyGreeting = () => {
    if (output?.greetingMessage) {
      navigator.clipboard.writeText(output.greetingMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="baseResume" className="block text-lg font-semibold mb-2 text-slate-700">
            你的基础简历
          </label>
          <textarea
            id="baseResume"
            rows={12}
            value={baseResume}
            onChange={(e) => setBaseResume(e.target.value)}
            placeholder="请在这里粘贴你的基础简历内容..."
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
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
          {isLoading && <LoadingSpinner />}
          {isLoading ? '正在生成...' : '一键生成定制化简历和打招呼消息'}
        </button>
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        {isLoading && !output && (
             <div className="bg-white p-8 rounded-xl shadow-lg flex justify-center items-center h-full">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-slate-600">AI 正在为你定制，请稍候...</p>
                </div>
             </div>
        )}
        {output && (
          <>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">定制化简历</h3>
              <ResumePreview content={output.customizedResume} />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-slate-800">专属打招呼消息</h3>
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
