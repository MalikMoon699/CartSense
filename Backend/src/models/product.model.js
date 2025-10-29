import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String },
    description: { type: String },
    images: [{ type: String }],
    filleds: [
      {
        title: { type: String },
        value: [{ type: String }],
      },
    ],
    price: { type: String },
    stock: { type: Number },
    rating: { type: Number },
    categories: [{ type: String }],
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Product", ProductSchema);
