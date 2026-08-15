import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/dashboard" />
    </div>
  );
}
