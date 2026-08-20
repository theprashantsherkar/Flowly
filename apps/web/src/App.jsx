import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Analytics } from '@vercel/analytics/react';
import Landing from './pages/Landing';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import FlowEditorPage from './pages/FlowEditorPage';
import InvitePage from './pages/InvitePage';

function Protected({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/flow/:id"
          element={
            <Protected>
              <FlowEditorPage />
            </Protected>
          }
        />
        <Route
          path="/invite/:token"
          element={
            <Protected>
              <InvitePage />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </>
  );
}
