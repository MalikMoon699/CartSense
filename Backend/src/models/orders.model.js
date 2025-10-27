import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    orderquantity: { type: Number, required: true },
    totalprice: { type: Number, required: true}
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Orders", OrderSchema);
