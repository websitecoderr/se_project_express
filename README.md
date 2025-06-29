## Backend Repository

\*[WTWR (What to Wear?): Back End](https://github.com/websitecoderr/se_project_express.git)

## 🌐 Live Demo

You can access the deployed application here: [https://www.codecave.pakasak.com/](https://www.codecave.pakasak.com/)

> **Note:** The app is hosted using NGINX with HTTPS enabled via Certbot. PM2 is used to ensure stability in production.


## Overview

WTWR (What to Wear?) is a web application that helps users plan their outfits based on weather conditions and preferences. This repository hosts the **backend server** that powers the app — built with Node.js and Express, connected to MongoDB, and equipped with authentication, error handling, and testing mechanisms.

The server offers a secure, well-tested REST API that supports user registration/login and allows CRUD operations on clothing items. This back end is designed with modular architecture, security best practices, and optimized performance for real-world deployment.

---

## 🚀 Features

- 🔐 **Secure Authentication & Authorization**

  - JWT-based login and signup
  - Role-based access control

- 🧩 **Modular REST API**

  - Routes for managing users and clothing items
  - Controllers for business logic
  - Middleware for validation, errors, and security

- 📦 **MongoDB Integration**

  - Mongoose schemas for users and items
  - Indexing for optimized queries

- 🧪 **Testing Suite**

  - Unit and integration tests using Jest and Supertest

- 🧰 **Robust Error Handling**

  - Centralized middleware to return clean, categorized error responses

- ☁️ **Deployment-Ready**
  - Docker-compatible setup
  - Uses environment variables for sensitive data
  - Easily deployable to Heroku, AWS, or any cloud platform

---

## 🧱 Project Structure

```
wtwr-backend/
│
├── controllers/        # Route logic (users, clothing items)
├── models/             # Mongoose schemas (User, Item)
├── routes/             # Express routes (userRoutes, itemRoutes)
├── middlewares/        # Error handlers, validators, auth checks
├── utils/              # Helper functions and constants
├── app.js              # Entry point and Express config
├── server.js           # Server setup and connection logic
├── .env.example        # Example environment configuration
├── .dockerignore       # Files to ignore in Docker build
├── Dockerfile          # Docker image definition
├── README.md           # Project documentation
└── sprint.txt          # Sprint tracker (update before commits)
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB (local or cloud)
- Docker (optional, for containerization)

### Installation

```bash
git clone <url>
cd wtwr-backend

npm install

cp .env.example .env
```

### Running the Server

```bash
npm run dev

npm run start
```

---

## 🧪 Testing

### Test Strategy

- **Unit Tests** for individual components like controllers and middleware
- **Integration Tests** to test complete API flows
- **Edge Cases** to test invalid data and limits

### Tools Used

- Jest
- Supertest
- (Optional: Postman for manual testing)

### Run Tests

```bash
npm run test
```

> ✅ Before pushing code, update `sprint.txt` with your current sprint number (e.g., `12`).

---

## 📤 Deployment

### Environment Variables

Use the `.env` file to securely store credentials like:

```
PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/wtwr
```

### Docker Deployment

```bash
docker build -t wtwr-backend .

docker run -p 3000:3000 --env-file .env wtwr-backend
```

> You can also use services like **Heroku**, **Render**, **AWS**, or **Azure** for cloud deployment.

---

## 🔒 API Security Guidelines

- **Authentication**: JWT tokens (stored in HTTP-only cookies or headers)
- **Authorization**: Role-based route guards
- **Input Validation**: Using `Joi` or `express-validator`
- **Rate Limiting**: Protect from brute force using `express-rate-limit`
- **CORS Config**: Whitelist trusted origins only
- **Password Hashing**: Secure passwords with `bcrypt`

---

## 💡 Best Practices

- Follow RESTful conventions.
- Keep schemas clean and purposeful.
- Use centralized error handling for consistent responses.
- Mock database calls in unit tests.
- Use indexes on frequently queried fields (e.g., `userId`, `email`).
- Don’t commit secrets or node_modules.

---

## 🧠 Contributing

Feel free to fork and raise PRs to improve the project. Follow the commit message convention and update the sprint tracker before final submissions.

---

## 📸 Image

## 📩 Contact

For bugs, feature requests, or collaboration inquiries, reach out via GitHub.
