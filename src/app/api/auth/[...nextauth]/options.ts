import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "john@example.com"
        },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              {
                username: credentials.identifier
              }
            ]
          });

          if (!user) {
            throw new Error("No user found with the details provided");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log(user, account, "in signIn options ");
      if (account?.provider === "google") {
        await dbConnect();
        try {
          let existingUser = await UserModel.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new UserModel({
              email: user.email,
              username: user.name?.split(" ").join("").toLowerCase(),
              isVerified: true,
              avatar_url: user.image,
              googleId: user.id
            });
            await newUser.save();
            existingUser = newUser;
          }

          user._id = existingUser._id?.toString();
          user.isVerified = existingUser.isVerified;
          user.username = existingUser.username;
          user.avatar_url = existingUser.avatar_url;
          return true;
        } catch (err: any) {
          console.log(err);
          throw new Error(err);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        session.user.avatar_url = token.avatar_url;
      }
      return session;
    },
    //   user comes from above authorize function
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        token.avatar_url = user.avatar_url;
      }

      // Updating session locally when user updates profile pic
      if (trigger === "update" && session) {
        if (session.user.avatar_url) token.avatar_url = session.user.avatar_url;
        if (session.user.username) token.username = session.user.username;
      }
      return token;
    }
  },
  //   next will handle this
  pages: {
    signIn: "/sign-in"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};

// Next auth will generate a basic sign in form from above details
