# 🌟 MSA Payroll System - Frontend

<div align="center">
  <img src="https://img.shields.io/badge/nextjs-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white" alt="Redux"/>
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/>
</div>

<div align="center">
  <p><strong>Enterprise-grade payroll solution with Antigua-specific tax compliance</strong></p>
  <p>Developed by Abdullah Iqbal</p>
</div>

## 📋 Overview

The MSA Payroll System frontend provides a comprehensive, intuitive interface for payroll management with a focus on Antigua's specific tax regulations. Built with modern technologies and best practices, this application delivers a seamless experience for HR managers and employees alike.

### 🏆 Key Highlights

- **Full-stack Enterprise Application** - Production-ready for organizations of all sizes
- **Region-Specific Tax Compliance** - Antigua tax rules fully implemented
- **Responsive Design** - Optimized UX across all devices
- **Secure Authentication** - Multi-factor authentication and role-based access control
- **Highly Scalable Architecture** - Built with performance in mind
- **Real-time PDF Generation** - Professional paystub creation and distribution

## ✨ Features

### 🔐 User Authentication & Security
- **Advanced Authentication**
  - JWT-based secure login system
  - Multi-factor authentication (MFA)
  - Session management with automatic timeouts
  - Password strength enforcement and reset workflows

- **Role-based Authorization**
  - Granular permission controls (Admin, Manager, Employee)
  - Feature access based on user roles
  - Audit logs for sensitive operations

### 📊 Dashboard & Analytics
- **Interactive Dashboard**
  - Real-time payroll metrics and visualizations
  - Customizable KPI widgets
  - Filtering and comparison tools
  - Export capabilities for reports

### 👥 Employee Management
- **Comprehensive Employee Records**
  - Complete employee profiles with document storage
  - Employment history tracking
  - Custom fields for organization-specific data
  - Bulk import/export functionality

- **Self-service Portal**
  - Employee access to personal information
  - Paystub history and downloads
  - Tax document access

### ⏱️ Timesheet Processing
- **Advanced Time Tracking**
  - Integration with Attend Time Clock system
  - CSV import with validation
  - Manual time entry and corrections
  - Approval workflows with notifications

- **Period Management**
  - Flexible pay period configuration
  - Holiday and leave management
  - Overtime calculations and approvals

### 💰 Payroll Calculation Engine
- **Antigua-Specific Tax Rules**
  - Social Security (7% employee, 9% employer, max $6,500)
  - Medical Benefits (3.5% standard rate, reduced for seniors)
  - Education Levy (tiered rates based on salary thresholds)
  - Income tax calculations

- **Flexible Compensation Handling**
  - Multiple payment frequencies (weekly, bi-weekly, monthly)
  - Bonuses and one-time payments
  - Deductions and garnishments
  - Benefits administration

### 📄 Reports and Document Management
- **Comprehensive Reporting**
  - Standard and custom report generation
  - Interactive data filtering and sorting
  - Export to multiple formats (PDF, Excel, CSV)

- **Professional Document Generation**
  - Branded PDF paystubs with customizable templates
  - Batch processing for efficiency
  - Digital distribution options
  - Secure document storage and access control

### 💼 Employee Loans Management
- **Loan Administration**
  - Loan application and approval workflows
  - Automated repayment scheduling
  - Balance tracking and reporting
  - Early repayment calculations

### 🏖️ Vacation Management
- **Leave Tracking System**
  - Accrual calculations based on company policies
  - Request and approval workflows
  - Calendar integration
  - Balance reporting and forecasting

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js
- **UI Library**: React 
- **State Management**: Redux with Redux Toolkit
- **Styling**: 
  - Tailwind CSS with custom theme
  - Responsive design principles
  - Accessibility compliance

- **UI Components**:
  - Heroicons for consistent iconography
  - React Charts for data visualization
  - Framer Motion for smooth animations
  - Custom component library

- **Form Handling**: 
  - React Hook Form with Yup validation
  - Field-level validation
  - Multi-step form workflows

- **API Integration**:
  - Axios with request/response interceptors
  - Custom API client with retry logic
  - Error handling and offline support

- **Authentication**: 
  - JWT with refresh token mechanism
  - Secure storage practices
  - MFA implementation

- **PDF Generation**:
  - Custom PDF generation service
  - Template-based document creation
  - Digital signature support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Access to the MSA Payroll System Backend API

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AbdullahIqbal26904/payroll-system-frontend.git
cd payroll-system-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_MFA_ENABLED=true
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to access the application.

## 📁 Project Structure

```
payroll-system-frontend/
├── public/                  # Static assets and icons
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MfaSettings.jsx  # Multi-factor authentication components
│   │   ├── account/         # User account components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   └── layouts/         # Layout components and templates
│   ├── lib/                 # Utility functions and API clients
│   │   ├── api.js           # API integration layer
│   │   ├── auth.js          # Authentication utilities
│   │   ├── PaystubDownloader.js # PDF generation service
│   │   └── utils.js         # General utilities
│   ├── pages/               # Next.js page components
│   │   ├── api/             # API routes and serverless functions
│   │   ├── dashboard/       # Dashboard and feature pages
│   │   ├── login/           # Authentication pages
│   │   └── mfa-verification/ # MFA verification workflow
│   ├── redux/               # State management
│   │   ├── app/             # Store configuration
│   │   └── slices/          # Feature-specific Redux slices
│   └── styles/              # Global styles and theme
```

## 🔄 CI/CD Pipeline

The application is integrated with a robust CI/CD pipeline:

- **Automated Testing**: Jest and React Testing Library
- **Code Quality**: ESLint, Prettier, and SonarQube
- **Performance Monitoring**: Lighthouse CI
- **Deployment**: Automated deployment to staging and production environments

## 📊 Performance Optimizations

- **Server-side Rendering**: For improved initial load times
- **Code Splitting**: To reduce bundle size
- **Image Optimization**: For faster page loads
- **Caching Strategy**: For improved API response times
- **Lazy Loading**: For non-critical components and routes

## 🌐 Deployment

The application supports multiple deployment options:

### Build for Production
```bash
npm run build
# or
yarn build
```

### Start Production Server
```bash
npm run start
# or
yarn start
```

### Deploy to Vercel (Recommended)
One-click deployment with the [Vercel Platform](https://vercel.com) for optimal performance.

### Docker Support
```bash
docker build -t payroll-system-frontend .
docker run -p 3000:3000 payroll-system-frontend
```

## 🧪 Testing Strategy

- **Unit Tests**: Component-level testing with Jest
- **Integration Tests**: Testing component interactions
- **E2E Tests**: Full workflow testing with Cypress
- **Performance Tests**: Lighthouse and Web Vitals

## 🤝 Contributions

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Abdullah Iqbal - [GitHub](https://github.com/AbdullahIqbal26904) - [LinkedIn](https://linkedin.com/in/abdullah-iqbal)

Project Link: [https://github.com/AbdullahIqbal26904/payroll-system-frontend](https://github.com/AbdullahIqbal26904/payroll-system-frontend)
