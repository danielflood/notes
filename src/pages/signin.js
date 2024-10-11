import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while session is loading

    if (session) {
      // Redirect to sign-in page if the user is not signed in
      router.push("/");
    }
  }, [session, status, router]);

  if (session) {
    return <p>Redirecting...</p>;
  }
  
  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </>
  );
}
