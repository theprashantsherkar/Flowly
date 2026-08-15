import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';
import { MissingClerkKey } from './components/MissingClerkKey';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const root = ReactDOM.createRoot(document.getElementById('root'));

// Fail friendly: if the Clerk key hasn't been set yet, show setup instructions
// instead of a cryptic crash from ClerkProvider.
if (!publishableKey || publishableKey.includes('placeholder')) {
  root.render(<MissingClerkKey />);
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </React.StrictMode>
  );
}
