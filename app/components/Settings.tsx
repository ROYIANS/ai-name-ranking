'use client';

import { useState, useEffect } from 'react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiSettings {
  apiUrl: string;
  apiKey: string;
  model: string;
}

export const Settings = ({ isOpen, onClose }: SettingsProps) => {
  const [settings, setSettings] = useState<ApiSettings>({
    apiUrl: '',
    apiKey: '',
    model: 'gpt-3.5-turbo',
  });

  // 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('nameAnalyzerSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  // 保存设置
  const saveSettings = () => {
    localStorage.setItem('nameAnalyzerSettings', JSON.stringify(settings));
    onClose();
  };

  // 重置设置
  const resetSettings = () => {
    localStorage.removeItem('nameAnalyzerSettings');
    setSettings({
      apiUrl: '',
      apiKey: '',
      model: 'gpt-3.5-turbo',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modern-card w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">设置</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">API 地址</label>
            <input
              type="text"
              value={settings.apiUrl}
              onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
              placeholder="https://api.example.com/v1/chat/completions"
              className="modern-input"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">API 密钥</label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="sk-..."
              className="modern-input"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">模型</label>
            <select
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              className="modern-input"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="DeepSeek-R1">DeepSeek-R1</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={resetSettings}
              className="modern-button-secondary"
            >
              重置
            </button>
            <button
              onClick={saveSettings}
              className="modern-button"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 