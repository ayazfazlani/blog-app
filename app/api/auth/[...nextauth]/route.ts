import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
// To this (default import):
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; // recommended for Next.js

const { handlers } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email + Password Login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 NextAuth authorize called for:", credentials?.email);

        // Strong typing + early validation
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        console.log("📧 Looking up user:", email);
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.log("❌ User not found");
          return null;
        }

        if (!user.password) {
          console.log("❌ User has no password (OAuth user)");
          return null;
        }

        console.log("🔑 Comparing password...");
        // Compare password using bcryptjs (must match registration)
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          console.log("❌ Password mismatch");
          return null;
        }

        console.log("✅ Login successful for:", email);
        // Return user object (NextAuth will create JWT from this)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Your login page
    error: "/api/auth/error", // Error page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;
