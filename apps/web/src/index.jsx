import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import './index.css';
import App from './App';
import { MissingClerkKey } from './components/MissingClerkKey';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const root = ReactDOM.createRoot(document.getElementById('root'));

// Make all Clerk UI (sign-in/up, user button, profile modal) match our dark theme.
const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: '#2563eb',
    colorBackground: '#141821',
    colorInputBackground: '#1b2029',
    colorInputText: '#e2e8f0',
    colorText: '#e2e8f0',
    colorTextSecondary: '#94a3b8',
    borderRadius: '0.5rem',
  },
  elements: {
    card: 'border border-borderSoft',
  },
};

// Fail friendly: if the Clerk key hasn't been set yet, show setup instructions
// instead of a cryptic crash from ClerkProvider.
if (!publishableKey || publishableKey.includes('placeholder')) {
  root.render(<MissingClerkKey />);
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/" appearance={clerkAppearance}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </React.StrictMode>
  );
}
