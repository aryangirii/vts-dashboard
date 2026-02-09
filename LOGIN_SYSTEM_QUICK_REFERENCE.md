# Login System - Quick Reference

## 🚀 What's New

Your React Vite app now has a complete enterprise-grade authentication system with:
- Professional dark-themed login page
- Session persistence with localStorage
- Protected routes (auto-redirect to login)
- Module selection page (gateway to Dashboard/Events)
- Simulated authentication with loading states

## 📂 New Files Created

```
src/
├── context/
│   └── AuthContext.jsx ..................... Auth state management
├── components/
│   └── ProtectedRoute.jsx .................. Route protection wrapper
└── pages/
    ├── Login.jsx ........................... Login form component
    ├── Login.css ........................... Login styling
    ├── SelectModule.jsx .................... Module selector component
    └── SelectModule.css .................... Module styling
```

## 🔄 Updated Files

- `src/App.jsx` → Added routes & protection
- `src/main.jsx` → Added AuthProvider wrapper

## 🎨 Design Features

| Feature | Details |
|---------|---------|
| **Theme** | Dark SOC UI (Slate-900/950) |
| **Colors** | Sky-500 accent, gray text, slate borders |
| **Layout** | Centered card with glassmorphism |
| **Animation** | Loading spinner, smooth transitions |
| **Typography** | Enterprise fonts (Inter, system-ui) |
| **Responsive** | Mobile-optimized |

## 🔐 Authentication Flow

```
App Start
    ↓
Check localStorage
    ↓
[Has auth?] ──Yes→ /select-module
    ↓ No
    ↓
   /login (with form)
    ↓
[Valid creds?] ──Yes→ Store in localStorage
    ↓ No          ↓
 Show error    /select-module
              ↓
        [Select Module]
              ↓
    Dashboard or Events (protected)
```

## 📝 Login Credentials (Demo)

**Username**: Any value (e.g., `admin`, `operator`, `user123`)
**Password**: Any value (minimum 6 characters)

Example:
```
Username: admin
Password: password123
```

## 💾 localStorage Keys

After login, these are stored:
```javascript
localStorage.getItem('auth')        // "true"
localStorage.getItem('user')        // {"username":"admin","loginTime":"..."}
```

## 🛡️ Protected Routes

These routes require authentication:
- `/` (Dashboard)
- `/events` (CCTV Events)
- `/select-module` (Module Selection)

Public routes:
- `/login` (Login Page)

Unauthenticated access to protected routes → Auto-redirect to `/login`

## 🧩 Using Auth in Components

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { isAuthenticated, user, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return (
    <div>
      <p>Welcome, {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🎯 Key Components

### AuthContext
- Manages `isAuthenticated`, `user`, `isLoading`
- Provides `login()` and `logout()` functions
- Auto-loads from localStorage on app start

### ProtectedRoute
- Wraps components that need authentication
- Shows loading screen during check
- Redirects to `/login` if not authenticated

### Login Page
- Form with username/password fields
- Client-side validation
- Simulated 800ms authentication delay
- Error message display
- Loading spinner during auth

### SelectModule
- Shows available modules (Dashboard, Events)
- Displays username greeting
- Provides sign-out button
- Module cards with icons and descriptions

## ✨ CSS Classes

### Login Page
- `.login-container` - Main container
- `.login-card` - Card wrapper
- `.login-form` - Form element
- `.form-input` - Input fields
- `.login-btn` - Submit button
- `.login-error` - Error messages
- `.spinner` - Loading animation

### SelectModule Page
- `.select-module-container` - Main container
- `.modules-grid` - Grid layout
- `.module-card` - Individual module card
- `.logout-btn` - Sign out button

## 🔧 Customization Quick Tips

### Change Login Logo
`src/pages/Login.jsx` line 21:
```jsx
<div className="login-logo">YOUR_LOGO</div>
```

### Change Organization Name
`src/pages/Login.jsx` lines 23-24:
```jsx
<h1 className="login-title">Your Org Name</h1>
<p className="login-subtitle">Your Subtitle</p>
```

### Add More Modules
`src/pages/SelectModule.jsx` line 17 - expand `modules` array:
```jsx
{
  id: "new-module",
  title: "Module Name",
  description: "Description",
  icon: "🔧",
  path: "/path"
}
```

### Adjust Colors
`src/pages/Login.css` - modify color values:
- Accent: `#0ea5e9` → change to your color
- Background: `#0f172a` → change to your color
- Surface: `#020617` → change to your color

## 🧪 Testing Checklist

- [ ] Login page loads at `/login`
- [ ] Invalid credentials show error message
- [ ] Valid login → redirects to `/select-module`
- [ ] Page refresh → stay logged in
- [ ] Click module → navigates to that page
- [ ] Sign out → clears localStorage & redirects to login
- [ ] Direct URL to protected route without auth → redirects to login
- [ ] Mobile responsiveness works

## 📱 Responsive Breakpoints

- **Desktop**: Full-width modules grid, 2+ columns
- **Tablet**: Grid adjusts to available space
- **Mobile**: Single column, full-width cards, smaller margins

## 🚀 Next Steps

### For Development
1. Test the login flow
2. Verify localStorage persistence
3. Check route protection
4. Test on mobile devices

### For Production Integration
1. Replace simulated auth with backend API
2. Implement JWT token authentication
3. Add password hashing/verification
4. Implement refresh token rotation
5. Add CSRF protection
6. Use httpOnly cookies for tokens
7. Add rate limiting on login endpoint
8. Implement MFA (optional)

## 📞 Component Imports

```jsx
// In your components:
import Login from "./pages/Login";
import SelectModule from "./pages/SelectModule";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
```

## ⚡ Performance Notes

- Auth check happens only on app mount
- localStorage access is instant (no network)
- Loading indicator prevents UI flashing
- CSS animations use GPU-optimized properties

## 🎓 Example: Adding Logout to Sidebar

In `src/components/Sidebar.jsx`:
```jsx
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  
  return (
    <div className="sidebar">
      {/* ... sidebar content ... */}
      <div className="sidebar-footer">
        <button onClick={logout}>
          Sign out ({user?.username})
        </button>
      </div>
    </div>
  );
}
```

---

✅ **Your enterprise login system is ready to use!**

For detailed documentation, see `LOGIN_SYSTEM_README.md`
