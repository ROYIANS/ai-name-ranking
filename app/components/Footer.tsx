'use client';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="text-center text-sm text-gray-500 mt-8 mb-4">
      © VIDORRA {currentYear} 网名分析 | 结果由 AI 生成，仅供参考
    </footer>
  );
}; 