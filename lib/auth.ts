import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import db from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [CredentialsProvider({
    name: "Email and password",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;
      const user = await db.user.findUnique({ where: { email: credentials.email.toLowerCase() } });
      if (!user?.passwordHash || !(await compare(credentials.password, user.passwordHash))) return null;
      return { id: user.id, email: user.email, name: user.name, image: user.image };
    },
  })],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.AUTH_SECRET,
};