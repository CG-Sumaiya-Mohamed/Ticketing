import mongoose from "mongoose";
import { Password } from "../utils/password";

// Properties required to create a user.
interface UserAttrs {
  email: string;
  password: string;
}

// Properties a saved user document has.
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Properties the User model has (our custom build function).
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id; // Send back "id" like the other services instead of mongo's "_id".
        delete ret._id;
        delete ret.password; // Never send the password back.
        delete ret.__v;
      },
    },
  }
);

// Hash the password before saving, but only when it changed.
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
