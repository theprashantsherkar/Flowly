import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      {/* fallbackRedirectUrl lets an invite link's redirect_url win when present. */}
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
    </div>
  );
}
