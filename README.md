<div align="center">
 <h1><img src="public/images/sanicle_logo.svg" width="80px"><br/><small>Women's Health Platform for Workplace Wellness</small></h1>
 <img src="https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white"/>
 <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
 <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
 <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
 <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
</div>

> [!IMPORTANT]
> This project was developed for the "UN Women x Sanicle.cloud Hackathon" competition, focusing on digital solutions to improve workplace women's health management.

[English](README.md) | [简体中文](README.zh-CN.md)

# 🌟 Introduction

Sanicle-AI is a comprehensive women's health platform designed for workplace wellness. The platform offers personalized health tracking for female employees while providing HR departments with anonymized data insights for better workforce planning and employee support.

## ✨ Key Features

- 🗓️ **Health Calendar Management** - Track menstrual cycles, symptoms, and health data
- 🤖 **AI Health Assistant (Sani)** - Get personalized health advice and support
- 📊 **Anonymous Health Data Analysis** - For HR workforce planning
- 📱 **Dual Dashboard System** - Separate interfaces for employees and HR
- 🔐 **Privacy-First Architecture** - Enhanced data protection measures
- 🏥 **Medical Appointment Integration** - Connect with healthcare providers
- 📈 **Work Efficiency Tracking** - Correlate health data with productivity
- 🧠 **Mental Health Support** - Track mood and stress levels

> [!NOTE]
> - Node.js >= 18.0.0 required
> - PostgreSQL >= 15.0 recommended
> - Next.js 15.0 framework

## 📚 Table of Contents

- [🌟 Introduction](#-introduction)
  - [✨ Key Features](#-key-features)
  - [📚 Table of Contents](#-table-of-contents)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [📂 Project Structure](#-project-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)
    - [Running the Application](#running-the-application)
  - [🖥️ Dual Dashboard System](#️-dual-dashboard-system)
    - [Employee Dashboard](#employee-dashboard)
    - [HR Dashboard](#hr-dashboard)
  - [🤖 AI Assistant Implementation](#-ai-assistant-implementation)
    - [Features](#features)
    - [Technology](#technology)
  - [🔒 Privacy \& Security](#-privacy--security)
  - [🗄️ Database Schema](#️-database-schema)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## 🛠️ Tech Stack

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
> Each component in our tech stack was chosen for its reliability, modern features, and developer experience. The AI functionality leverages Google's advanced AI models.

## 📂 Project Structure

```
sanicle-ai/
├── app/                  # Next.js app directory
│   ├── (auth)/           # Authentication pages & logic
│   ├── api/              # API routes
│   ├── employee-dashboard/ # Employee-facing features
│   ├── hr-dashboard/     # HR management features
│   └── (chat)/           # AI assistant chat functionality
├── components/          # Reusable UI components
│   ├── custom/          # Custom project components
│   └── ui/              # UI library components
├── db/                  # Database related files
│   ├── migrations/      # Database migrations
│   ├── queries.ts       # Database queries
│   └── schema.ts        # Database schema definitions
├── lib/                 # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database connection
│   └── utils.ts         # General utilities
├── ai/                  # AI functionality
│   ├── actions.ts       # AI actions and handlers
│   └── custom-middleware.ts # Middleware for AI features
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

> [!IMPORTANT]
> Before you begin, ensure you have the following installed:
> - Node.js 18.0.0 or higher
> - PostgreSQL 15.0 or higher
> - Git
> - npm, pnpm, or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ChanMeng666/sanicle-ai.git
cd sanicle-ai
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

### Environment Setup

1. Create a `.env.local` file based on the `.env.example`:
```bash
cp .env.example .env.local
```

2. Update the `.env.local` file with your database credentials and API keys.

3. Set up the database:
```bash
npx drizzle-kit push:pg
# or
npm run migrate
```

### Running the Application

1. Start the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🖥️ Dual Dashboard System

### Employee Dashboard

The Employee Dashboard provides a personalized health management experience:

- **Health Calendar**: Track menstrual cycles, symptoms, and health patterns
- **Mood and Wellness Tracker**: Monitor emotional well-being and stress levels
- **AI Health Assistant**: Get personalized health advice from Sani
- **Medical Appointments**: Schedule and manage healthcare visits
- **Leave Management**: Request and track health-related leave

### HR Dashboard

The HR Dashboard offers anonymized health data insights for better workforce planning:

- **Workforce Analytics**: View trends in employee health and leave patterns
- **Leave Management**: Process and approve health-related leave requests
- **Productivity Insights**: Correlate health patterns with work efficiency
- **Health Education**: Access resources for supporting employee health
- **Privacy-Focused Design**: All data is anonymized and aggregated

## 🤖 AI Assistant Implementation

Sani, the AI health assistant, provides personalized support and guidance to employees.

### Features

- **Personalized Health Advice**: Based on tracked health data
- **Medical Knowledge**: Answers to health-related questions
- **Appointment Assistance**: Help with scheduling medical appointments
- **Mental Health Support**: Conversations about stress and emotional well-being
- **Privacy Protection**: Confidential interactions with user data protection

### Technology

The AI assistant is powered by Google's AI models through the @ai-sdk/google integration, with custom middleware for handling health-specific queries and ensuring privacy.

## 🔒 Privacy & Security

Sanicle-AI prioritizes user privacy with the following measures:

- **Data Anonymization**: HR dashboard only shows anonymized, aggregated data
- **End-to-End Encryption**: Secure communication for all health data
- **Role-Based Access**: Strict permission system for different user types
- **GDPR Compliance**: All data handling adheres to GDPR principles
- **Secure Authentication**: Advanced auth system with JWT and next-auth

## 🗄️ Database Schema

Our database design includes the following core tables:

- `User`: User profiles and authentication data
- `HealthRecord`: Health tracking data including menstrual cycles, symptoms, etc.
- `Chat`: AI assistant conversation history
- `Reservation`: Medical appointment booking information

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀ Author
**Chan Meng**
- <img src="https://cdn.simpleicons.org/linkedin/0A66C2" width="16" height="16"> LinkedIn: [chanmeng666](https://www.linkedin.com/in/chanmeng666/)
- <img src="https://cdn.simpleicons.org/github/181717" width="16" height="16"> GitHub: [ChanMeng666](https://github.com/ChanMeng666)

---

<div align="center">
Made with ❤️ for women's health in the workplace
<br/>
⭐ Star us on GitHub | 📖 Read the Docs | 🐛 Report an Issue
</div>
