# Enterprise Login System - Implementation Guide

## Overview

A professional enterprise-grade authentication system for the VTS React Vite application, featuring a dark-themed SOC UI, secure state management, and localStorage persistence.

## Components Created

### 1. **AuthContext** (`src/context/AuthContext.jsx`)
- Manages global authentication state
- Handles login/logout functionality
- Persists auth state to localStorage
- Provides `useAuth()` hook for accessing auth state

**Key Features:**
- Checks localStorage on mount to restore session
- Stores user info and authentication status
- Automatic state initialization on app load

### 2. **Login Page** (`src/pages/Login.jsx`)
- Professional enterprise-grade login interface
- Form validation (username, password, min 6 chars)
- Simulated authentication with 800ms delay
- Loading state with animated spinner
- Error message display
- Dark theme matching existing SOC UI

**Form Fields:**
- Username (required, any value)
- Password (required, min 6 characters)
- "Remember Me" equivalent via localStorage

**Demo Credentials:**
- Username: Any value (e.g., "admin", "operator")
- Password: Any value (minimum 6 characters)

### 3. **Protected Route** (`src/components/ProtectedRoute.jsx`)
- Wrapper component for route protection
- Redirects unauthenticated users to login
- Shows loading state during auth check
- Prevents unauthorized access

### 4. **Select Module Page** (`src/pages/SelectModule.jsx`)
- Module selection interface displayed after login
- Navigation to Dashboard or Events
- Personalized greeting with username
- Sign out functionality

### 5. **Styling**
- **Login.css** - Enterprise login page styling with dark theme
- **SelectModule.css** - Module selection page styling
- Uses existing color palette from App.css:
  - Background: `#0f172a` (slate-900)
  - Surface: `#020617` (slate-950)
  - Accent: `#0ea5e9` (sky-500)
  - Text: `#e5e7eb` (gray-200)

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx          (New - Auth state management)
├── components/
│   └── ProtectedRoute.jsx        (New - Route protection)
├── pages/
│   ├── Login.jsx                 (New - Login page)
│   ├── Login.css                 (New - Login styling)
│   ├── SelectModule.jsx          (New - Module selection)
│   └── SelectModule.css          (New - Module styling)
├── App.jsx                       (Updated - Routes + protection)
├── main.jsx                      (Updated - AuthProvider wrapper)
└── ...
```

## Updated Files

### `App.jsx`
- Added Login route (`/login`)
- Added SelectModule route (`/select-module`)
- Wrapped protected routes with `ProtectedRoute` component
- Imported new components

### `main.jsx`
- Wrapped app with `<AuthProvider>`
- Enables global authentication state

## Usage

### Authentication Flow

1. **Initial Load**: User lands on app
   - AuthContext checks localStorage
   - If auth exists → redirects to `/select-module`
   - If no auth → redirects to `/login`

2. **Login**:
   - User enters credentials
   - Client-side validation
   - Simulated auth with 800ms delay
   - On success → stores in localStorage → redirects to `/select-module`

3. **Module Selection**:
   - Shows available modules (Dashboard, Events)
   - User can navigate or sign out

4. **Protected Routes**:
   - Dashboard and Events require authentication
   - Unauthenticated access redirects to `/login`

5. **Sign Out**:
   - Clears localStorage
   - Clears auth state
   - Redirects to `/login`

### Accessing Auth State in Components

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { isAuthenticated, user, isLoading, login, logout } = useAuth();
  
  // Use auth state
}
```

## Styling Features

### Login Page
- Centered card layout
- Glassmorphism effect (backdrop blur)
- Gradient background radials
- Smooth transitions and animations
- Loading spinner with rotation animation
- Error state styling
- Responsive design (mobile-friendly)
- Hover effects on inputs and buttons

### Button Styles
- Reuses existing `.action-btn` gradient: `linear-gradient(135deg, #0ea5e9, #0284c7)`
- Hover: transform + shadow effect
- Active: scale effect
- Loading: disabled with spinner

### Color System
- **Primary**: `#0ea5e9` (Sky-500)
- **Dark Background**: `#0f172a` (Slate-900)
- **Card Background**: `#020617` (Slate-950)
- **Text**: `#e5e7eb` (Gray-200)
- **Muted**: `#94a3b8` (Slate-400)
- **Border**: `#1e293b` (Slate-800)

## API Integration (Future)

When backend API is ready, modify `AuthContext.jsx` login function:

```jsx
const login = async (username, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) throw new Error('Auth failed');
    
    const { token, user } = await response.json();
    
    // Store token and user
    localStorage.setItem('auth', 'true');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setIsAuthenticated(true);
    setUser(user);
  } catch (error) {
    throw new Error('Authentication failed');
  }
};
```

## Browser Storage

### localStorage Keys
- `auth` - Boolean string ("true"/"false")
- `user` - JSON stringified user object with:
  - `username`: Username string
  - `loginTime`: ISO timestamp

## Security Notes

- Current implementation simulates authentication (development)
- No real password verification
- localStorage is not encrypted (suitable for demo only)
- For production:
  - Implement JWT token authentication
  - Use httpOnly cookies for tokens
  - Add CSRF protection
  - Implement refresh token rotation
  - Add password hashing on backend

## Features

✅ Dark enterprise theme
✅ Centered login card
✅ Username/Password fields
✅ Form validation
✅ Loading states with spinner
✅ Client-side auth simulation
✅ localStorage persistence
✅ Auto-redirect after login
✅ Protected routes
✅ Module selection page
✅ Sign out functionality
✅ Responsive design
✅ Error handling
✅ Glassmorphism effects
✅ Smooth animations

## Testing

1. **Login Flow**:
   - Visit app → redirected to `/login`
   - Enter any username and password (min 6 chars)
   - Click "Sign In" → loading state appears
   - After delay → redirects to `/select-module`

2. **Session Persistence**:
   - Login → refresh page → stay logged in
   - Check DevTools → Application → localStorage

3. **Protected Routes**:
   - Clear localStorage
   - Visit `/` or `/events` → redirected to `/login`

4. **Module Selection**:
   - Click "Dashboard" or "Events" → navigate to page
   - Click "Sign Out" → redirect to login

5. **Error Handling**:
   - Leave username empty → error message
   - Password < 6 chars → error message

## Customization

### Branding
- Update logo text in `Login.jsx` (currently "VTS")
- Change organization name in `login-title` and `login-subtitle`

### Validation
- Modify validation rules in `Login.jsx` submit handler
- Add backend API calls

### Styling
- Adjust colors in CSS files
- Modify spacing/sizing values
- Update gradients and animations

### Modules
- Add/remove modules in `SelectModule.jsx`
- Update icons and descriptions

---

**Status**: ✅ Complete and ready for use
**Last Updated**: February 2026
