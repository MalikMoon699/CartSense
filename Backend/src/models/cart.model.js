import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
},
  { timestamps: true, strict: false }
);

export default mongoose.model("Cart", CartSchema);
