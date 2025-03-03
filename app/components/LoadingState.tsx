'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  name: string;
}

// 姓名小知识数组
const nameTrivia = [
  "姓名学起源于中国古代，是研究姓名与人生关系的一门学问。",
  "中国的姓氏超过6000个，但常用姓氏约为400个。",
  "'李'是中国最常见的姓氏，全球约有1亿人姓李。",
  "古人认为姓名对一个人的命运有重要影响。",
  "姓名中的字形、笔画、五行属性都被认为会影响人的运势。",
  "日本的姓氏数量超过10万个，比中国还要多。",
  "在西方文化中，名字通常放在姓氏前面，而中国则相反。",
  "有研究表明，名字简单易读的人在职场上可能更容易成功。",
  "中国古代女子出嫁后，通常会在夫姓前加上自己的姓氏。",
  "姓名中的用字搭配会影响整体的和谐度与美感。",
  "一个好的网名应当简洁、独特且易于记忆。",
  "网名可以展示个人特色，是网络身份的重要标识。"
];

// 分析阶段数组
const analysisStages = [
  "正在初始化分析引擎...",
  "正在解析名称结构...",
  "正在评估风格创意...",
  "正在分析寓意内涵...",
  "正在评估实用性...",
  "正在生成综合评分...",
  "正在完善分析报告..."
];

export const LoadingState = ({ name }: LoadingStateProps) => {
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  
  // 每3秒切换一条小知识
  useEffect(() => {
    const triviaInterval = setInterval(() => {
      setTriviaIndex((prevIndex) => (prevIndex + 1) % nameTrivia.length);
    }, 3000);
    
    return () => clearInterval(triviaInterval);
  }, []);
  
  // 每1.5秒更新一个分析阶段
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((prevIndex) => {
        // 循环显示分析阶段，但保持在最后一个阶段多停留一会
        if (prevIndex >= analysisStages.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 1500);
    
    return () => clearInterval(stageInterval);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 text-center">
      <div className="mb-8">
        <div className="relative mx-auto w-24 h-24 mb-6">
          {/* 主圆环动画 */}
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-sky-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1],
              rotate: 360
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop"
            }}
          />
          
          {/* 外部光环效果 */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-sky-300"
            style={{ padding: '3px' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
              rotate: -360
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop"
            }}
          />
          
          {/* 内部圆点动画 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-sky-600 font-bold text-lg">AI</span>
          </motion.div>
          
          {/* 外部装饰点 */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div 
              key={i}
              className="absolute w-2 h-2 bg-sky-400 rounded-full"
              style={{
                top: `${50 + 45 * Math.sin(i * Math.PI / 3)}%`,
                left: `${50 + 45 * Math.cos(i * Math.PI / 3)}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          正在分析 &quot;{name}&quot; 中
        </h3>
        
        <div className="text-sky-600 font-medium mb-4">
          {analysisStages[stageIndex]}
        </div>
        
        {/* 进度条 */}
        <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2.5 mb-6">
          <motion.div 
            className="bg-sky-500 h-2.5 rounded-full"
            animate={{
              width: ["0%", "100%"]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
      
      <div className="max-w-md mx-auto bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h4 className="text-sm font-medium text-blue-700 mb-2">姓名小知识</h4>
        <motion.p 
          key={triviaIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-gray-600"
        >
          {nameTrivia[triviaIndex]}
        </motion.p>
      </div>
    </div>
  );
};