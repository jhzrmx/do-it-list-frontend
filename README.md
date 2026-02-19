# 📝 Do-It-List Frontend

Frontend application for **Do-It-List**, built with **React + TypeScript + Vite**.  
This client handles authentication, task management, protected routing, file uploads, and user profile management.

Designed with scalability, maintainability, and production-readiness in mind.

## 🚀 Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **Zustand** (state management)
- **Axios** (API communication)
- **Tailwind CSS**
- **React Router**
- **ESLint**

## 📦 Features

- 🔐 Authentication (Login, Sign Up, Logout)
- 🔁 JWT-based session handling
- 🔒 Protected & Public-only routes
- 📝 Create, update, delete todos
- 📂 File upload (chunk-based uploader)
- 👤 Profile management
- 🔑 Password validation with real-time feedback
- 📄 Terms & Conditions page
- 🚫 404 & error handling pages

## 📁 Project Structure

```
src/
│
├── api/ # API abstraction layer
│ └── file-uploader.api.ts
│
├── axios/ # Axios instance configuration
│ └── axios-instance.ts
│
├── components/ # Reusable UI components
│ ├── InputField.tsx
│ ├── Modal.tsx
│ ├── PrimaryButton.tsx
│ ├── ProtectedRoute.tsx
│ ├── PublicOnlyRoute.tsx
│ ├── Sidebar.tsx
│ ├── TermsContent.tsx
│ └── TodoContainer.tsx
│
├── layouts/ # Layout components
│
├── pages/ # Route-level pages
│ ├── Login.tsx
│ ├── SignUp.tsx
│ ├── Todos.tsx
│ ├── Profile.tsx
│ ├── ForgetPassword.tsx
│ ├── ResetPassword.tsx
│ ├── TermsAndCond.tsx
│ ├── Error.tsx
│ └── 404.tsx
│
├── stores/ # Zustand global state
│ └── auth.store.ts
│
├── types/ # TypeScript types
│ ├── Todo.ts
│ └── User.ts
│
├── utils/ # Utility functions
│ ├── chunk-uploader.ts
│ └── validate-password.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Make sure this matches your backend API.

🛠 Installation

1. Clone repository

```
git clone <repository-url>
```

2. Navigate into project

```
cd do-it-list-frontend
```

3. Install dependencies

```
npm install
```

4. Run development server

```
npm run dev
```

## 📜 Available Scripts

```
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔐 Authentication Flow

- User logs in or signs up.
- Backend returns a JWT.
- Token is stored (typically in localStorage).
- Zustand auth.store.ts manages authentication state.
- ProtectedRoute restricts access to authenticated users.
- PublicOnlyRoute prevents logged-in users from accessing auth pages.

## 🧠 State Management (Zustand)

Global auth state is handled via:

```
src/stores/auth.store.ts
```

**Responsibilities**:

- Store authenticated user
- Persist session state
- Handle login/logout logic
- Sync with backend

## 🌐 API Integration

All API communication is centralized using:

```
src/axios/axios-instance.ts
```

**Benefits**:

- Single source for base URL
- Interceptors support
- Automatic token injection
- Cleaner API calls

File uploads use:

```
src/api/file-uploader.api.ts
```

Chunk uploads are handled in:

```
src/utils/chunk-uploader.ts
```

## 🔑 Password Validation

Real-time password validation logic lives in:

```
src/utils/validate-password.ts
```

It enforces:

- Minimum length
- Character requirements
- Secure password standards
- This improves UX before hitting the backend.

## 🧩 Reusable Components

Key components:

- InputField → Form abstraction
- PrimaryButton → Styled action button
- Modal → Reusable modal container
- TodoContainer → Todo display wrapper
- Sidebar → Navigation layout
- ProtectedRoute → Route guard

Each component is typed and reusable across pages.

## 🏗 Routing Structure

Managed inside App.tsx using React Router.

Public Routes:

```
/login
/signup
/forget-password
/reset-password
/tc
```

Protected Routes:

```
/todos
/profile
```

Fallback:

```
/404
```

## 🎨 Styling

Tailwind CSS for utility-first styling

- Mobile-first responsive design
- Clean, scalable UI structure

## 🧪 Production Build

```
npm run build
```

Output will be generated in the dist/ folder.

## 🤝 Contribution Guidelines

- Follow consistent TypeScript typing.
- Keep components reusable and modular.
- Maintain clean separation between:
  - UI
  - State
  - API

- Use descriptive commit messages.
- Ensure lint passes before pushing.
