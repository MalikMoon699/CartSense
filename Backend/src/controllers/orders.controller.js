import Orders from "../models/orders.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod, paymentDetails, address, total, items } =
      req.body;

    if (!userId || !items?.length) {
      return res
        .status(400)
        .json({ success: false, message: "Missing order data" });
    }

    const createdOrders = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const order = new Orders({
          user: userId,
          product: item.productId,
          orderquantity: item.quantity,
          totalprice: product.price * item.quantity,
          paymentMethod,
          paymentDetails,
          address,
          status: "pending",
        });

        await order.save();

        product.stock -= item.quantity;
        await product.save();

        return order;
      })
    );

    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, {
      $push: { orders: { $each: createdOrders.map((o) => o._id) } },
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orders: createdOrders,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status.toLowerCase() !== "all") {
      query.status = req.query.status.toLowerCase();
    }

    const total = await Orders.countDocuments(query);
    const orders = await Orders.find(query)
      .populate("user", "name email")
      .populate("product", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json({ success: true, total, count: orders.length, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrdersById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderItems = await Orders.find({ user: id })
      .populate("product", "name price images")
      .sort({ createdAt: -1 });

    if (!orderItems.length) {
      return res
        .status(200)
        .json({ success: true, message: "No orders found", orders: [] });
    }

    res.status(200).json({ success: true, orders: orderItems });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findByIdAndDelete(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    await User.findByIdAndUpdate(order.user, { $pull: { orders: id } });

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Orders.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
