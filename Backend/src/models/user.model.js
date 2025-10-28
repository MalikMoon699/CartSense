// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profileImg: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
