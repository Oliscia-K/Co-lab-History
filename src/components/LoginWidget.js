import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginWidget() {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    fetch(`/api/login?email=${session.user.email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        router.push(`/user/${result[0].id}/userProfile`);
      })
      .catch((error) => console.log(error));
    return (
      <div>
        <p>
          Signed in as {session.user.email}{" "}
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </p>
      </div>
    );
  }
  return (
    <div>
      <button type="button" onClick={() => signIn("google")}>
        Sign in
      </button>
    </div>
  );
}
