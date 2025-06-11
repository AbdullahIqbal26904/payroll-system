# MSA Payroll System - Frontend

This is the frontend application for the MSA Payroll System, specifically developed for Antigua. The application is built using Next.js, React, Redux, and Tailwind CSS to provide a modern and responsive user interface for payroll processing and management.

## Overview

The MSA Payroll System frontend provides a comprehensive interface for managing employees, processing timesheets, calculating payrolls with Antigua-specific tax rules, generating reports, and distributing paystubs to employees. The application communicates with the MSA Payroll System Backend API to perform these operations.

## Features

- **User Authentication**
  - Secure login with JWT authentication
  - Role-based access control (admin, employee)
  - Password management

- **Dashboard**
  - Overview of key payroll metrics
  - Quick access to common functions

- **Employee Management**
  - Add, edit, and remove employee records
  - View employee details and history

- **Timesheet Processing**
  - Upload and process CSV timesheet files from Attend Time Clock
  - View timesheet periods and employee hours
  - Verify and manage timesheet data

- **Payroll Calculation**
  - Process payroll with Antigua-specific tax rules:
    - Social Security (7% employee, 9% employer, max $6,500)
    - Medical Benefits (3.5% standard rate, reduced for seniors)
    - Education Levy (tiered rates based on salary thresholds)
  - Support for various payment frequencies

- **Reports and Paystubs**
  - Generate detailed payroll reports
  - Create professional PDF paystubs
  - Download individual paystubs
  - Email paystubs directly to employees

- **Settings Management**
  - Configure Antigua-specific payroll settings
  - Adjust tax rates and thresholds
  - Set age-based rules for deductions

## Technology Stack

- **Frontend Framework**: Next.js (v15.3)
- **UI Library**: React (v19.0)
- **State Management**: Redux with Redux Toolkit
- **Styling**: Tailwind CSS
- **UI Components**:
  - Heroicons
  - React Charts
  - Framer Motion
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Access to the MSA Payroll System Backend API

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/payroll-application.git
cd payroll-application/payroll-frontend
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
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
payroll-frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   │   ├── dashboard/ # Dashboard-specific components
│   │   ├── forms/     # Form components
│   │   ├── layouts/   # Layout components
│   │   └── tables/    # Table components
│   ├── context/       # React context providers
│   ├── lib/           # Utility functions and API clients
│   ├── pages/         # Next.js pages
│   │   ├── api/       # API routes
│   │   ├── dashboard/ # Dashboard pages
│   │   └── login/     # Authentication pages
│   ├── redux/         # Redux store and slices
│   └── styles/        # Global styles
```

## Deployment

The application can be deployed to various platforms:

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

### Deploy to Vercel
The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.

## Contributions

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
