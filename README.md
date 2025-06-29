<div align="center"><a name="readme-top"></a>

[![Project Banner](./public/images/sanicle_logo.svg)](#)

# 🌸 Sanicle-AI<br/><h3>Women's Health Platform for Workplace Wellness</h3>

A comprehensive women's health platform designed for workplace wellness that combines AI-powered health assistance, multi-tenant architecture, and privacy-first design.<br/>
Supports health tracking, AI consultations, leave management, and organizational analytics.<br/>
One-click **FREE** deployment with enterprise-grade security and scalability.

[Live Demo][demo-link] · [Documentation][docs] · [API Reference][api-docs] · [Issues][github-issues-link]

<br/>

[![🚀 Visit Live Site 🚀](https://gradient-svg-generator.vercel.app/api/svg?text=%F0%9F%9A%80Visit%20Live%20Site%F0%9F%9A%80&color=000000&height=60&gradientType=radial&duration=6s&color0=ffffff&template=pride-rainbow)][demo-link]

<br/>

<!-- SHIELD GROUP -->

[![][github-release-shield]][github-release-link]
[![][vercel-shield]][vercel-link]
[![][license-shield]][license-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]<br>

**Share Project Repository**

[![][share-x-shield]][share-x-link]
[![][share-linkedin-shield]][share-linkedin-link]
[![][share-reddit-shield]][share-reddit-link]

<sup>🌟 Pioneering the future of women's health in the workplace. Built for enterprises and organizations of all sizes.</sup>

## 📸 Project Screenshots

> [!TIP]
> Explore the comprehensive dashboard system designed specifically for women's health management in workplace environments.

<div align="center">
  <img src="https://github.com/user-attachments/assets/5c283230-ea92-450b-8c80-aa28bb2045bc" alt="Main Dashboard Overview" width="800"/>
  <p><em>Multi-Level Dashboard System - Tailored for different user roles</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/dd1f2537-673d-47c6-b555-f9295520cd88" alt="Employee Dashboard" width="400"/>
  <img src="https://github.com/user-attachments/assets/4fee0238-d046-4940-900f-90aecc5d6a71" alt="HR Dashboard" width="400"/>
  <p><em>Employee Dashboard (left) and HR Management Dashboard (right)</em></p>
</div>

<details>
<summary><kbd>📱 More Screenshots</kbd></summary>

<div align="center">
  <img src="https://github.com/user-attachments/assets/77349073-674c-4f6a-82e6-7adb53ab0dd6" alt="Resource Management" width="600"/>
  <p><em>Resource Management - Educational materials and policy documents</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/11669e42-92ed-4121-a57c-358b6e605b85" alt="Event Management" width="600"/>
  <p><em>Event Management - Health workshops and webinars</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/d7fdcb72-4120-4ff9-bee5-8036000901fa" alt="AI Assistant" width="600"/>
  <p><em>Dual AI System - IBM Watson X and Google Gemini integration</em></p>
</div>

</details>

**Tech Stack Badges:**

<div align="center">

 <img src="https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
 <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
 <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
 <img src="https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
 <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
 <img src="https://img.shields.io/badge/drizzle-%23c5f74f.svg?style=for-the-badge&logo=drizzle&logoColor=black"/>
 <img src="https://img.shields.io/badge/IBM%20Watson-052FAD?style=for-the-badge&logo=ibm&logoColor=white"/>

</div>

</div>

> [!IMPORTANT]
> This project was developed for the "UN Women x Sanicle.cloud Hackathon" competition, focusing on digital solutions to improve workplace women's health management. It demonstrates enterprise-grade multi-tenant architecture with advanced AI capabilities for health support.

<details>
<summary><kbd>📑 Table of Contents</kbd></summary>

#### TOC

- [🌸 Sanicle-AIWomen's Health Platform for Workplace Wellness](#-sanicle-aiwomens-health-platform-for-workplace-wellness)
  - [📸 Project Screenshots](#-project-screenshots)
      - [TOC](#toc)
      - [](#)
  - [🌟 Introduction](#-introduction)
  - [✨ Key Features](#-key-features)
    - [`1` Health Calendar \& Tracking](#1-health-calendar--tracking)
    - [`2` Dual AI Assistant System](#2-dual-ai-assistant-system)
    - [`*` Enterprise Features](#-enterprise-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Architecture](#️-architecture)
    - [System Architecture](#system-architecture)
    - [Multi-Tenant Data Flow](#multi-tenant-data-flow)
    - [Component Structure](#component-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Quick Installation](#quick-installation)
    - [Environment Setup](#environment-setup)
    - [Database Setup](#database-setup)
  - [🛳 Deployment](#-deployment)
    - [`A` Cloud Deployment](#a-cloud-deployment)
    - [`B` Docker Deployment](#b-docker-deployment)
    - [`C` Environment Variables](#c-environment-variables)
  - [🖥️ Multi-Level Dashboard System](#️-multi-level-dashboard-system)
    - [Employee Dashboard](#employee-dashboard)
    - [HR Dashboard](#hr-dashboard)
    - [Organization Admin Dashboard](#organization-admin-dashboard)
    - [Super Admin Dashboard](#super-admin-dashboard)
  - [🤖 Dual AI Integration](#-dual-ai-integration)
    - [IBM Watson X AI](#ibm-watson-x-ai)
    - [Google Gemini AI](#google-gemini-ai)
    - [AI Comparison](#ai-comparison)
  - [🔒 Privacy \& Security](#-privacy--security)
  - [🗄️ Database Schema](#️-database-schema)
  - [📖 API Reference](#-api-reference)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [👥 Team](#-team)

####

<br/>

</details>

## 🌟 Introduction

Sanicle-AI is a groundbreaking women's health platform that transforms workplace wellness through cutting-edge technology. Built with a multi-tenant architecture, the platform serves organizations of all sizes while maintaining strict data privacy and providing comprehensive health management tools specifically designed for women's physiological and psychological well-being.

Whether you're an employee tracking your health journey, an HR professional analyzing workforce wellness trends, or an organization administrator managing health programs, Sanicle-AI provides the tools and insights needed to foster a healthier, more supportive workplace environment.

> [!NOTE]
> - Next.js 15 and React 19 for cutting-edge performance
> - PostgreSQL with advanced multi-tenant data isolation
> - Dual AI system combining IBM Watson X and Google Gemini
> - Enterprise-grade security with role-based access control

| [![][demo-shield-badge]][demo-link]   | Experience our platform firsthand with no installation required.                           |
| :------------------------------------ | :--------------------------------------------------------------------------------------------- |
| [![][docs-shield-badge]][docs] | Comprehensive documentation and integration guides available. |

> [!TIP]
> **⭐ Star us** to receive notifications about new features and updates!

[![][image-star]][github-stars-link]

## ✨ Key Features

[![][image-feat-health]][docs-health-features]

### `1` [Health Calendar & Tracking][docs-health-features]

Experience next-generation health tracking designed specifically for women's wellness. Our innovative approach provides unprecedented insights through advanced tracking capabilities and personalized analytics.

<div align="center">
  <img src="https://github.com/user-attachments/assets/b5d34a6a-b80e-40fc-aaf7-d7d3f51a29ef" alt="Health Calendar Demo" width="600"/>
  <p><em>Comprehensive Health Calendar with Period Tracking</em></p>
</div>

Key capabilities include:
- 🌸 **Menstrual Cycle Tracking**: Advanced cycle prediction and symptom monitoring
- 😊 **Mood & Wellness**: Emotional well-being tracking with stress level indicators  
- 💤 **Sleep & Lifestyle**: Sleep pattern analysis and lifestyle factor correlation
- 📊 **Health Analytics**: Personalized insights and trend analysis

[![][back-to-top]](#readme-top)

### `2` [Dual AI Assistant System][docs-ai-features]

Revolutionary AI-powered health support that combines the best of enterprise AI platforms. Our dual AI system provides comprehensive health guidance through multiple interaction channels.

<div align="center">
  <img src="https://github.com/user-attachments/assets/d7fdcb72-4120-4ff9-bee5-8036000901fa" alt="AI Assistant Interface" width="600"/>
  <p><em>Dual AI System - IBM Watson X and Google Gemini</em></p>
</div>

**AI Capabilities:**
- **IBM Watson X**: Enterprise-grade chat widget for quick health conversations
- **Google Gemini**: In-depth health consultations with comprehensive analysis
- **24/7 Availability**: Always-on health support and guidance
- **Privacy-First**: Secure, confidential interactions with advanced encryption

[![][back-to-top]](#readme-top)

### `*` Enterprise Features

Beyond core health features, Sanicle-AI includes comprehensive enterprise functionality:

- [x] 🏢 **Multi-Tenant Architecture**: Complete data isolation between organizations
- [x] 👥 **Role-Based Access Control**: Employee, HR, Admin, and Super Admin levels
- [x] 📋 **Leave Management**: Health-related leave requests with AI assistance
- [x] 📚 **Resource Management**: Educational materials and policy document distribution
- [x] 📅 **Event Management**: Health workshops, webinars, and wellness programs
- [x] 📊 **Analytics Dashboard**: Anonymized workforce health insights for HR
- [x] 🔐 **Enterprise Security**: GDPR-compliant with audit logging
- [x] 📱 **Mobile Responsive**: Progressive Web App with native-like experience

> ✨ Continuously expanding with new features based on user feedback and healthcare best practices.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🛠️ Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/nextdotjs" width="48" height="48" alt="Next.js" />
        <br>Next.js 15
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/react" width="48" height="48" alt="React" />
        <br>React 19
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/typescript" width="48" height="48" alt="TypeScript" />
        <br>TypeScript 5
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
        <img src="https://cdn.simpleicons.org/tailwindcss" width="48" height="48" alt="Tailwind CSS" />
        <br>Tailwind CSS
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/ibm/052FAD" width="48" height="48" alt="IBM Watson X" />
        <br>IBM Watson X
      </td>
      <td align="center" width="96">
        <img src="https://cdn.simpleicons.org/google/4285F4" width="48" height="48" alt="Google AI" />
        <br>Google Gemini
      </td>
    </tr>
  </table>
</div>

**Frontend Excellence:**
- **Framework**: Next.js 15 with App Router and React 19 RC
- **Language**: TypeScript for enterprise-grade type safety
- **Styling**: Tailwind CSS with custom design system + Framer Motion
- **UI Components**: Radix UI primitives with custom health-focused components
- **State Management**: React hooks with SWR for data fetching

**Backend Power:**
- **Runtime**: Node.js with Edge Runtime support
- **Database**: PostgreSQL with advanced multi-tenant architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: NextAuth.js with JWT and session management
- **File Storage**: Vercel Blob for secure document storage

**AI & Intelligence:**
- **Dual AI System**: IBM Watson X for quick interactions, Google Gemini for deep consultations
- **Health Focus**: Custom training and prompts for women's health expertise
- **Streaming**: Real-time AI responses with Server-Sent Events

**DevOps & Deployment:**
- **Platform**: Vercel with automatic deployments
- **Database**: Vercel Postgres with connection pooling
- **Monitoring**: Built-in analytics and error tracking
- **Security**: Enterprise-grade with GDPR compliance

> [!TIP]
> Each technology was selected for production readiness, developer experience, and scalability for enterprise health data management.

## 🏗️ Architecture

### System Architecture

> [!TIP]
> This architecture supports horizontal scaling and enterprise multi-tenant patterns, ensuring data isolation and performance at scale.

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js 15 App] --> B[React 19 Components]
        B --> C[Zustand State]
        C --> D[SWR Data Layer]
    end
    
    subgraph "API Layer"
        E[Next.js API Routes] --> F[Business Logic]
        F --> G[Drizzle ORM]
        G --> H[PostgreSQL]
    end
    
    subgraph "AI Services"
        I[IBM Watson X]
        J[Google Gemini]
        K[Health AI Middleware]
    end
    
    subgraph "External Services"
        L[NextAuth.js]
        M[Vercel Blob]
        N[Analytics]
        O[Audit Logging]
    end
    
    D --> E
    F --> K
    K --> I
    K --> J
    F --> L
    F --> M
    F --> N
    F --> O
    
    subgraph "Infrastructure"
        P[Vercel Edge]
        Q[CDN]
        R[Connection Pooling]
    end
    
    A --> P
    P --> Q
    H --> R
```

### Multi-Tenant Data Flow

```mermaid
flowchart TB
    subgraph "Organization A"
        OA_Users[Users]
        OA_Health[Health Data]
        OA_Events[Events]
    end
    
    subgraph "Organization B"
        OB_Users[Users]
        OB_Health[Health Data]
        OB_Events[Events]
    end
    
    subgraph "Database Layer"
        DB[(PostgreSQL)]
        Isolation[Data Isolation]
    end
    
    subgraph "Access Control"
        RBAC[Role-Based Access]
        OrgFilter[Organization Filtering]
        DataMask[Data Anonymization]
    end
    
    OA_Users --> RBAC
    OB_Users --> RBAC
    RBAC --> OrgFilter
    OrgFilter --> Isolation
    Isolation --> DB
    DB --> DataMask
    DataMask --> Analytics[HR Analytics]
```

### Component Structure

```
app/
├── (auth)/                    # Authentication layout group
│   ├── login/                # Login with organization context
│   ├── register/             # Multi-tenant registration
│   └── auth.ts               # NextAuth.js configuration
├── employee-dashboard/        # Employee health management
│   ├── [userId]/
│   │   ├── components/       # Health tracking components
│   │   ├── resources/        # Educational materials
│   │   ├── events/          # Health events & workshops
│   │   └── feedback/        # Anonymous feedback
├── hr-dashboard/             # HR workforce analytics
│   ├── [userId]/
│   │   ├── components/       # Analytics & management
│   │   ├── events/          # Event management
│   │   ├── resources/       # Resource upload/management
│   │   └── feedback/        # Feedback review
├── admin-dashboard/          # Organization administration
├── super-admin/             # Platform administration
├── api/                     # API routes
│   ├── auth/               # Authentication endpoints
│   ├── health-records/     # Health data management
│   ├── events/            # Event management
│   ├── resources/         # Resource management
│   ├── watsonx-chat/      # IBM Watson X integration
│   └── organizations/     # Multi-tenant management
└── (chat)/                 # Google Gemini AI chat
```

## 🚀 Getting Started

### Prerequisites

> [!IMPORTANT]
> Ensure you have the following installed and configured:

- **Node.js 18.0+** ([Download](https://nodejs.org/))
- **PostgreSQL 15.0+** for production-grade database
- **Git** for version control
- **npm/pnpm/yarn** package manager
- **IBM Cloud Account** for Watson X AI (optional)
- **Google Cloud Account** for Gemini AI (optional)

### Quick Installation

**1. Clone the Repository**

```bash
git clone https://github.com/ChanMeng666/sanicle-ai.git
cd sanicle-ai
```

**2. Install Dependencies**

```bash
# Using npm
npm install

# Using pnpm (recommended for performance)
pnpm install

# Using yarn
yarn install
```

**3. Environment Configuration**

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your configuration
nano .env.local  # or your preferred editor
```

### Environment Setup

Create `.env.local` file with the following configuration:

```bash
# Database Configuration
POSTGRES_URL="postgresql://username:password@localhost:5432/sanicle_db"

# Authentication
AUTH_SECRET="your-secret-key-generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"

# AI Integration (Optional)
# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# IBM Watson X AI  
WATSONX_API_KEY="your-watsonx-api-key"
WATSONX_DEPLOYMENT_ID="your-deployment-id"
NEXT_PUBLIC_WATSONX_API_URL="https://us-south.ml.cloud.ibm.com/ml/v4/deployments"

# File Storage (Optional)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Analytics (Optional)
VERCEL_ANALYTICS_ID="your-analytics-id"
```

> [!TIP]
> Use `openssl rand -base64 32` to generate secure random secrets for AUTH_SECRET.

### Database Setup

```bash
# Generate database migrations
npm run db:generate

# Apply database schema
npm run migrate

# Seed system roles
npm run db:seed:roles

# (Optional) Add test data
npm run db:seed:testdata
```

**5. Start Development Server**

```bash
npm run dev
```

🎉 **Success!** Open [http://localhost:3000](http://localhost:3000) to access Sanicle-AI.

**Default Test Accounts:**
- **Super Admin**: superadmin@sanicle.com / Admin@123
- **HR User**: hr_test@example.com / Password123  
- **Employee**: employee_test@example.com / Password123

## 🛳 Deployment

> [!IMPORTANT]
> Choose the deployment strategy that fits your organization's needs. Vercel is recommended for rapid deployment and scaling.

### `A` Cloud Deployment

**Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FChanMeng666%2Fsanicle-ai)

**Manual Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

**Other Platforms:**

<div align="center">

|           Deploy with Netlify            |                     Deploy with Railway                      |
| :-------------------------------------: | :---------------------------------------------------------: |
| [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ChanMeng666/sanicle-ai) | [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/ChanMeng666/sanicle-ai) |

</div>

### `B` Docker Deployment

```bash
# Build Docker image
docker build -t sanicle-ai .

# Run container
docker run -p 3000:3000 --env-file .env.local sanicle-ai

# Or use Docker Compose
docker-compose up -d
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - POSTGRES_URL=${POSTGRES_URL}
      - AUTH_SECRET=${AUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: sanicle_db
      POSTGRES_USER: sanicle_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### `C` Environment Variables

> [!WARNING]
> Never commit sensitive environment variables to version control. Use secure secret management in production.

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `POSTGRES_URL` | PostgreSQL connection string | ✅ | `postgresql://user:pass@localhost:5432/db` |
| `AUTH_SECRET` | NextAuth.js secret key | ✅ | `generated-secret-key` |
| `NEXTAUTH_URL` | Application URL | ✅ | `https://yourdomain.com` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini AI key | 🔶 | `AIzaSy...` |
| `WATSONX_API_KEY` | IBM Watson X API key | 🔶 | `IBMCloud...` |
| `WATSONX_DEPLOYMENT_ID` | Watson X deployment ID | 🔶 | `deployment-id-123` |
| `BLOB_READ_WRITE_TOKEN` | File storage token | 🔶 | `vercel_blob_token` |

> [!NOTE]
> ✅ Required for core functionality, 🔶 Optional for enhanced features

## 🖥️ Multi-Level Dashboard System

Sanicle-AI features a sophisticated role-based dashboard system designed to serve different organizational needs while maintaining data privacy and security.

### Employee Dashboard

The Employee Dashboard provides a comprehensive health management experience:

<div align="center">
  <img src="https://github.com/user-attachments/assets/dd1f2537-673d-47c6-b555-f9295520cd88" alt="Employee Dashboard" width="600"/>
  <p><em>Employee Dashboard - Personal Health Management Hub</em></p>
</div>

**Core Features:**
- 📅 **Health Calendar**: Advanced menstrual cycle tracking with symptom monitoring
- 😊 **Mood Tracking**: Emotional well-being assessment with stress level indicators
- 🤖 **AI Health Assistant**: 24/7 access to both Watson X and Gemini AI support
- 🏥 **Medical Appointments**: Healthcare visit scheduling and management
- 📚 **Resource Library**: Access to educational materials about women's health
- 📝 **Leave Management**: Health-related leave requests with AI assistance
- 📅 **Events**: Registration for health workshops and wellness programs

### HR Dashboard

The HR Dashboard offers powerful workforce analytics while maintaining employee privacy:

<div align="center">
  <img src="https://github.com/user-attachments/assets/4fee0238-d046-4940-900f-90aecc5d6a71" alt="HR Dashboard" width="600"/>
  <p><em>HR Dashboard - Workforce Health Analytics</em></p>
</div>

**Key Capabilities:**
- 📊 **Anonymized Analytics**: Workforce health trends without individual identification
- 📋 **Leave Management**: Process and approve health-related leave requests
- 📚 **Resource Management**: Upload and distribute educational materials
- 📅 **Event Coordination**: Create and manage health-related events and workshops
- 👥 **Team Oversight**: Manage assigned employee groups
- 💬 **Feedback Analysis**: Review anonymous employee feedback and suggestions
- 📈 **Health Metrics**: Organization-wide wellness trends and insights

### Organization Admin Dashboard

Comprehensive organizational management for company administrators:

**Administrative Powers:**
- 👥 **User Management**: Create, modify, and deactivate user accounts across the organization
- 🔐 **Role Assignment**: Assign HR managers and configure access permissions
- 💼 **Subscription Management**: Manage organizational subscription and billing
- ⚙️ **Organization Settings**: Configure company-specific parameters and policies
- 🏢 **Department Structure**: Organize users by departments and teams
- 📊 **Analytics Overview**: View organization-wide usage and health statistics
- 🔍 **Audit Access**: Review system activity logs for compliance and security

### Super Admin Dashboard

System-wide administration for Sanicle platform management:

**Platform Control:**
- 🌐 **Multi-Tenant Management**: Create and configure organizations
- 👑 **Global User Management**: Oversee all platform users across organizations
- 📈 **Platform Analytics**: Monitor system-wide performance and usage
- ⚙️ **Global Settings**: Configure platform-wide parameters and features
- 🔒 **Security Oversight**: Manage security policies and compliance
- 📋 **Audit Logging**: Comprehensive activity tracking for all organizations
- 🚀 **Feature Management**: Enable/disable features across the platform

## 🤖 Dual AI Integration

Sanicle-AI uniquely combines two powerful AI systems to provide comprehensive health support through different interaction modalities.

### IBM Watson X AI

Enterprise-grade AI integration through a convenient chat widget:

<div align="center">
  <img src="https://github.com/user-attachments/assets/c5681916-986f-48dc-843c-a1bc845dfe79" alt="Watson X Chat Widget" width="500"/>
  <p><em>Watson X AI - Always Available Chat Widget</em></p>
</div>

**Features:**
- 💬 **Always-Available Widget**: Floating chat button in employee dashboard
- ⚡ **Real-time Streaming**: Dynamic response generation with typing indicators
- 🏥 **Health-Focused Training**: Specialized prompts for women's health conversations
- 🔒 **Enterprise Security**: IBM Cloud's robust security infrastructure
- 📝 **Leave Assistance**: Help with creating and submitting leave requests

**Technical Implementation:**
```typescript
// Watson X API integration
const response = await fetch("/api/watsonx-chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: conversationHistory,
    streaming: true
  }),
});
```

### Google Gemini AI

In-depth health consultations through dedicated chat interface:

**Capabilities:**
- 🔍 **Deep Analysis**: Comprehensive health consultations and detailed guidance
- 🎯 **Contextual Understanding**: Advanced conversation context and memory
- 📊 **Health Insights**: Detailed explanations of health patterns and recommendations
- 🌐 **Full-Page Experience**: Distraction-free environment for focused consultations
- 📱 **Multi-Modal Support**: Text, image, and document analysis capabilities

### AI Comparison

| Feature | IBM Watson X | Google Gemini |
|---------|-------------|---------------|
| **Access Method** | Floating widget in dashboard | Dedicated page via navigation |
| **Interaction Style** | Quick, contextual conversations | In-depth health consultations |
| **Best For** | Brief questions during dashboard use | Dedicated health consultation sessions |
| **Response Style** | Concise, targeted answers | Comprehensive explanations |
| **Integration** | Always available in context | Focused, distraction-free space |
| **Use Cases** | Leave requests, quick health tips | Detailed health analysis, education |

## 🔒 Privacy & Security

Sanicle-AI implements enterprise-grade security measures designed specifically for sensitive health data:

**Data Protection:**
- 🏢 **Multi-Tenant Isolation**: Complete data separation between organizations
- 🔒 **End-to-End Encryption**: All health data encrypted in transit and at rest
- 👁️ **Data Anonymization**: HR dashboards show only aggregated, anonymized insights
- 🛡️ **Role-Based Access Control**: Strict permissions based on user roles and organization
- 📋 **GDPR Compliance**: Full compliance with European data protection regulations

**Security Architecture:**
- 🔐 **JWT Authentication**: Secure token-based authentication with NextAuth.js
- 🔑 **API Key Management**: Secure server-side handling of all external API credentials
- 📊 **Audit Logging**: Comprehensive activity tracking for compliance and security monitoring
- 🚫 **Data Minimization**: Only necessary data collected and processed
- 🗑️ **Right to Deletion**: Complete data removal capabilities for GDPR compliance

**Technical Security:**
- 🛡️ **SQL Injection Prevention**: Parameterized queries and ORM protection
- 🔒 **XSS Protection**: Content Security Policy and input sanitization
- 🌐 **HTTPS Enforcement**: All communications encrypted with TLS
- 🔄 **Regular Security Updates**: Automated dependency updates and vulnerability scanning

## 🗄️ Database Schema

Our carefully designed database schema supports multi-tenant architecture with complete data isolation:

**Core Tables:**
- `Organization`: Multi-tenant organization information and subscription details
- `User`: User profiles with organization relationships and role assignments
- `Employee`: Employee-specific profile data and organizational hierarchy
- `Role` & `UserRole`: Flexible role-based access control system

**Health Data:**
- `HealthRecord`: Comprehensive health tracking (cycles, symptoms, mood, sleep)
- `LeaveRequest`: Health-related leave management with approval workflows
- `Feedback`: Anonymous employee feedback system for continuous improvement

**Platform Features:**
- `Event` & `EventRegistration`: Health workshops, webinars, and wellness programs
- `ResourceFile`: Educational materials and policy document management
- `Chat`: AI conversation history and interaction tracking
- `AuditLog`: Security and compliance activity tracking

**Data Relationships:**
```mermaid
erDiagram
    Organization ||--o{ User : "belongs to"
    User ||--o{ Employee : "has profile"
    User ||--o{ UserRole : "has roles"
    Role ||--o{ UserRole : "defines"
    User ||--o{ HealthRecord : "tracks"
    User ||--o{ LeaveRequest : "submits"
    User ||--o{ EventRegistration : "registers"
    Organization ||--o{ Event : "hosts"
    Organization ||--o{ ResourceFile : "manages"
```

## 📖 API Reference

Comprehensive REST API with OpenAPI documentation:

**Authentication Endpoints:**
```bash
POST /api/auth/login         # User authentication
POST /api/auth/register      # Multi-tenant user registration
POST /api/auth/logout        # Secure session termination
```

**Health Data Management:**
```bash
GET    /api/health-records            # Retrieve user health records
POST   /api/health-records            # Create new health record
PUT    /api/health-records/[id]       # Update existing record
DELETE /api/health-records/[id]       # Delete health record
```

**Organization Management:**
```bash
GET    /api/organizations             # List organizations (role-based)
POST   /api/organizations             # Create organization (super admin)
GET    /api/organizations/[id]/users  # Organization user management
PATCH  /api/organizations/[id]/users/[userId]  # Update user roles
```

**AI Integration:**
```bash
POST   /api/watsonx-chat             # IBM Watson X AI conversations
POST   /api/gemini-chat              # Google Gemini AI interactions
```

**Event & Resource Management:**
```bash
GET    /api/events                   # List health events
POST   /api/events                   # Create event (HR/Admin)
POST   /api/events/[id]/register     # Register for event
GET    /api/resources                # Educational resources
POST   /api/resources                # Upload resource (HR/Admin)
```

> [!TIP]
> All API endpoints support JSON format and require proper authentication headers. Full API documentation available at `/api/docs` when running the application.

## 🤝 Contributing

We welcome contributions to improve Sanicle-AI! Here's how you can help:

**Development Process:**

```bash
# 1. Fork the repository
git fork https://github.com/ChanMeng666/sanicle-ai.git

# 2. Create feature branch
git checkout -b feature/amazing-health-feature

# 3. Make your changes
# Follow our coding standards and add tests

# 4. Commit changes
git commit -m "feat: add amazing health feature"

# 5. Push and create PR
git push origin feature/amazing-health-feature
```

**Contribution Guidelines:**

- ✅ **TypeScript First**: All code must be written in TypeScript with proper types
- ✅ **Health Focus**: Ensure contributions align with women's health mission
- ✅ **Privacy Compliance**: Maintain GDPR compliance and data protection
- ✅ **Testing Required**: Add tests for new features and bug fixes
- ✅ **Documentation**: Update README and API docs as needed

**Areas for Contribution:**
- 🏥 **Health Features**: New tracking capabilities and health insights
- 🤖 **AI Enhancements**: Improved AI prompts and conversation flows
- 🎨 **UI/UX Improvements**: Better user experience and accessibility
- 🔒 **Security Features**: Enhanced privacy and compliance measures
- 📊 **Analytics**: New reporting and visualization capabilities
- 🌐 **Internationalization**: Multi-language support for global reach

[![][pr-welcome-shield]][pr-welcome-link]

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

**Open Source Benefits:**
- ✅ Commercial use allowed
- ✅ Modification allowed  
- ✅ Distribution allowed
- ✅ Private use allowed
- ✅ Patent use allowed

## 👥 Team

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/ChanMeng666">
          <img src="https://github.com/ChanMeng666.png?size=100" width="100px;" alt="Chan Meng"/>
          <br />
          <sub><b>Chan Meng</b></sub>
        </a>
        <br />
        <small>Creator & Lead Developer</small>
        <br />
        <small>Full-Stack Development • AI Integration • Health Tech</small>
      </td>
    </tr>
  </table>
</div>

**Contact Information:**
- 📧 **Email**: [chanmeng.dev@gmail.com](mailto:chanmeng.dev@gmail.com)
- 💼 **LinkedIn**: [chanmeng666](https://www.linkedin.com/in/chanmeng666/)
- 🐙 **GitHub**: [ChanMeng666](https://github.com/ChanMeng666)
- 🌐 **Portfolio**: [chanmeng.live](https://2d-portfolio-eta.vercel.app/)

---

<div align="center">
<strong>🌸 Empowering Women's Health in the Workplace 💪</strong>
<br/>
<em>Building a healthier future through technology and compassion</em>
<br/><br/>

⭐ **Star us on GitHub** • 📖 **Read the Documentation** • 🐛 **Report Issues** • 💡 **Request Features** • 🤝 **Contribute**

<br/><br/>

**Made with ❤️ for women's health and workplace wellness**

<img src="https://img.shields.io/github/stars/ChanMeng666/sanicle-ai?style=social" alt="GitHub stars">
<img src="https://img.shields.io/github/forks/ChanMeng666/sanicle-ai?style=social" alt="GitHub forks">

</div>

---

<!-- LINK DEFINITIONS -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square

<!-- Project Links -->
[demo-link]: https://sanicle-ai.vercel.app
[docs]: https://sanicle-ai.vercel.app/docs
[api-docs]: https://sanicle-ai.vercel.app/api/docs
[docs-health-features]: https://sanicle-ai.vercel.app/docs/health-features
[docs-ai-features]: https://sanicle-ai.vercel.app/docs/ai-features

<!-- GitHub Links -->
[github-issues-link]: https://github.com/ChanMeng666/sanicle-ai/issues
[github-stars-link]: https://github.com/ChanMeng666/sanicle-ai/stargazers
[github-forks-link]: https://github.com/ChanMeng666/sanicle-ai/forks
[github-contributors-link]: https://github.com/ChanMeng666/sanicle-ai/contributors
[github-release-link]: https://github.com/ChanMeng666/sanicle-ai/releases
[pr-welcome-link]: https://github.com/ChanMeng666/sanicle-ai/pulls
[license-link]: https://github.com/ChanMeng666/sanicle-ai/blob/main/LICENSE

<!-- Shield Badges -->
[github-release-shield]: https://img.shields.io/github/v/release/ChanMeng666/sanicle-ai?color=369eff&labelColor=black&logo=github&style=flat-square
[vercel-shield]: https://img.shields.io/badge/vercel-deployed-55b467?labelColor=black&logo=vercel&style=flat-square
[license-shield]: https://img.shields.io/badge/license-Apache%202.0-white?labelColor=black&style=flat-square
[github-contributors-shield]: https://img.shields.io/github/contributors/ChanMeng666/sanicle-ai?color=c4f042&labelColor=black&style=flat-square
[github-forks-shield]: https://img.shields.io/github/forks/ChanMeng666/sanicle-ai?color=8ae8ff&labelColor=black&style=flat-square
[github-stars-shield]: https://img.shields.io/github/stars/ChanMeng666/sanicle-ai?color=ffcb47&labelColor=black&style=flat-square
[github-issues-shield]: https://img.shields.io/github/issues/ChanMeng666/sanicle-ai?color=ff80eb&labelColor=black&style=flat-square
[pr-welcome-shield]: https://img.shields.io/badge/🤝_PRs_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge

<!-- Badge Variants -->
[demo-shield-badge]: https://img.shields.io/badge/TRY%20DEMO-ONLINE-ff69b4?labelColor=black&logo=vercel&style=for-the-badge
[docs-shield-badge]: https://img.shields.io/badge/READ%20DOCS-GUIDE-blue?labelColor=black&logo=gitbook&style=for-the-badge

<!-- Social Share Links -->
[share-x-link]: https://x.com/intent/tweet?hashtags=womenshealth,healthtech,ai&text=Check%20out%20Sanicle-AI:%20A%20comprehensive%20women's%20health%20platform%20for%20workplace%20wellness&url=https%3A%2F%2Fgithub.com%2FChanMeng666%2Fsanicle-ai
[share-linkedin-link]: https://linkedin.com/sharing/share-offsite/?url=https://github.com/ChanMeng666/sanicle-ai
[share-reddit-link]: https://www.reddit.com/submit?title=Sanicle-AI:%20Women's%20Health%20Platform%20for%20Workplace%20Wellness&url=https%3A%2F%2Fgithub.com%2FChanMeng666%2Fsanicle-ai

[share-x-shield]: https://img.shields.io/badge/-share%20on%20x-black?labelColor=black&logo=x&logoColor=white&style=flat-square
[share-linkedin-shield]: https://img.shields.io/badge/-share%20on%20linkedin-black?labelColor=black&logo=linkedin&logoColor=white&style=flat-square
[share-reddit-shield]: https://img.shields.io/badge/-share%20on%20reddit-black?labelColor=black&logo=reddit&logoColor=white&style=flat-square

<!-- Images -->
[image-star]: https://via.placeholder.com/800x200/FFD700/000000?text=⭐+Star+Us+on+GitHub+for+Updates
[image-feat-health]: https://via.placeholder.com/800x400/ff69b4/FFFFFF?text=🌸+Health+Calendar+%26+Tracking

<!-- Vercel Link -->
[vercel-link]: https://sanicle-ai.vercel.app
</rewritten_file>

