# 2FA-Auth-App

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Project Structure](#project-structure)


## Features
- 2FA code input with individual digit fields.
- Timer for code expiration and "Get New Code" functionality.
- Form validation using Yup and React Hook Form.
- API integration for code verification using React Query.
- Automatic redirection to homepage upon successful verification.
- Responsive and styled UI with Ant Design.
- Error handling and user feedback with Ant Design messages.

## Tech Stack
- **Frontend**: React, TypeScript
- **State Management**: React Query
- **UI Library**: Ant Design
- **Routing**: React Router DOM
- **Form Management**: React Hook Form, Yup
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Code Quality**: ESLint, Prettier

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/N3zZa/auth-react-2fa.git
   cd auth-react-2fa
   ```
2. Install dependencies:
```bash
npm install
```

Ensure you have Node.js (v16 or later) and npm installed.

## Usage

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to http://localhost:3000 (or the port specified in the terminal).
Enter a 6-digit code from your Google Authenticator app to test the 2FA verification.

### Development
Prerequisites

Node.js (v16 or later)
npm (comes with Node.js)

Available Scripts

npm run dev: Starts the development server.
npm run build: Builds the app for production.
npm run preview: Previews the production build locally.

### Project Structure
```
auth-react-2fa/
├── src/
│   ├── components/        # React components (e.g., LoginForm, CodeForm)
│   ├── hooks/            # Custom hooks (e.g., useCodeVerifyMutation)
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

