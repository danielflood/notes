import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      router.push("/"); // Redirect if signed in
    }
  }, [session, status, router]);

  if (session) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="signin-container">
      <h1>Welcome to the Notes App</h1>
      <p>Please sign in to continue</p>
      <button className="google-signin-btn" onClick={() => signIn("google")}>
        <img src="/google-logo.svg" alt="Google logo" className="google-logo" />
        Sign in with Google
      </button>
    </div>
  );
}
