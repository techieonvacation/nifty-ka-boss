import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Define types for session and user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      image?: string | null;
      createdAt: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    createdAt: string;
  }
}

// Define types for JWT token
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    picture?: string;
  }
}

// MongoDB user schema
const userSchema = z.object({
  _id: z.any(),
  email: z.string().email(),
  password: z.string(),
  fullName: z.string(),
  image: z.string().optional().nullable(),
});

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials) {
        try {
          // Type guard for credentials
          const hasEmailPassword = (c: unknown): c is { email: string; password: string } =>
            !!c && typeof c === 'object' &&
            'email' in c && typeof (c as Record<string, unknown>).email === 'string' &&
            'password' in c && typeof (c as Record<string, unknown>).password === 'string';
          const hasPhoneOtp = (c: unknown): c is { phone: string; otp: string } =>
            !!c && typeof c === 'object' &&
            'phone' in c && typeof (c as Record<string, unknown>).phone === 'string' &&
            'otp' in c && typeof (c as Record<string, unknown>).otp === 'string';

          // --- Email/Password Login ---
          if (hasEmailPassword(credentials)) {
            const { email, password } = z
              .object({
                email: z.string().email(),
                password: z.string().min(8),
              })
              .parse(credentials);

            const client = await clientPromise;
            const db = client.db("Iamrakeshbansal");
            const user = await db.collection("users").findOne({ email });
            if (!user) {
              console.log("User not found:", email);
              return null;
            }
            const validUser = userSchema.safeParse(user);
            if (!validUser.success) {
              console.log("Invalid user data structure");
              return null;
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
              console.log("Invalid password");
              return null;
            }
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.fullName,
              image: user.image || null,
              createdAt: user.createdAt?.toString() || new Date().toString(),
            };
          }

          // --- Phone/OTP Login ---
          if (hasPhoneOtp(credentials)) {
            const { phone, otp } = z
              .object({
                phone: z.string().regex(/^\d{10,15}$/),
                otp: z.string().length(6),
              })
              .parse(credentials);

            const client = await clientPromise;
            const db = client.db("Iamrakeshbansal");
            const user = await db.collection("users").findOne({ phone });
            if (!user) {
              console.log("User not found (phone):", phone);
              return null;
            }
            if (!user.otp || !user.otpExpiry) {
              console.log("No OTP or expiry set for user");
              return null;
            }
            // Check OTP expiry
            const now = new Date();
            const expiry = new Date(user.otpExpiry);
            if (now > expiry) {
              console.log("OTP expired");
              return null;
            }
            if (user.otp !== otp) {
              console.log("Invalid OTP");
              return null;
            }
            // Optionally, clear OTP after successful login
            await db.collection("users").updateOne({ phone }, { $unset: { otp: "", otpExpiry: "" } });
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.fullName,
              image: user.image || null,
              createdAt: user.createdAt?.toString() || new Date().toString(),
            };
          }

          // If neither method matches, throw error
          throw new Error("Missing credentials");
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image || undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

export const getAuthSession = () => getServerSession(authOptions);

// Helper to check if user is authenticated
export const requireAuth = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
};
