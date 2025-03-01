<div align="center">
 <h1><img src="public/images/sanicle_logo.svg" width="200px"><br/><small>女性职场健康管理平台</small></h1>
 <img src="https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white"/>
 <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
 <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
 <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
 <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
</div>

> [!IMPORTANT]
> 本项目是为"联合国妇女署 x Sanicle.cloud 黑客马拉松"竞赛开发的，专注于改善职场女性健康管理的数字解决方案。

[English](README.md) | [简体中文](README.zh-CN.md)

# 🌟 项目简介

Sanicle-AI 是一个专为职场健康设计的综合女性健康平台。该平台为女性员工提供个性化的健康跟踪服务，同时为人力资源部门提供匿名数据洞察，以便更好地进行劳动力规划和员工支持。

## ✨ 核心功能

- 🗓️ **健康日历管理** - 跟踪月经周期、症状和健康数据
- 🤖 **AI健康助手(Sani)** - 获取个性化健康建议和支持
- 📊 **匿名健康数据分析** - 用于HR劳动力规划
- 📱 **双仪表盘系统** - 为员工和HR提供独立界面
- 🔐 **隐私优先架构** - 增强的数据保护措施
- 🏥 **医疗预约集成** - 连接医疗服务提供商
- 📈 **工作效率跟踪** - 关联健康数据与生产力
- 🧠 **心理健康支持** - 跟踪情绪和压力水平

> [!NOTE]
> - 需要 Node.js >= 18.0.0
> - 推荐 PostgreSQL >= 15.0
> - 基于 Next.js 15.0 框架

## 📚 目录

- [🌟 项目简介](#-项目简介)
  - [✨ 核心功能](#-核心功能)
  - [📚 目录](#-目录)
  - [🛠️ 技术栈](#️-技术栈)
  - [📂 项目结构](#-项目结构)
  - [🚀 快速开始](#-快速开始)
    - [前提条件](#前提条件)
    - [安装步骤](#安装步骤)
    - [环境配置](#环境配置)
    - [运行应用](#运行应用)
  - [🖥️ 双仪表盘系统](#️-双仪表盘系统)
    - [员工仪表盘](#员工仪表盘)
    - [HR仪表盘](#hr仪表盘)
  - [🤖 AI助手实现](#-ai助手实现)
    - [功能特点](#功能特点)
    - [技术实现](#技术实现)
  - [🔒 隐私与安全](#-隐私与安全)
  - [🗄️ 数据库架构](#️-数据库架构)
  - [🤝 贡献指南](#-贡献指南)
  - [📄 许可证](#-许可证)

## 🛠️ 技术栈

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/next.js" width="48" height="48" alt="Next.js" />
        <br>Next.js
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/react" width="48" height="48" alt="React" />
        <br>React
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/typescript" width="48" height="48" alt="TypeScript" />
        <br>TypeScript
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/tailwindcss" width="48" height="48" alt="Tailwind CSS" />
        <br>Tailwind
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/postgresql" width="48" height="48" alt="PostgreSQL" />
        <br>PostgreSQL
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/drizzle" width="48" height="48" alt="Drizzle ORM" />
        <br>Drizzle ORM
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/google/4285F4" width="48" height="48" alt="Google AI" />
        <br>Google AI
      </td>
    </tr>
  </table>
</div>

> [!TIP]
> 我们技术栈中的每个组件都是基于其可靠性、现代特性和开发者体验选择的。AI功能利用了Google的先进AI模型。

## 📂 项目结构

```
sanicle-ai/
├── app/                  # Next.js应用目录
│   ├── (auth)/           # 认证页面和逻辑
│   ├── api/              # API路由
│   ├── employee-dashboard/ # 面向员工的功能
│   ├── hr-dashboard/     # HR管理功能
│   └── (chat)/           # AI助手聊天功能
├── components/          # 可复用UI组件
│   ├── custom/          # 自定义项目组件
│   └── ui/              # UI库组件
├── db/                  # 数据库相关文件
│   ├── migrations/      # 数据库迁移
│   ├── queries.ts       # 数据库查询
│   └── schema.ts        # 数据库架构定义
├── lib/                 # 实用工具库
│   ├── auth.ts          # 认证实用工具
│   ├── db.ts            # 数据库连接
│   └── utils.ts         # 通用实用工具
├── ai/                  # AI功能
│   ├── actions.ts       # AI操作和处理程序
│   └── custom-middleware.ts # AI功能的中间件
└── public/              # 静态资源
```

## 🚀 快速开始

### 前提条件

> [!IMPORTANT]
> 开始前，请确保您已安装以下内容：
> - Node.js 18.0.0或更高版本
> - PostgreSQL 15.0或更高版本
> - Git
> - npm, pnpm, 或 yarn

### 安装步骤

1. 克隆仓库：
```bash
git clone https://github.com/ChanMeng666/sanicle-ai.git
cd sanicle-ai
```

2. 安装依赖：
```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 环境配置

1. 基于`.env.example`创建`.env.local`文件：
```bash
cp .env.example .env.local
```

2. 更新`.env.local`文件，填入您的数据库凭证和API密钥。

3. 设置数据库：
```bash
npx drizzle-kit push:pg
# 或
npm run migrate
```

### 运行应用

1. 启动开发服务器：
```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

2. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 🖥️ 双仪表盘系统

### 员工仪表盘

员工仪表盘提供个性化的健康管理体验：

- **健康日历**：跟踪月经周期、症状和健康模式
- **情绪和健康追踪器**：监测情绪健康和压力水平
- **AI健康助手**：从Sani获取个性化健康建议
- **医疗预约**：安排和管理医疗访问
- **请假管理**：申请和跟踪与健康相关的请假

### HR仪表盘

HR仪表盘提供匿名健康数据洞察，用于更好的劳动力规划：

- **劳动力分析**：查看员工健康和请假模式趋势
- **请假管理**：处理和批准与健康相关的请假申请
- **生产力洞察**：将健康模式与工作效率相关联
- **健康教育**：获取支持员工健康的资源
- **以隐私为中心的设计**：所有数据都经过匿名化和聚合

## 🤖 AI助手实现

Sani，AI健康助手，为员工提供个性化支持和指导。

### 功能特点

- **个性化健康建议**：基于跟踪的健康数据
- **医学知识**：回答与健康相关的问题
- **预约协助**：帮助安排医疗预约
- **心理健康支持**：关于压力和情绪健康的对话
- **隐私保护**：用户数据保护的保密互动

### 技术实现

AI助手由Google的AI模型通过@ai-sdk/google集成提供支持，并配有自定义中间件用于处理特定健康查询和确保隐私。

## 🔒 隐私与安全

Sanicle-AI优先考虑用户隐私，采取以下措施：

- **数据匿名化**：HR仪表盘仅显示匿名化、聚合的数据
- **端到端加密**：所有健康数据的安全通信
- **基于角色的访问**：适用于不同用户类型的严格权限系统
- **GDPR合规**：所有数据处理都遵循GDPR原则
- **安全认证**：使用JWT和next-auth的高级认证系统

## 🗄️ 数据库架构

我们的数据库设计包括以下核心表：

- `User`：用户资料和认证数据
- `HealthRecord`：健康跟踪数据，包括月经周期、症状等
- `Chat`：AI助手对话历史
- `Reservation`：医疗预约预订信息

## 🤝 贡献指南

我们欢迎贡献！请按照以下步骤操作：

1. Fork仓库
2. 创建您的功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交您的更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 打开Pull Request

## 📄 许可证

本项目基于Apache License 2.0许可证 - 详情请参阅[LICENSE](LICENSE)文件。

## 🙋‍♀ 开发者
**Chan Meng**
- <img src="https://cdn.simpleicons.org/linkedin/0A66C2" width="16" height="16"> LinkedIn: [chanmeng666](https://www.linkedin.com/in/chanmeng666/)
- <img src="https://cdn.simpleicons.org/github/181717" width="16" height="16"> GitHub: [ChanMeng666](https://github.com/ChanMeng666)

---

<div align="center">
用❤️为职场女性健康而制
<br/>
⭐ 在GitHub上为我们加星 | 📖 阅读文档 | 🐛 报告问题
</div> 