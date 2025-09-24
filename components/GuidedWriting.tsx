
import React, { useState, useRef, useEffect } from 'react';
import { JobSeekerSituation, Message } from '../types';
import { getInitialQuestion, getFollowUpQuestion, generateResumeFromChat } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ResumePreview from './ResumePreview';
import { SendIcon } from './IconComponents';

const GuidedWriting: React.FC = () => {
  const [situation, setSituation] = useState<JobSeekerSituation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSituationSelect = async (selectedSituation: JobSeekerSituation) => {
    setSituation(selectedSituation);
    setIsLoading(true);
    setGeneratedResume(null);
    // Fix: Explicitly type `initialMessage` as `Message` to resolve type inference issue.
    const initialMessage: Message = {
      sender: 'ai',
      text: '你好！很高兴能帮助你梳理经历。我们从哪里开始呢？',
    };
    setMessages([initialMessage]);
    
    const firstQuestion = await getInitialQuestion(selectedSituation);
    setMessages(prev => [...prev, { sender: 'ai', text: firstQuestion }]);
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '' || isLoading) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    const aiResponse = await getFollowUpQuestion(newMessages);
    setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };
  
  const handleGenerateResume = async () => {
      setIsLoading(true);
      setGeneratedResume(null);
      const resumeContent = await generateResumeFromChat(messages);
      setGeneratedResume(resumeContent);
      setIsLoading(false);
  }

  const situationButtons = Object.values(JobSeekerSituation).map((sit) => (
    <button
      key={sit}
      onClick={() => handleSituationSelect(sit)}
      className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 transform hover:scale-105 shadow-sm"
    >
      {sit}
    </button>
  ));

  if (!situation) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">你好，我是你的 AI 求职 Coach "知遇"</h2>
        <p className="text-slate-600 mb-8">选择你当前的情况，让我来引导你梳理经历，打造一份亮眼的简历吧！</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {situationButtons}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Chat Interface */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-[75vh]">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">与 "知遇 AI" 对话中...</h3>
        <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && messages.length > 0 && (
             <div className="flex justify-start">
                <div className="bg-slate-200 text-slate-800 px-4 py-3 rounded-2xl rounded-bl-lg"><LoadingSpinner /></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="请在这里输入你的经历..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Resume Preview and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">简历预览</h3>
        <button
            onClick={handleGenerateResume}
            disabled={isLoading || messages.length < 3}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 mb-4 disabled:bg-slate-400"
        >
            {isLoading && !generatedResume ? '生成中...' : '根据对话生成简历'}
        </button>
        {isLoading && !generatedResume && <div className="flex justify-center p-8"><LoadingSpinner /></div>}
        {generatedResume && <ResumePreview content={generatedResume} />}
      </div>
    </div>
  );
};

export default GuidedWriting;