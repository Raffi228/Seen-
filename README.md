<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<div align="center">
  <h1>Seen / 知遇</h1>
  <strong>你的专属 AI 求职 Coach，让每个求职者的闪光点被看见。</strong>
</div>

<p align="center">
  <a href="https://seen-723374301131.us-west1.run.app/" target="_blank">
    <strong>在线体验 &raquo;</strong>
  </a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini">
</p>

---

## 🚀 项目简介 (Introduction)

**Seen / 知遇** 是一款基于 Google Gemini AI 模型的智能求职助手，旨在帮助求职者解决简历撰写和求职信定制的难题。通过 AI 的引导和分析，用户可以轻松梳理个人经历，并针对心仪的岗位，一键生成高度匹配的定制化简历和专属打招呼消息，从而在众多候选人中脱颖而出。

## ✨ 核心功能 (Key Features)

- **AI 引导写简历**: 通过与 AI Coach "知遇" 进行多轮对话，引导用户梳理并挖掘自身的工作经历、项目经验和技能亮点，最终自动生成一份专业完整的简历。
- **"千岗千历" 定制**: 用户可上传自己的基础简历（PDF格式），并粘贴目标岗位的 JD（Job Description）。AI 将深度分析 JD 要求，结合用户简历，智能重塑一份完美契合该岗位的全新简历。
- **建议打招呼消息**: 在生成定制化简历的同时，AI 会根据岗位要求和用户优势，撰写一段专业、热情且有针对性的打招呼消息，提高求职沟通的效率和成功率。
- **PDF 简历导出**: 用户可以将 AI 生成的定制化简历一键导出为 PDF 文件，文件名会自动格式化为 `公司-岗位-简历.pdf`，方便投递和管理。

## 🛠️ 技术栈 (Tech Stack)

- **前端框架**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **AI 模型**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
- **UI 样式**: [Tailwind CSS](https://tailwindcss.com/)
- **PDF 处理**:
  - **解析**: [pdf.js](https://mozilla.github.io/pdf.js/)
  - **生成**: [jspdf](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/)
- **运行环境**: [Node.js](https://nodejs.org/)

## 本地运行 (Run Locally)

请按照以下步骤在本地运行此项目。

**1. 环境准备 (Prerequisites)**

- 确保你已经安装了 [Node.js](https://nodejs.org/) (v18 或更高版本)。

**2. 克隆并安装 (Clone & Install)**

```bash
# 克隆仓库
git clone <your-repository-url>

# 进入项目目录
cd <project-directory>

# 安装依赖
npm install
```

**3. 配置环境变量 (Configure Environment)**

- 在项目根目录下创建一个名为 `.env` 的文件。
- 获取你的 Google Gemini API 密钥，并将其添加到 `.env` 文件中。

**.env**
```
API_KEY="YOUR_GEMINI_API_KEY"
```
> **注意**: 我们的代码直接从 `process.env.API_KEY` 读取密钥，请确保变量名正确。

**4. 启动项目 (Run the App)**

```bash
npm run dev
```

现在，你可以在浏览器中访问 `http://localhost:5173` (或终端提示的其他地址) 来查看并使用你的应用了。

## ☁️ 部署 (Deployment)

本项目可以轻松部署到任何支持 Node.js 的平台。

你也可以在 AI Studio 中查看和部署此应用: [https://ai.studio/apps/drive/1OYZMNDLCkvusfg-froIu2oQGOFMzcpBd](https://ai.studio/apps/drive/1OYZMNDLCkvusfg-froIu2oQGOFMzcpBd)
