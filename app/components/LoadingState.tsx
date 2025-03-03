'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LoadingStateProps {
  name: string;
  thinkingProcess?: string[];
}

export const LoadingState = ({ name, thinkingProcess = [] }: LoadingStateProps) => {
  // 获取思考内容
  const thinkingContent = thinkingProcess.length > 0 ? thinkingProcess[0] : '';
  
  // 用于打字机效果的状态
  const [displayText, setDisplayText] = useState('');
  const [currentPosition, setCurrentPosition] = useState(0);
  
  // 创建引用来访问滚动容器
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 自动滚动到底部
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [displayText]);
  
  // 打字机效果
  useEffect(() => {
    if (!thinkingContent) return;
    
    // 重置位置，如果思考内容变化
    if (currentPosition > thinkingContent.length) {
      setCurrentPosition(0);
      setDisplayText('');
    }
    
    // 每50ms显示一个新字符
    const timer = setTimeout(() => {
      if (currentPosition < thinkingContent.length) {
        setDisplayText(thinkingContent.substring(0, currentPosition + 1));
        setCurrentPosition(prev => prev + 1);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [thinkingContent, currentPosition]);
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-150"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-300"></div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold">正在分析 &quot;{name}&quot;</h3>
        <p className="text-sm text-gray-500">请稍候，AI正在思考中...</p>
      </div>
      
      {/* 思考过程显示区域 - 打字机效果 */}
      {thinkingContent && (
        <div className="w-full max-w-md mt-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <div 
              ref={scrollContainerRef}
              className="h-24 overflow-y-auto scrollbar-hide"
            >
              <p className="text-blue-600 font-mono text-sm whitespace-pre-wrap">
                {displayText}
                <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-blink"></span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};