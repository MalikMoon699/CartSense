import mongoose from "mongoose";

const ShopDetailsSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    orders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Orders", default: [] },
    ],
    categories: {
      type: Array,
      default: [
        "Mens",
        "Womens",
        "Electronics",
        "Sports",
        "Home & Garden",
        "Fashion",
        "Books",
        "Beauty",
        "Automotive",
        "Kids & Baby",
      ],
    },
    topRated: { type: Array, default: [] },
    topSales: { type: Array, default: [] },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("ShopDetails", ShopDetailsSchema);
