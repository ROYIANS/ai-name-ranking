# AI网名鉴定师

一个有趣的网名分析工具，使用AI深度解析网名的风格、寓意和实用性，并给出专业评分。

## 功能特点

- 使用大语言模型进行网名深度分析
- 实时显示AI思考过程
- 支持多个网名的队列分析
- 历史记录查看
- 完全静态部署，无需后端服务器

## 部署指南

### 本地开发

1. 克隆仓库
```bash
git clone <仓库地址>
cd ai-name-ranking
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

### 静态部署

本项目可以完全静态部署，所有API调用直接从浏览器发起。

#### 构建静态文件

```bash
npm run build
```

构建完成后，静态文件将生成在`out`目录中。

#### 部署选项

1. **Vercel部署**（推荐）

最简单的方式是使用Vercel部署：

```bash
npm install -g vercel
vercel
```

2. **GitHub Pages部署**

将`out`目录推送到GitHub仓库的`gh-pages`分支：

```bash
# 安装gh-pages工具
npm install -g gh-pages

# 部署
gh-pages -d out
```

3. **Netlify部署**

- 在Netlify创建新站点
- 选择GitHub仓库
- 构建命令设置为`npm run build`
- 发布目录设置为`out`

4. **其他静态托管服务**

可以将`out`目录上传到任何静态文件托管服务，如：
- 阿里云OSS
- 腾讯云COS
- 七牛云
- AWS S3

5. **本地测试静态部署**

```bash
npm run serve
```

## 使用说明

1. 在设置中配置API信息（API URL和API Key）
2. 输入要分析的网名
3. 点击"开始分析"按钮
4. 观看AI实时思考过程
5. 查看分析结果

## 注意事项

- 需要自行提供大语言模型API的访问凭证
- 默认使用DeepSeek-R1模型，也可以在设置中更改
- 所有API调用直接从浏览器发起，请确保API密钥的安全性

## 技术栈

- Next.js 15
- React
- Tailwind CSS
- TypeScript
