'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CatInteractionProps {
  isProcessing: boolean;
  isCompleted: boolean;
  onReset: () => void;
  inputValue: string;
}

export const CatInteraction = ({ isProcessing, isCompleted, onReset, inputValue }: CatInteractionProps) => {
  const [showBubble, setShowBubble] = useState(false);
  const [catMessage, setCatMessage] = useState('');
  const [buttonFell, setButtonFell] = useState(false);
  const [catAnimation, setCatAnimation] = useState<'idle' | 'thinking' | 'happy'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const meowRef = useRef<HTMLAudioElement | null>(null);
  const purrRef = useRef<HTMLAudioElement | null>(null);

  // 猫咪消息
  const idleMessages = [
    '喵～有什么网名想让我分析的吗？',
    '喵喵～输入一个网名，我来帮你分析！',
    '喵～我可是专业的网名分析猫哦！',
    '喵喵喵～等你输入网名呢！'
  ];

  const thinkingMessages = [
    '呼噜噜...正在思考中...',
    '呼噜噜...这个名字有点意思...',
    '呼噜噜...让我好好想想...',
    '呼噜噜...分析中...'
  ];

  const happyMessages = [
    '喵！分析完成了！',
    '喵喵喵！我有结果啦！',
    '喵～这个名字我已经看透了！',
    '喵喵！快看我的分析结果！'
  ];

  // 随机选择消息
  const getRandomMessage = (messages: string[]) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  // 处理按钮掉落动画
  useEffect(() => {
    if (isProcessing && !buttonFell) {
      setButtonFell(true);
      setCatAnimation('thinking');
      
      // 播放按钮掉落音效
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log('音频播放失败:', e));
      }
      
      // 播放呼噜声
      if (purrRef.current) {
        purrRef.current.currentTime = 0;
        purrRef.current.play().catch(e => console.log('音频播放失败:', e));
      }
      
      // 设置思考中的消息
      setCatMessage(getRandomMessage(thinkingMessages));
      setShowBubble(true);
    }
  }, [isProcessing, buttonFell]);

  // 处理完成动画
  useEffect(() => {
    if (isCompleted && buttonFell) {
      setCatAnimation('happy');
      
      // 停止呼噜声
      if (purrRef.current) {
        purrRef.current.pause();
      }
      
      // 播放喵喵声
      if (meowRef.current) {
        meowRef.current.currentTime = 0;
        meowRef.current.play().catch(e => console.log('音频播放失败:', e));
      }
      
      // 设置完成消息
      setCatMessage(getRandomMessage(happyMessages));
      setShowBubble(true);
      
      // 3秒后重置按钮状态
      const timer = setTimeout(() => {
        setButtonFell(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isCompleted, buttonFell]);

  // 初始化时显示闲置消息
  useEffect(() => {
    if (!isProcessing && !isCompleted) {
      setCatAnimation('idle');
      setCatMessage(getRandomMessage(idleMessages));
      setShowBubble(true);
      
      // 5秒后隐藏消息
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isProcessing, isCompleted, inputValue]);

  return (
    <div className="relative w-full h-64 flex items-end justify-center mb-5">
      {/* 音效 */}
      <audio ref={audioRef} src="/sounds/button-fall.mp3" preload="auto"></audio>
      <audio ref={meowRef} src="/sounds/meow.mp3" preload="auto"></audio>
      <audio ref={purrRef} src="/sounds/purr.mp3" preload="auto" loop></audio>
      
      {/* 对话气泡 */}
      <AnimatePresence>
        {showBubble && (
          <motion.div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-2xl shadow-lg max-w-xs z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            <div className="relative">
              <p className="text-gray-800 text-sm">{catMessage}</p>
              {/* 气泡尖角 */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-4 h-4 bg-white rotate-45 transform origin-center"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 猫咪 */}
      <motion.div 
        className="relative z-0"
        animate={
          catAnimation === 'idle' 
            ? { y: [0, -5, 0], transition: { repeat: Infinity, duration: 4 } }
            : catAnimation === 'thinking'
            ? { rotate: [0, -2, 0, 2, 0], transition: { repeat: Infinity, duration: 1.5 } }
            : { scale: [1, 1.1, 1], transition: { duration: 0.5 } }
        }
      >
        <div className="relative">
          {/* 猫咪图像 */}
          <div className="w-40 h-40 relative">
            {catAnimation === 'idle' && (
              <object type="image/svg+xml" data="/images/cat-idle.svg" className="w-full h-full">猫咪</object>
            )}
            {catAnimation === 'thinking' && (
              <object type="image/svg+xml" data="/images/cat-thinking.svg" className="w-full h-full">思考中的猫咪</object>
            )}
            {catAnimation === 'happy' && (
              <object type="image/svg+xml" data="/images/cat-happy.svg" className="w-full h-full">开心的猫咪</object>
            )}
          </div>
          
          {/* 按钮掉落动画 */}
          {buttonFell && (
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
              initial={{ y: -100, rotate: 0 }}
              animate={{ y: 20, rotate: 360 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}; 