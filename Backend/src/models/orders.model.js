import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    orderquantity: { type: Number, required: true },
    totalprice: { type: Number, required: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    paymentDetails: { type: String, default: "" },
    address: {
      country: { type: String },
      city: { type: String },
      location: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    selectedOptions: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Orders", OrderSchema);
