
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './IconComponents';

interface ResumePreviewProps {
  content: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  // A simple markdown to HTML conversion for display
  const formatContent = (text: string) => {
    return text
      .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-6 mb-2 border-b pb-1">$1</h3>')
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-3 border-b-2 pb-2">$1</h2>')
      .replace(/\* (.*)/g, '<li class="ml-5 list-disc">$1</li>')
      .replace(/\n/g, '<br />')
      .replace(/<br \/><li>/g, '<li>'); // Fix extra breaks before list items
  };
  
  const handleCopy = () => {
    // We copy the raw text, not the HTML formatted one
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="relative bg-slate-50 border border-slate-200 p-6 rounded-lg max-h-[60vh] overflow-y-auto">
       <button 
        onClick={handleCopy}
        className="absolute top-4 right-4 bg-white text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition shadow-sm border border-slate-200 flex items-center space-x-2"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span>{copied ? '已复制!' : '复制内容'}</span>
      </button>

      <div
        className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-slate-800"
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
    </div>
  );
};

export default ResumePreview;
