import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItems = await Cart.find({ user: id }).populate("product");

    if (!cartItems.length) {
      return res
        .status(200)
        .json({ success: true, message: "Cart is empty", cart: [] });
    }

    res.status(200).json({ success: true, cart: cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1, selectedOptions = {} } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or productId" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    let cartItem = await Cart.findOne({
      user: userId,
      product: productId,
      selectedOptions: selectedOptions
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        user: userId,
        product: productId,
        quantity,
        selectedOptions,
      });
      user.cart.push(cartItem._id);
      await user.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Product added to cart", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProductFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, quantity } = req.body;

    if (!userId || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or quantity" });
    }

    const cartItem = await Cart.findOne({ user: userId, product: productId });
    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ success: true, message: "Cart updated", cartItem });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or productId" });
    }

    const cartItem = await Cart.findOneAndDelete({
      user: userId,
      product: productId,
    });
    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }

    await User.findByIdAndUpdate(userId, { $pull: { cart: cartItem._id } });

    res
      .status(200)
      .json({ success: true, message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const emptyCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });
    }

    const deleted = await Cart.deleteMany({ user: userId });

    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    res.status(200).json({
      success: true,
      message: `Cart emptied successfully. ${deleted.deletedCount} item(s) removed.`,
    });
  } catch (error) {
    console.error("Error emptying cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCartCount = async (req, res) => {
  try {
    const { id: userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });
    }

    const cartItems = await Cart.find({ user: userId });
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    res.status(200).json({
      success: true,
      cartCount: totalCount,
    });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
