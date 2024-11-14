import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginWidget() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        <button
          style={{ height: "5vh", width: "250px", fontSize: "1vh" }}
          type="button"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div>
      <button
        style={{ height: "10vh", width: "25vw", fontSize: "5vh" }}
        type="button"
        onClick={() => signIn("google")}
      >
        Sign in
      </button>
    </div>
  );
}
