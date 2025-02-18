import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
  avatar_url: string | null;
  googleId: string;
}

const isThirdPartyLogin = function (this: User) {
  return !this.googleId;
};

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"]
  },
  password: {
    type: String,
    required: [isThirdPartyLogin, "Password is Required"]
  },
  verifyCode: {
    type: String,
    required: [isThirdPartyLogin, "Verify Code is Required"]
  },
  verifyCodeExpiry: {
    type: Date,
    required: [isThirdPartyLogin, "Verify Code Expiry is Required"]
  },
  googleId: { type: String, unique: true, sparse: true },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessage: { type: Boolean, default: true },
  messages: [MessageSchema],
  avatar_url: { type: String, default: null }
});

// We need to keep in mind that next js have model or not. That is starting or not
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
