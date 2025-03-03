'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';

export const SaveImage = () => {
  const [saving, setSaving] = useState(false);

  const handleSaveImage = async () => {
    try {
      setSaving(true);
      const element = document.getElementById('analysis-result');
      if (!element) {
        throw new Error('分析结果元素不存在');
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `网名分析-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('保存图片失败:', error);
      alert(`保存图片失败: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSaveImage}
      disabled={saving}
      className="btn-primary flex items-center"
    >
      {saving ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          处理中...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          保存图片
        </>
      )}
    </button>
  );
}; 