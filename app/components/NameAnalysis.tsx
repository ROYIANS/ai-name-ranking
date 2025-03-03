'use client';

import { AnalysisItem } from './AnalysisItem';
import { Footer } from './Footer';

interface AnalysisCardProps {
  title: string;
  score: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  icon: React.ReactNode;
}

const AnalysisCard = ({ title, score, children, style, icon }: AnalysisCardProps) => {
  // 根据分数确定颜色和类名
  const getScoreBadgeClass = () => {
    if (score >= 90) return 'score-badge-success';
    if (score >= 75) return 'score-badge-primary';
    return 'score-badge-warning';
  };

  return (
    <div className="modern-card h-full hover:scale-[1.02] transition-transform" style={style}>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="mr-3">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className={`score-badge ${getScoreBadgeClass()}`}>
            {score}分
          </div>
        </div>
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};

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

export const NameAnalysis = ({ result }: { result: AnalysisResult }) => {
  // 根据分数确定颜色
  const getScoreColor = () => {
    if (result.score >= 90) return 'text-green-600';
    if (result.score >= 75) return 'text-blue-600';
    return 'text-amber-600';
  };

  // 根据分数确定背景渐变
  const getScoreGradient = () => {
    if (result.score >= 90) return 'from-green-50 to-green-100';
    if (result.score >= 75) return 'from-blue-50 to-blue-100';
    return 'from-amber-50 to-amber-100';
  };

  return (
    <div className="space-y-5 w-full">
      <div id="analysis-result" className="space-y-5">
        <div className="modern-card overflow-hidden">
          <div className={`p-6 bg-gradient-to-r ${getScoreGradient()}`}>
            <div className="flex items-center">
              <div className={`text-5xl font-bold ${getScoreColor()} mr-6 transition-all duration-500 hover:scale-110`}>
                {result.score}分
              </div>
              <div className="flex-1 text-gray-600 max-w-3xl">
                {result.analysis.summary}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AnalysisCard
            title="风格创意"
            score={result.analysis.style.score}
            icon={
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            }
          >
            <AnalysisItem title="独特性" content={result.analysis.style.uniqueness} />
            <AnalysisItem title="创意性" content={result.analysis.style.creativity} />
            <AnalysisItem title="个性表达" content={result.analysis.style.personality} />
          </AnalysisCard>

          <AnalysisCard
            title="实用性"
            score={result.analysis.usability.score}
            icon={
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            }
          >
            <AnalysisItem title="易读性" content={result.analysis.usability.readability} />
            <AnalysisItem title="记忆度" content={result.analysis.usability.memorability} />
            <AnalysisItem title="通用性" content={result.analysis.usability.versatility} />
          </AnalysisCard>

          <AnalysisCard
            title="寓意内涵"
            score={result.analysis.meaning.score}
            icon={
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            }
          >
            <AnalysisItem title="含义解读" content={result.analysis.meaning.interpretation} />
            <AnalysisItem title="深层寓意" content={result.analysis.meaning.connotation} />
            <AnalysisItem title="文化联系" content={result.analysis.meaning.cultural} />
            <AnalysisItem title="整体评价" content={result.analysis.meaning.overall} />
          </AnalysisCard>
        </div>

        <Footer />
      </div>
    </div>
  );
}; 