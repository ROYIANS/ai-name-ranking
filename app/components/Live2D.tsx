'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export const Live2D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 确保脚本加载后再初始化
    const initLive2D = () => {
      if (typeof window.loadlive2d === 'function' && containerRef.current) {
        try {
          // 初始化Live2D模型
          window.loadlive2d(
            'live2d-canvas',
            'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/assets/haruto.model.json'
          );
        } catch (error) {
          console.error('Live2D初始化失败:', error);
        }
      }
    };

    // 如果脚本已加载，直接初始化
    if (typeof window.loadlive2d === 'function') {
      initLive2D();
    } else {
      // 否则等待脚本加载完成
      window.addEventListener('live2d-loaded', initLive2D);
    }

    return () => {
      window.removeEventListener('live2d-loaded', initLive2D);
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js"
        onLoad={() => {
          window.dispatchEvent(new Event('live2d-loaded'));
        }}
      />
      <div 
        ref={containerRef}
        className="live2d-container"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          width: '200px',
          height: '300px',
          zIndex: 999
        }}
      >
        <canvas id="live2d-canvas" width="200" height="300"></canvas>
      </div>
    </>
  );
};

// 为window对象添加类型定义
declare global {
  interface Window {
    loadlive2d: (id: string, modelPath: string) => void;
  }
} 