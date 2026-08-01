# JanSahay – Backend

JanSahay is a platform that helps citizens discover government welfare schemes relevant to them. This repository contains the **Node.js / Express / MongoDB REST API** that powers the JanSahay web application — handling authentication, user profiles, scheme management, personalized recommendations, favorites, and feedback.

**Live API:** `https://jansahay-backend.vercel.app`
**Frontend repo:** [jansahay-frontend](https://github.com/hardikrana929/jansahay-frontend) <!-- update if the repo name differs -->

---

## 📖 About

Government welfare schemes are often scattered across multiple portals and hard to discover. JanSahay centralizes them in one place, lets users build a simple eligibility profile, and returns schemes that actually match them — instead of making users search through dozens of government websites manually.

---

## ✨ Features

- 🔐 **Authentication** — Register/login with hashed passwords (bcrypt), JWT-based sessions stored in secure httpOnly cookies
- 🔑 **Password recovery** — OTP-based forgot-password flow, OTPs hashed and time-limited before storage
- 👤 **User profiles** — Create/update/delete an eligibility profile used to personalize results
- 🎯 **Recommendations** — Fetch schemes tailored to a user's profile, with search, filter, and sort support
- ⭐ **Favorites** — Save and remove schemes for quick access later
- 📋 **Scheme catalog** — Browse and view individual scheme details
- 💬 **Feedback** — Users can submit feedback; admins can review, filter by rating, and delete
- 🛠️ **Admin dashboard APIs** — Manage schemes (create/update/activate-deactivate), view stats, and moderate feedback
- 🛡️ **Security hardening** — Rate limiting on auth endpoints, Helmet security headers, MongoDB operator sanitization, whitelisted field updates to prevent mass assignment

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (httpOnly cookies), bcrypt |
| Security | Helmet, express-rate-limit, express-mongo-sanitize, cookie-parser |
| Email | Nodemailer (OTP delivery) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, login, password reset, logout
│   ├── profileController.js   # User profile CRUD
│   ├── schemeController.js    # Scheme CRUD (public + admin)
│   ├── recommandationController.js
│   ├── favoriteController.js
│   ├── feedbackController.js
│   └── adminController.js     # Dashboard stats, admin creation
├── middleware/
│   ├── authMiddleware.js      # Verifies JWT, attaches req.user
│   ├── adminMiddleware.js     # Restricts routes to admin role
│   └── rateLimiter.js         # Rate limits for auth endpoints
├── models/
│   ├── User.js
│   ├── UserProfiles.js
│   ├── Scheme.js
│   └── Feedback.js
├── routes/
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   ├── schemeRoutes.js
│   ├── adminSchemeRoutes.js
│   ├── recommandationRoutes.js
│   ├── favoriteRoutes.js
│   ├── feedbackRoutes.js
│   └── adminFeedbackRoutes.js
├── utils/
│   ├── generateOTP.js
│   ├── generateToken.js
│   └── sendEmail.js
├── server.js                  # App entry point
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A MongoDB instance (local or Atlas)
- An email account with an app password (for sending OTPs)

### Installation

```bash
git clone https://github.com/hardikrana929/jansahay-backend.git
cd jansahay-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_secret

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

> ⚠️ Never commit `.env` to version control. Use a strong, randomly generated value for `JWT_SECRET` — not a guessable phrase.

### Run locally

```bash
npm run dev    # if a dev script with nodemon is configured
# or
npm start
```

The API will be available at `http://localhost:5000`.

---

## 📡 API Endpoints

Base URL: `/api`

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Log in, sets httpOnly auth cookie | Public |
| POST | `/forgot-password` | Request an OTP for password reset | Public |
| POST | `/verify-reset-otp` | Verify the OTP | Public |
| POST | `/reset-password` | Set a new password | Public |
| POST | `/logout` | Clear the auth cookie | Public |
| GET | `/me` | Get the currently logged-in user | 🔒 User |

### Profile — `/api/profile`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Create a profile | 🔒 User |
| GET | `/` | Get the current user's profile | 🔒 User |
| PUT | `/` | Update the current user's profile | 🔒 User |
| DELETE | `/` | Delete a profile | 🔒 Admin |

### Schemes — `/api/schemes`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all active schemes | 🔒 User |
| GET | `/:id` | Get a single scheme | 🔒 User |

### Recommendations — `/api/recommendation`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get personalized scheme recommendations (supports `page`, `limit`, `search`, `schemeType`, `government`, `sort`) | 🔒 User |

### Favorites — `/api/favorites`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List the current user's favorite schemes | 🔒 User |
| POST | `/` | Add a scheme to favorites | 🔒 User |
| DELETE | `/:schemeId` | Remove a scheme from favorites | 🔒 User |

### Feedback — `/api/feedback`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Submit feedback | 🔒 User |

### Admin — Schemes (`/api/admin/schemes`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/stats` | Dashboard statistics | 🔒 Admin |
| GET | `/` | List all schemes | 🔒 Admin |
| GET | `/:id` | Get a single scheme | 🔒 Admin |
| POST | `/` | Create a scheme | 🔒 Admin |
| PUT | `/:id` | Update a scheme | 🔒 Admin |
| PATCH | `/:id/deactivate` | Toggle scheme active status | 🔒 Admin |

### Admin — Feedback (`/api/admin/feedback`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/stats` | Feedback statistics | 🔒 Admin |
| GET | `/` | List all feedback (filter by rating) | 🔒 Admin |
| DELETE | `/:id` | Delete a feedback entry | 🔒 Admin |

🔒 **User** routes require a valid auth cookie. 🔒 **Admin** routes additionally require the logged-in user's role to be `admin`.

---

## 🔒 Security Notes

- Auth tokens are issued as **httpOnly cookies** — never exposed to client-side JavaScript, reducing XSS token-theft risk.
- Sensitive endpoints (`login`, `forgot-password`, `verify-reset-otp`, `reset-password`) are rate-limited to slow down brute-force attempts.
- All incoming request data is sanitized against MongoDB operator injection.
- Field updates on profile/scheme records are explicitly whitelisted to prevent mass-assignment vulnerabilities.
- Passwords and OTPs are hashed before storage; OTPs expire after a short window.

---

## 🤝 Contributing

Issues and pull requests are welcome. Please open an issue first to discuss what you'd like to change.

## 👤 Author

**Asavala Hardik**
GitHub: [@hardikrana929](https://github.com/hardikrana929)
