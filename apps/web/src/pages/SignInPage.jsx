import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
    </div>
  );
}
