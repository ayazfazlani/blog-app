"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();

  // Auto-redirect if already logged in
  useEffect(() => {
    // Check if we're already logged in (this happens automatically)
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signIn("credentials", {
        email: "user@example.com", // Replace with actual input
        password: "password",      // Replace with actual input
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>
        Click to Login
      </button>
    </div>
  );
}