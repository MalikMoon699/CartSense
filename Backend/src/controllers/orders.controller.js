import Orders from "../models/orders.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import mailer from "../config/mailer.js";
import {Frontend_Url} from "../config/env.js"

export const createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod, paymentDetails, address, total, items } =
      req.body;

    if (!userId || !items?.length) {
      return res
        .status(400)
        .json({ success: false, message: "Missing order data" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

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

        return order.populate("product", "name price images");
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

    const orderDate = new Date().toLocaleDateString();
    const productsHtml = createdOrders
      .map(
        (order) => `
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px 0;">
              <b>${order.product.name}</b><br>
              Quantity: ${order.orderquantity}<br>
              Price: Rs ${order.totalprice.toFixed(2)}
              <br>
              <a href="${Frontend_Url}/product/${order.product._id}" 
                 style="display:inline-block;margin-top:5px;padding:8px 12px;background:#000;color:#fff;text-decoration:none;border-radius:5px;">
                 View Product
              </a>
            </td>
          </tr>`
      )
      .join("");

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;">
        <h2 style="text-align:center;">Thank you for your order</h2>
        <p>Hi ${user.name},</p>
        <p>We’ve received your order on ${orderDate}, and it’s now being processed.</p>

        <h3 style="margin-top:30px;">Order Summary</h3>
        <table width="100%" style="border-collapse:collapse;">
          ${productsHtml}
        </table>

        <hr style="margin:20px 0;">
        <p><b>Total:</b> Rs ${total}</p>
        <p><b>Payment Method:</b> ${paymentMethod}</p>

        <h3 style="margin-top:30px;">Billing Address</h3>
        <p>${user.name}<br>${address.location}, ${address.city}, ${address.country}</p>
        <p>${user.email}</p>

        <h3>Shipping Address</h3>
        <p>${user.name}<br>${address.location}, ${address.city}, ${address.country}</p>

        <p style="margin-top:30px;">If you have any questions about your order, contact us at 
          <a href="mailto:CartSense@gmail.com">CartSense@gmail.com</a>.
        </p>

        <p style="text-align:center;margin-top:30px;">— The Cart Sense Team</p>
      </div>
    `;

    await mailer.sendMail({
      from: `"Cart Sense" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order Confirmation - #${createdOrders[0]._id
        .toString()
        .slice(-6)}`,
      html: htmlContent,
    });

    await mailer.sendMail({
      from: `"Cart Sense" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received - #${createdOrders[0]._id
        .toString()
        .slice(-6)}`,
      html: htmlContent.replace(
        "Thank you for your order",
        "New Order Received"
      ),
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully and emails sent",
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

    const status = req.query.status?.toLowerCase();
    const search = req.query.search?.trim();

    const statusMatch = status && status !== "all" ? { status } : null;

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ];

    if (statusMatch) pipeline.push({ $match: statusMatch });

    if (search) {
      const regex = new RegExp(search, "i");
      pipeline.push({
        $match: {
          $or: [
            { $expr: { $regexMatch: { input: { $toString: "$_id" }, regex } } },
            { "product.name": { $regex: regex } },
            { "product.categories": { $regex: regex } },
            { "user.name": { $regex: regex } },
          ],
        },
      });
    }

    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Orders.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    const orders = await Orders.aggregate(pipeline);

    res.status(200).json({
      success: true,
      total,
      count: orders.length,
      orders,
    });
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
    )
      .populate("user", "name email")
      .populate("product", "name description price images categories stock");

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const userName = updatedOrder.user?.name || "Customer";
    const userEmail = updatedOrder.user?.email;

    const product = updatedOrder.product;

    const productHtml = product
      ? `
   
        ${product.images
          .map((img) => `<img src="${img}" width="100" style="margin:5px"/>`)
          .join("")}
               <h4>${product.name}</h4>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <p>Quantity: ${updatedOrder.orderquantity}</p>
      `
      : "Product details not available.";

    const subject = `Your Order #${updatedOrder._id} Status Updated`;
    const text = `
Hello ${userName},

Your order status has been updated to: ${status.toUpperCase()}.

Order ID: ${updatedOrder._id}
Product: ${product?.name || "N/A"}
Total Price: $${updatedOrder.totalprice}

Thank you for shopping with us!
`;

    try {
      await mailer.sendMail({
        from: `"Cart Sense" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject,
        text,
        html: `
          <h3>Hello ${userName},</h3>
          <p>Your order status has been updated to: <b>${status.toUpperCase()}</b>.</p>
          <p><b>Order ID:</b> ${updatedOrder._id}</p>
          <h3>Product details:</h3>
          ${productHtml}
          <br/>
          Total Price: $${updatedOrder.totalprice}
          <br/>
          <p>Thank you for shopping with us!</p>
          <p>Best regards,<br/>Your Shop Team</p>
        `,
      });
    } catch (mailError) {
      console.error("Failed to send email:", mailError);
    }

    res.status(200).json({
      success: true,
      message: "Order updated and email sent to user",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTotalOrdersCount = async (req, res) => {
  try {
    const totalOrders = await Orders.countDocuments();
    res.status(200).json({
      success: true,
      totalOrders,
    });
  } catch (error) {
    console.error("Error getting total orders count:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting total orders count",
    });
  }
};

export const getTotalRevenue = async (req, res) => {
  try {
    const result = await Orders.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalprice" } } },
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error getting total revenue:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting total revenue",
    });
  }
};
