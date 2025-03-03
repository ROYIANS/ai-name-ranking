interface AnalysisItemProps {
  title: string;
  content: string;
}

export const AnalysisItem = ({ title, content }: AnalysisItemProps) => {
  return (
    <div className="analysis-item">
      <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
      <div className="text-sm text-gray-600">{content}</div>
    </div>
  );
}; 