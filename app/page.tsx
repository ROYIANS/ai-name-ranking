import { ClientLayout } from './components/ClientLayout';
import { QueueSystem } from './components/QueueSystem';
import { Live2D } from './components/Live2D';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-thin mb-3 text-gray-900">
            网名分析
          </h1>
          <div className="h-1 w-24 bg-[#3E63DD] mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            专业的网名评测工具，深度分析你的网名
          </p>
        </div>

        <ClientLayout>
          <QueueSystem />
        </ClientLayout>

        <Live2D />
      </div>
    </main>
  );
}
