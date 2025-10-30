import mongoose from "mongoose";


const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

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
    price: { type: Number },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [ReviewSchema],
    categories: [{ type: String }],
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Product", ProductSchema);
