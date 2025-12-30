# TaxPal Backend API

Backend API for TaxPal - Personal Finance & Tax Estimator for Freelancers

## Features

- User authentication (register, login)
- JWT token-based security
- User profile management
- Tax calculation and estimation
- Input validation and error handling
- Security middleware

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile

### Tax (`/api/tax`)
- `POST /estimate` - Calculate tax estimate
