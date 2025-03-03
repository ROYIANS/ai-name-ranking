/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 启用静态导出
  distDir: 'out', // 输出目录
  images: {
    unoptimized: true, // 静态导出时需要禁用图片优化
  },
  // 如果有API路由，需要在静态导出时处理
  // 由于我们的API调用是直接从前端到大模型API的，所以不需要担心
};

export default nextConfig; 