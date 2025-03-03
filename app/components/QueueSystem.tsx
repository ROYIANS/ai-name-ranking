'use client';

import { useState, useEffect } from 'react';
import { NameAnalysis } from './NameAnalysis';
import { Settings } from './Settings';
import { CatInteraction } from './CatInteraction';
import { LoadingState } from './LoadingState';

// 从NameAnalysis导入AnalysisResult类型
interface AnalysisResult {
  score: number;
  analysis: {
    style: {
      score: number;
      uniqueness: string;
      creativity: string;
      personality: string;
    };
    meaning: {
      score: number;
      interpretation: string;
      connotation: string;
      cultural: string;
      overall: string;
    };
    usability: {
      score: number;
      readability: string;
      memorability: string;
      versatility: string;
    };
    summary: string;
  };
}

interface QueueItem {
  id: string;
  name: string;
  status: 'waiting' | 'processing' | 'completed' | 'error';
  result: AnalysisResult | null;
  error?: string;
  timestamp: number;
  thinkingProcess?: string[]; // 添加思考过程数组
}

export const QueueSystem = () => {
  // 将队列分为等待队列和历史队列
  const [waitingQueue, setWaitingQueue] = useState<QueueItem[]>([]);
  const [historyQueue, setHistoryQueue] = useState<QueueItem[]>([]);
  const [currentName, setCurrentName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [thinkingProcess, setThinkingProcess] = useState<string[]>([]); // 添加思考过程状态

  // 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('nameAnalyzerSettings');
    if (savedSettings) {
      try {
        // 解析设置
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, [isSettingsOpen]);

  // 添加到等待队列
  const addToQueue = () => {
    if (!currentName.trim()) return;
    
    const newItem: QueueItem = {
      id: Date.now().toString(),
      name: currentName.trim(),
      status: 'waiting',
      result: null,
      timestamp: Date.now(),
      thinkingProcess: [] // 初始化思考过程
    };
    
    setWaitingQueue(prev => [...prev, newItem]);
    setCurrentName('');
    setAnalysisCompleted(false);
  };

  // 处理队列
  useEffect(() => {
    // 如果正在处理或等待队列为空，则返回
    if (processing || waitingQueue.length === 0) return;
    
    const processNextItem = async () => {
      setProcessing(true);
      setAnalysisCompleted(false);
      setThinkingProcess([]); // 重置思考过程
      
      // 获取队列中的第一个项目
      const currentItem = waitingQueue[0];
      
      // 更新状态为处理中
      const updatedItem: QueueItem = { 
        ...currentItem, 
        status: 'processing',
        thinkingProcess: [] // 初始化思考过程
      };
      setWaitingQueue(prev => [updatedItem, ...prev.slice(1)]);
      
      try {
        // 获取API设置
        const settings = localStorage.getItem('nameAnalyzerSettings');
        
        // 静态模式：使用模拟数据而不是实际API调用
        const useStaticData = false; // 设置为false禁用静态模式，使用真实API
        
        if (useStaticData) {
          // 模拟API响应延迟
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // 使用静态模拟数据
          const mockResult: AnalysisResult = {
            score: Math.floor(70 + Math.random() * 30),
            analysis: {
              style: {
                score: Math.floor(70 + Math.random() * 30),
                uniqueness: "这个名字在互联网上的独特性适中，既不会太常见也不会太奇特。",
                creativity: "名字展现了一定的创意，融合了多种元素。",
                personality: "名字传达出友好、亲切的个性特点。"
              },
              meaning: {
                score: Math.floor(70 + Math.random() * 30),
                interpretation: "这个名字可以解读为对美好事物的向往。",
                connotation: "名字带有积极向上的内涵。",
                cultural: "在文化背景上，这个名字比较中性，适合多种场合。",
                overall: "整体而言，这是一个寓意良好的名字。"
              },
              usability: {
                score: Math.floor(70 + Math.random() * 30),
                readability: "名字读起来朗朗上口，容易记忆。",
                memorability: "具有一定的记忆点，但不是特别突出。",
                versatility: "在各种平台上都能使用，没有特殊字符限制。"
              },
              summary: `"${currentItem.name}"是一个不错的网名选择，整体评分为${Math.floor(70 + Math.random() * 30)}分。它既有一定的个性，又不会太过奇特，适合日常社交媒体使用。`
            }
          };
          
          // 更新队列项
          const completedItem: QueueItem = {
            ...updatedItem,
            status: 'completed',
            result: mockResult
          };
          
          // 更新状态
          setCurrentResult(mockResult);
          setAnalysisCompleted(true);
          
          // 从等待队列移除并添加到历史队列
          setWaitingQueue(prev => prev.slice(1));
          setHistoryQueue(prev => [completedItem, ...prev]);
          
          setProcessing(false);
          return;
        }
        
        // 直接从前端发起请求到大模型API
        const parsedSettings = settings ? JSON.parse(settings) : null;
        
        if (!parsedSettings || !parsedSettings.apiUrl || !parsedSettings.apiKey) {
          throw new Error('请先在设置中配置API信息');
        }
        
        const apiUrl = parsedSettings.apiUrl;
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsedSettings.apiKey}`
        };
        
        // 清空之前的思考过程
        setThinkingProcess([]);
        
        // 构建请求体
        const body = {
          model: parsedSettings.model || 'DeepSeek-R1',
          messages: [
            {
              role: "user",
              content: `你是一名资深网络文化专家和网名鉴定师，绝对懂梗，精通中文互联网各种流行语、梗和亚文化。现在需要对网名"${currentItem.name}"进行一次专业且有趣的深度解析。请用接地气、有梗、有趣的语言风格进行分析，同时保持专业性。

# 分析维度与评分标准
1. 风格创意 (30分)
- 独特性评估：这个名字有多"卷"？是否能在千篇一律的ID海洋中脱颖而出？
- 创意性分析：有多少"内卷"程度？是否有"整活"的成分？有没有"玩明白"？
- 个性表达：能否体现出用户是什么"亚子"的人？是"卷王"还是"摆烂大师"？

2. 寓意内涵 (40分)
- 梗度解析：蕴含了哪些经典梗或流行梗？梗的"含金量"如何？
- 文化解码：与二次元、游戏、影视、音乐等亚文化的关联度，是否"破次元壁"？
- 社交潜力：能否成为"破圈"利器？会不会引发"共鸣"或"破防"？
- 时代精神：是否反映了当代年轻人的精神状态？有没有"躺平"、"内卷"或"佛系"的元素？

3. 实用性 (30分)
- 传播性：能否轻松"破圈"，成为"爆款"ID？会不会被"挂在嘴边"？
- 平台适应性：在各大平台会不会被"夹"？是否符合"社区规范"？
- 记忆锁定：能否让人"一眼难忘"，产生"回头率"？

在返回最终JSON结果之前，请先思考并输出你的分析过程。

请严格按照以下格式返回分析结果，确保 JSON 位于分隔符之间：

=====JSON_START=====
{
  "score": 总分数值(70-100之间),
  "analysis": {
    "style": {
      "score": 风格分数,
      "uniqueness": "独特性评估（用网络流行语表达）",
      "creativity": "创意性分析（用网络流行语表达）",
      "personality": "个性表达（用网络流行语表达）"
    },
    "meaning": {
      "score": 寓意分数,
      "interpretation": "含义解读（用网络流行语表达）",
      "connotation": "深层寓意（用网络流行语表达）",
      "cultural": "文化联系（用网络流行语表达）",
      "overall": "整体评价（用网络流行语表达）"
    },
    "usability": {
      "score": 实用性分数,
      "readability": "易读性分析（用网络流行语表达）",
      "memorability": "记忆度评估（用网络流行语表达）",
      "versatility": "通用性分析（用网络流行语表达）"
    },
    "summary": "整体评价总结（用网络流行语表达，但保持专业性）"
  }
}
=====JSON_END=====`
            }
          ],
          temperature: 0.8,
          stream: true // 启用流式输出
        };
        
        try {
          // 发送请求
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
          });
          
          if (!response.ok) {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`);
          }
          
          // 处理流式响应
          if (response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let result = null;
            let fullContent = ''; // 存储完整的响应内容
            let fullThinkingContent = ''; // 存储完整的思考内容
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;
              
              // 处理数据流中的事件
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.trim() === '') continue;
                if (line.trim() === 'data: [DONE]') continue;
                
                let data;
                try {
                  // 移除 "data: " 前缀
                  const jsonStr = line.replace(/^data: /, '').trim();
                  data = JSON.parse(jsonStr);
                } catch (e) {
                  console.error('解析流数据失败:', e, line);
                  continue;
                }
                
                // 提取内容 - 处理deepseek模型的特殊格式
                const content = data.choices?.[0]?.delta?.content || '';
                const reasoningContent = data.choices?.[0]?.delta?.reasoning_content || '';
                
                // 累积所有内容
                fullContent += content;
                fullContent += reasoningContent;
                
                // 如果有思考内容，累积并显示
                if (reasoningContent) {
                  fullThinkingContent += reasoningContent;
                  
                  // 更新UI显示 - 显示完整的思考内容
                  setThinkingProcess(() => [fullThinkingContent]);
                  
                  // 更新队列项的思考过程 - 保存完整的思考内容
                  setWaitingQueue(prev => {
                    if (prev.length === 0 || prev[0].id !== updatedItem.id) return prev;
                    const newItem = { 
                      ...prev[0], 
                      thinkingProcess: [fullThinkingContent] 
                    };
                    return [newItem, ...prev.slice(1)];
                  });
                }
              }
            }
            
            // 从完整内容中提取JSON
            const jsonMatch = fullContent.match(/=====JSON_START=====([\s\S]*?)=====JSON_END=====/);
            if (jsonMatch && jsonMatch[1]) {
              try {
                result = JSON.parse(jsonMatch[1].trim());
                console.log('成功从完整内容中提取JSON:', result);
              } catch (e) {
                console.error('从完整内容中解析JSON失败:', e);
              }
            } else {
              console.error('未找到JSON标记，完整内容:', fullContent);
            }
            
            // 如果有解析出结果
            if (result) {
              // 更新为完成状态
              const completedItem: QueueItem = { 
                ...updatedItem, 
                status: 'completed',
                result,
                thinkingProcess: [fullThinkingContent] // 保存完整的思考过程
              };
              
              // 更新状态
              setCurrentResult(result);
              setAnalysisCompleted(true);
              
              // 从等待队列移除并添加到历史队列
              setWaitingQueue(prev => prev.slice(1));
              setHistoryQueue(prev => [completedItem, ...prev]);
            } else {
              throw new Error('未能从响应中解析出有效结果');
            }
          } else {
            throw new Error('响应没有可读取的数据流');
          }
        } catch (error) {
          console.error('API请求错误:', error);
          
          // 更新为错误状态
          const errorItem: QueueItem = {
            ...updatedItem,
            status: 'error',
            error: error instanceof Error ? error.message : '未知错误'
          };
          
          // 更新队列
          setWaitingQueue(prev => prev.slice(1));
          setHistoryQueue(prev => [errorItem, ...prev]);
          
          // 显示错误消息
          alert(`分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      } catch (error) {
        console.error('处理错误:', error);
        
        // 更新为错误状态
        const errorItem: QueueItem = {
          ...updatedItem,
          status: 'error',
          error: error instanceof Error ? error.message : '未知错误'
        };
        
        // 更新队列
        setWaitingQueue(prev => prev.slice(1));
        setHistoryQueue(prev => [errorItem, ...prev]);
        
        // 显示错误消息
        alert(`处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
      } finally {
        setProcessing(false);
      }
    };
    
    processNextItem();
  }, [waitingQueue, processing]);

  // 移除队列项目
  const removeFromQueue = (id: string) => {
    setWaitingQueue(prev => prev.filter(item => item.id !== id));
  };

  // 显示队列项目的状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return (
          <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
            <svg className="w-4 h-4 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        );
      default:
        return null;
    }
  };

  // 查看历史记录
  const viewHistory = (id: string) => {
    const historyItem = historyQueue.find(item => item.id === id);
    if (historyItem && historyItem.result) {
      setCurrentResult(historyItem.result);
      setSelectedHistoryId(id);
      setActiveTab('current');
    }
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  // 重置分析状态
  const resetAnalysis = () => {
    setAnalysisCompleted(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="modern-card mb-6">
          <div className="p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                网名分析
              </h2>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="btn-secondary flex items-center text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                设置
              </button>
            </div>
            
            {/* 猫咪交互组件 */}
            <CatInteraction 
              isProcessing={processing} 
              isCompleted={analysisCompleted} 
              onReset={resetAnalysis}
              inputValue={currentName}
            />
            
            <div className="mb-5">
              <div className="flex">
                <input
                  type="text"
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  placeholder="输入网名..."
                  className="modern-input flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && currentName.trim()) {
                      addToQueue();
                    }
                  }}
                />
                <button
                  onClick={addToQueue}
                  disabled={!currentName.trim()}
                  className="btn-primary ml-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mb-5">
              <div className="flex border-b border-gray-200">
                <button
                  className={`modern-tab ${activeTab === 'current' ? 'active' : ''}`}
                  onClick={() => setActiveTab('current')}
                >
                  当前分析
                </button>
                <button
                  className={`modern-tab ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  历史记录
                </button>
              </div>
            </div>
            
            <div className={`${activeTab === 'current' ? 'block' : 'hidden'}`}>
              {waitingQueue.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    等待队列
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {waitingQueue.map((item, index) => (
                      <div
                        key={item.id}
                        className={`modern-queue-item ${index === 0 && item.status === 'processing' ? 'active' : ''}`}
                      >
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <span className="ml-2 flex-1 truncate font-medium">{item.name}</span>
                          <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
                          {item.status === 'waiting' && (
                            <button
                              onClick={() => removeFromQueue(item.id)}
                              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {item.status === 'processing' && (
                          <div className="mt-2">
                            <div className="modern-progress">
                              <div className="modern-progress-bar" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentResult && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    当前结果
                  </h3>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    总分: <span className="font-semibold">{currentResult.score}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`${activeTab === 'history' ? 'block' : 'hidden'}`}>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {historyQueue.map((item) => (
                  <div
                    key={item.id}
                    className={`modern-queue-item ${selectedHistoryId === item.id ? 'active' : ''}`}
                    onClick={() => item.result && viewHistory(item.id)}
                  >
                    <div className="flex items-center">
                      {getStatusIcon(item.status)}
                      <span className="ml-2 flex-1 truncate font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
                      {item.result && (
                        <span className={`ml-2 text-sm font-medium ${item.result.score >= 90 ? 'text-green-600' : item.result.score >= 75 ? 'text-blue-600' : 'text-amber-600'}`}>
                          {item.result.score}分
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {historyQueue.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    暂无历史记录
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        {currentResult ? (
          <NameAnalysis result={currentResult} />
        ) : (
          <div className="modern-card p-6 flex flex-col h-full">
            {processing && waitingQueue.length > 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingState name={waitingQueue[0].name} thinkingProcess={thinkingProcess} />
              </div>
            ) : (
              <div className="text-center flex-1 flex flex-col items-center justify-center p-8">
                <div className="text-gray-500 mb-6">
                  <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">等待分析结果</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    添加一个网名到队列中开始分析，我们将从多个维度对网名进行专业评测
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => document.querySelector('input')?.focus()}
                    className="btn-primary"
                  >
                    开始分析
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {isSettingsOpen && (
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}; 