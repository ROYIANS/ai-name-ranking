export const AnalysisCard = ({ 
  title, 
  score, 
  children, 
  style 
}: { 
  title: string; 
  score: number; 
  children: React.ReactNode; 
  style?: React.CSSProperties;
}) => (
  <div style={style} className="rounded-2xl p-6 transition-colors">
    <div className="flex justify-between items-center mb-4">
      <h3 style={{ color: '#1f2937' }} className="text-lg font-semibold">
        {title}
      </h3>
      <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#374151', borderColor: '#e5e7eb' }} className="text-lg font-semibold px-3 py-1 rounded-full shadow-sm border">
        {score}分
      </span>
    </div>
    <div className="space-y-3">
      {children}
    </div>
  </div>
); 