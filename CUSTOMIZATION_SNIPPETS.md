# Common Customizations & Code Snippets

## 🎨 Customization Examples

### 1. Change Login Page Title & Subtitle

**File**: `src/pages/Login.jsx`

**Find** (around line 21-24):
```jsx
<h1 className="login-title">Security Operations Center</h1>
<p className="login-subtitle">Enterprise Surveillance Platform</p>
```

**Replace with**:
```jsx
<h1 className="login-title">Your Organization Name</h1>
<p className="login-subtitle">Your Organization Tagline</p>
```

**Example**:
```jsx
<h1 className="login-title">National Security Agency</h1>
<p className="login-subtitle">Unified Command & Control</p>
```

---

### 2. Change Login Logo/Brand

**File**: `src/pages/Login.jsx`

**Find** (around line 20):
```jsx
<div className="login-logo">VTS</div>
```

**Replace with**:
```jsx
<div className="login-logo">NSA</div>
```

Or use an image:
```jsx
<img src="/your-logo.png" className="login-logo-img" alt="Logo" />
```

And add to `src/pages/Login.css`:
```css
.login-logo-img {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: contain;
}
```

---

### 3. Change Primary Accent Color

**File**: `src/pages/Login.css`

**Find gradient** (line ~113):
```css
background: linear-gradient(135deg, #0ea5e9, #0284c7);
```

**Replace with your color**:
```css
/* For green accent */
background: linear-gradient(135deg, #10b981, #059669);

/* For purple accent */
background: linear-gradient(135deg, #8b5cf6, #7c3aed);

/* For red accent */
background: linear-gradient(135deg, #ef4444, #dc2626);

/* For orange accent */
background: linear-gradient(135deg, #f97316, #ea580c);
```

**Apply to all buttons** (find and replace):
- `.login-logo` - line ~113
- `.login-btn` - line ~173

---

### 4. Add "Remember Me" Checkbox

**File**: `src/pages/Login.jsx`

**Add this after password field** (around line 60):
```jsx
<div className="form-group">
  <label className="checkbox-label">
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      disabled={isLoading}
    />
    <span>Remember me for 30 days</span>
  </label>
</div>
```

**Add state at top** (around line 11):
```jsx
const [rememberMe, setRememberMe] = useState(false);
```

**Add CSS to `src/pages/Login.css`**:
```css
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #cbd5e1;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #0ea5e9;
}
```

---

### 5. Add "Forgot Password?" Link

**File**: `src/pages/Login.jsx`

**Add after password field** (around line 60):
```jsx
<div className="form-footer">
  <a href="/forgot-password" className="forgot-link">
    Forgot password?
  </a>
</div>
```

**Add CSS to `src/pages/Login.css`**:
```css
.form-footer {
  text-align: right;
}

.forgot-link {
  font-size: 13px;
  color: #0ea5e9;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #38bdf8;
  text-decoration: underline;
}
```

---

### 6. Add Sign Up Link

**File**: `src/pages/Login.jsx`

**Add in footer** (around line 85):
```jsx
<div className="login-footer">
  <p className="login-help-text">
    Don't have an account?
    <a href="/signup" className="signup-link"> Create one</a>
  </p>
</div>
```

**Add CSS to `src/pages/Login.css`**:
```css
.signup-link {
  color: #0ea5e9;
  margin-left: 4px;
  font-weight: 600;
}

.signup-link:hover {
  text-decoration: underline;
}
```

---

### 7. Enable Real Backend Authentication

**File**: `src/context/AuthContext.jsx`

**Replace the login function** (around line 22):
```jsx
const login = async (username, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const { token, user } = await response.json();

    // Store token and user
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem('auth', 'true');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

  } catch (error) {
    throw new Error(error.message || 'Authentication failed');
  }
};
```

**Update ProtectedRoute** to send token with requests:
```jsx
// Add headers to API calls
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
};
```

---

### 8. Add Session Timeout (30 minutes)

**File**: `src/context/AuthContext.jsx`

**Add to AuthProvider** (after login function):
```jsx
// Auto-logout after 30 minutes of inactivity
useEffect(() => {
  if (!isAuthenticated) return;

  let timeout;

  const handleActivity = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      logout();
      console.log('Session expired due to inactivity');
    }, 30 * 60 * 1000); // 30 minutes
  };

  // Listen for user activity
  window.addEventListener('mousedown', handleActivity);
  window.addEventListener('keydown', handleActivity);

  handleActivity(); // Start timer

  return () => {
    window.removeEventListener('mousedown', handleActivity);
    window.removeEventListener('keydown', handleActivity);
    clearTimeout(timeout);
  };
}, [isAuthenticated]);
```

---

### 9. Add Logout Button to Sidebar

**File**: `src/components/Sidebar.jsx`

**Add import at top**:
```jsx
import { useAuth } from "../context/AuthContext";
```

**Add hook to component**:
```jsx
const { logout, user } = useAuth();
```

**Add to sidebar footer** (before closing div):
```jsx
<div className="sidebar-footer">
  <button className="logout-btn" onClick={logout}>
    Sign Out ({user?.username})
  </button>
</div>
```

**Add to `src/styles/Sidebar.css`**:
```css
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #1e293b;
  margin-top: auto;
}

.logout-btn {
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid #475569;
  border-radius: 6px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.logout-btn:hover {
  border-color: #64748b;
  background: rgba(148, 163, 184, 0.05);
  color: #cbd5e1;
}

.logout-btn:active {
  transform: scale(0.98);
}
```

---

### 10. Show User Info Anywhere

**Any component**:
```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <p>Username: {user.username}</p>
      <p>Logged in at: {new Date(user.loginTime).toLocaleString()}</p>
    </div>
  );
}
```

---

### 11. Change Module Cards

**File**: `src/pages/SelectModule.jsx`

**Modify the modules array** (around line 16):
```jsx
const modules = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Real-time monitoring and metrics",
    icon: "📊",
    path: "/",
  },
  {
    id: "events",
    title: "Events",
    description: "CCTV events and alerts",
    icon: "🎥",
    path: "/events",
  },
  // Add more modules:
  {
    id: "analytics",
    title: "Analytics",
    description: "Historical data and reports",
    icon: "📈",
    path: "/analytics",
  },
  {
    id: "settings",
    title: "Settings",
    description: "System configuration",
    icon: "⚙️",
    path: "/settings",
  },
];
```

---

### 12. Add Loading Spinner Globally

**Create file**: `src/components/LoadingOverlay.jsx`
```jsx
import React from "react";
import "./LoadingOverlay.css";

function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default LoadingOverlay;
```

**Create file**: `src/components/LoadingOverlay.css`
```css
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(14, 165, 233, 0.1);
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

### 13. Redirect After Login (Custom)

**File**: `src/pages/Login.jsx`

**Modify the redirect** (around line 36):
```jsx
// Instead of /select-module:
navigate("/");  // Go directly to dashboard

// Or with a delay:
setTimeout(() => {
  navigate("/select-module");
}, 1000);
```

---

### 14. Add Password Visibility Toggle

**File**: `src/pages/Login.jsx`

**Add state**:
```jsx
const [showPassword, setShowPassword] = useState(false);
```

**Modify password input** (around line 70):
```jsx
<div className="password-group">
  <label htmlFor="password" className="form-label">
    Password
  </label>
  <div className="password-input-wrapper">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      className="form-input"
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      disabled={isLoading}
      autoComplete="current-password"
    />
    <button
      type="button"
      className="toggle-password"
      onClick={() => setShowPassword(!showPassword)}
      disabled={isLoading}
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>
```

**Add CSS to `src/pages/Login.css`**:
```css
.password-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-input {
  flex: 1;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #0ea5e9;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #38bdf8;
}

.toggle-password:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

### 15. Custom Error Messages

**File**: `src/pages/Login.jsx`

**Replace error handling**:
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Custom validation messages
  if (!username.trim()) {
    setError("Please enter your username or email address");
    return;
  }

  if (!password.trim()) {
    setError("Please enter your password");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters long");
    return;
  }

  if (username.length < 3) {
    setError("Username must be at least 3 characters");
    return;
  }

  // Proceed with login...
};
```

---

### 16. Add Department/Role Selection

**Create**: `src/pages/RoleSelect.jsx`
```jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelect.css";

function RoleSelect() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = React.useState(null);

  const roles = [
    { id: "operator", label: "Operator", icon: "👤" },
    { id: "supervisor", label: "Supervisor", icon: "👔" },
    { id: "analyst", label: "Analyst", icon: "🔍" },
    { id: "admin", label: "Administrator", icon: "🛡️" },
  ];

  const handleSelect = (roleId) => {
    setSelectedRole(roleId);
    // Store role in context or localStorage
    localStorage.setItem("userRole", roleId);
    navigate("/select-module");
  };

  return (
    <div className="role-select-container">
      <h1>Select Your Role</h1>
      <div className="roles-grid">
        {roles.map((role) => (
          <button
            key={role.id}
            className={`role-card ${selectedRole === role.id ? "selected" : ""}`}
            onClick={() => handleSelect(role.id)}
          >
            <div className="role-icon">{role.icon}</div>
            <h2>{role.label}</h2>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RoleSelect;
```

---

## 📋 Summary of Customization Points

| Area | File | Key Changes |
|------|------|-------------|
| **Branding** | Login.jsx | Logo text, title, subtitle |
| **Colors** | Login.css | Gradients, accent colors |
| **Features** | Login.jsx | Add/remove fields |
| **Validation** | Login.jsx | Custom rules |
| **Backend** | AuthContext.jsx | API integration |
| **UI Elements** | SelectModule.jsx | Module cards |
| **Sidebar** | Sidebar.jsx | Add logout button |
| **Styling** | Login.css | Adjust spacing, fonts |

---

These snippets provide quick copy-paste solutions for common customizations!
