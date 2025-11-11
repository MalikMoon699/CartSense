import User from "../models/user.model.js";
import mailer from "../config/mailer.js";
import { ADMIN_EMAIL } from "../config/env.js";

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, searchTerm = "" } = req.query;

    const query = {};

    if (role) query.role = role;

    if (searchTerm.trim() !== "") {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      total,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTotalUsersCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({
      success: true,
      totalUsers,
    });
  } catch (error) {
    console.error("Error getting total user count:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting total user count",
    });
  }
};

export const contactMail = async (req, res) => {
  console.log("checkPoint----->");
  try {
    const { name, email, message } = req.body;

    console.log("req.body----->", req.body);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, message) are required",
      });
    }

    const mailOptions = {
      from: `"CartSense Contact" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL || "support@cartsense.com",
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await mailer.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Error sending contact mail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};
