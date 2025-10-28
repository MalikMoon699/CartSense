import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orders: { type: mongoose.Schema.Types.ObjectId, ref: "Orders" },
    categories: { type: Array, default: [] },
    topRated: { type: Array, default: [] },
    topSales: { type: Array, default: [] },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Product", ProductSchema);
