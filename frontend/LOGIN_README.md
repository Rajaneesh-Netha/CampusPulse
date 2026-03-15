# CampusPulse Login Page

A modern, production-level login page component for the CampusPulse web application.

## Features

- **Consistent Design**: Matches the existing CampusPulse theme, color palette, and visual style
- **Animated Background**: Floating 3D shapes, gradient blobs, and particle effects
- **Micro-interactions**: Smooth hover animations, focus glow effects, and button press animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean card-based design with glassmorphism effects and soft shadows
- **Form Validation**: Built-in email and password validation
- **Loading States**: Visual feedback during form submission

## Component Structure

```
Login.jsx          # Main login component with form logic
Login.css          # Styling matching the CampusPulse theme
```

## Usage

### Basic Implementation

```jsx
import Login from './components/Login';

function App() {
  return <Login />;
}
```

### Integration with Routing

For production use, integrate with a routing library like React Router:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Customization

### Form Handling

The component includes basic form handling. To integrate with your authentication system:

```jsx
// In Login.jsx, modify the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Replace with your authentication logic
    const response = await loginUser({ email, password });

    if (response.success) {
      // Handle successful login (redirect, store token, etc.)
      navigate('/dashboard');
    } else {
      // Handle login error
      setError(response.message);
    }
  } catch (error) {
    setError('Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

### Styling Variables

The component uses CSS custom properties defined in `index.css`. To customize colors:

```css
:root {
  --color-ocean-blue: #3182ce;    /* Primary button color */
  --color-soft-cyan: #4fd1c9;     /* Accent color */
  --color-deep-navy: #1a365d;     /* Dark text */
  --color-bg-primary: #f7fafc;    /* Background */
  /* ... other variables */
}
```

## Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 480px - 768px
- **Mobile**: < 480px

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- React 18+
- CSS with modern features (backdrop-filter, CSS Grid, Flexbox)

## Performance Notes

- Animations use CSS transforms and opacity for optimal performance
- Background effects are GPU-accelerated
- Component uses React hooks for state management
- Minimal re-renders with proper state updates

## Accessibility

- Proper form labels and ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader friendly
- High contrast support

## Demo

To see the login page in action:

1. Set `showLogin = true` in `App.jsx`
2. Run `npm run dev`
3. Navigate to `http://localhost:5174`

For production, implement proper routing and authentication logic.