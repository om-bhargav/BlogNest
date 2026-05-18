import { NextAuthConfig,AuthError } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";
// class InvalidIdOrPassword extends AuthError{
//   constructor(message: string){
//     super(message);
//     this.message=message;
//     this.name="InvalidCred"
//     this.type="CredentialsSignin"
//   }
// }
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const {email,password} = credentials;
        const user = await prisma.user.findUnique({
          where:{
            email: email
          }
        });
        if(!user){
          return null;
        }
        const currentPassword = user.password;
        const isCorrect = await bcrypt.compare(password,currentPassword);
        if(isCorrect && user.status==="ACTIVE"){
          return {
            id: user.id,
            email: user.email,
            role: user.role
          };
        }
        if(user.status==="SUSPENDED"){
          throw Error("Your Account is Suspended!");
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const {handlers,signIn,signOut,auth} = NextAuth(authConfig);