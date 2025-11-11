import { Bot, ChevronLeft, SendHorizontal } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import "../assets/style/ChatBot.css";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/Helpers";
import { useAuth } from "../contexts/AuthContext";
import API from "../utils/api";
import { FormatResponse } from "./FormatResponse";
import {
  AdminRoutes,
  ProtectedRoutes,
  PublicRoutes,
} from "../services/Constants";

const ChatBot = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isChatBot, setIsChatBot] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState(() => {
    const savedChats = sessionStorage.getItem("csChats");
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, responseLoading]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [isChatBot]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target) &&
        isChatBot
      ) {
        setIsChatBot(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isChatBot]);

  useEffect(() => {
    sessionStorage.setItem("csChats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (isChatBot) {
      fetchProducts();
      fetchCategories();
    }
  }, [isChatBot]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/adminProduct/getAllProducts", {
        params: { page: 1, limit: 40 },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setProducts(res.data.products || []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/adminProduct/getcategories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCategories(res.data.categories || []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "42px";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  let availableRoutes = [...PublicRoutes];

  if (currentUser) {
    availableRoutes = [...availableRoutes, ...ProtectedRoutes];
    if (currentUser.role === "admin") {
      availableRoutes = [...availableRoutes, ...AdminRoutes];
    }
  }

  const routesText = availableRoutes
    .map((r, i) => `${i + 1}. ${r.name} → ${r.path}`)
    .join("\n");

  const infoText = `

${
  currentUser
    ? `
CurrentUser Details:
- _Id: ${currentUser._id || ""}
- Name: ${currentUser.name || ""}
- Email: ${currentUser.email || ""}
- createdAt: ${currentUser.createdAt || ""}
- updatedAt: ${currentUser.updatedAt || ""}
- orders: ${currentUser.orders?.length || 0}
- cart: ${currentUser.cart?.length || 0}
`
    : "No current user information available."
}

📍 Available Routes:
${routesText}

Introduction:
I'm your friendly  Cart Sense chatbot where every click makes perfect sense, here to assist you with anything you need related to our store! Whether you're looking for information about our products, business hours, or tech guidance, I'm here to help.

Owner Details:
- Name: Jhone Doe
- Email: jhoneDoe@gmail.com
- Phone: +1 (555) 123-4567

Developer Details:
- Name: Mujtaba Malik
- Email: malikmoon.developer061@gmail.com
- Phone: 03197166872

Full Form:  Cart Sense

Details:
 Cart Sense is your ultimate destination for high-quality electronic devices and accessories. 

📍 Location: Pakistan,Lahore,Kareem Block
🕒 Regular Hours: 10:00 AM to 11:00 PM
🕌 Friday Hours: 02:00 AM to 12:00 PM
💬 Note: We're always here to assist you!

Stay connected:
- Facebook: https://facebook.com/CartSense
- Instagram: https://instagram.com/CartSense
- Twitter: https://twitter.com/CartSense
- LinkedIn: https://linkedin.com/company/CartSense

Website: https://cart-sense.vercel.app
Email: CartSense@gmail.com
Phone: +1 (555) 123-4567




============================
Available Categories:
${categories.length ? categories.join(", ") : "No categories available."}
============================

Products:
${
  products.length
    ? products
        .map(
          (p, i) =>
            `${i + 1}. ${p.name || "Unnamed Product"} — Rs ${
              p.price?.toLocaleString?.() || "N/A"
            }`
        )
        .slice(0, 20)
        .join("\n")
    : "No products available at the moment."
}
============================

Products with details:
${
  products.length
    ? products
        .map((p, i) => {
          const commonDetails = `
${i + 1}. ${p.name || "Unnamed Product"}
   • Category: ${p.categories?.join(", ") || "N/A"}
   • Seller ID: ${p.user || "N/A"}
   • Rating: ${p.rating?.toFixed?.(1) || "N/A"}
   • Stock: ${p.stock ?? "N/A"}`;

          const filledDetails = p.filleds?.length
            ? p.filleds
                .map(
                  (f) =>
                    `   • ${f.title || "Field"}: ${
                      f.value?.join(", ") || "N/A"
                    }`
                )
                .join("\n")
            : "";

          const reviewDetails = p.reviews?.length
            ? `\n   • Reviews (${p.reviews.length}):\n${p.reviews
                .slice(0, 3)
                .map(
                  (r, idx) =>
                    `      ${idx + 1}. ${r.name} — ⭐ ${r.rating}\n         "${
                      r.description
                    }"`
                )
                .join("\n")}`
            : "\n   • Reviews: No reviews yet.";

          const footer = `
   • Price: Rs ${p.price?.toLocaleString?.() || "N/A"} Pkr
   • Description: ${p.description || "No description available."}
   • Images: ${p.images?.length ? p.images.join(", ") : "No images"}
${reviewDetails}`;

          return `${commonDetails}\n${filledDetails}\n${footer}`;
        })
        .slice(0, 20)
        .join("\n\n")
    : "No products available at the moment."
}
============================
`;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      by: "user",
      message: input,
      createdAt: new Date().toString(),
    };

    setChats((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "42px";
    }
    setSendLoading(true);
    setTimeout(() => setSendLoading(false), 300);
    setResponseLoading(true);

    try {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `You are Cart Sense AI assistant. Use the following information to answer the user's question:\n${infoText}\n\nUser: ${input}`,
              },
            ],
          },
        ],
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const rawAiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      const fallbackText =
        "Sorry, I couldn't understand that. How can I help you today? Do you have any questions about our products, store hours, location, or anything else related to Cart Sense?";

      const lowerText = rawAiText.toLowerCase();

      const aiMessageText =
        !rawAiText ||
        lowerText.includes("outside my area of expertise") ||
        lowerText.includes("beyond my capabilities") ||
        lowerText.includes("can't help you") ||
        lowerText.includes("cannot help")
          ? fallbackText
          : rawAiText;

      setChats((prev) => [
        ...prev,
        { by: "bot", message: aiMessageText, createdAt: new Date().toString() },
      ]);
      setResponseLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setChats((prev) => [
        ...prev,
        {
          by: "bot",
          message: "Something went wrong. Please try again later.",
          createdAt: new Date().toString(),
        },
      ]);
      setResponseLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-wrapper">
      {isChatBot && (
        <div className="chatbot-container" ref={chatContainerRef}>
          <div className="chatbot-header">
            <button
              className="chatbot-back-btn"
              onClick={() => setIsChatBot(false)}
            >
              <ChevronLeft />
            </button>
            <div className="chatbot-title">
              <Bot /> <span>AI Assistant</span>
            </div>
            <div className="chatbot-header-extra"></div>
          </div>

          <div className="chatbot-messages" ref={chatContainerRef}>
            <div className="chat-message bot-message">
              <p>Hey there 👋</p>
              <p>How can I assist you today?</p>
              <p>
                <strong>Cart Sense</strong> — where every click makes perfect
                sense.
              </p>
            </div>

            {chats.map((item, index) => (
              <div
                key={index}
                className={`chat-message ${
                  item.by === "bot" ? "bot-message" : "user-message"
                }`}
              >
                {item.message && (
                  <FormatResponse
                    text={item.message}
                    products={products}
                    routes={availableRoutes}
                    navigateTo={(idOrPath) => {
                      setIsChatBot(false);
                      if (products.find((p) => p._id === idOrPath)) {
                        navigate(`/product/${idOrPath}`);
                      } else {
                        navigate(
                          idOrPath.startsWith("/") ? idOrPath : `/${idOrPath}`
                        );
                      }
                    }}
                  />
                )}
              </div>
            ))}

            {responseLoading && (
              <div className="chat-message bot-message">
                <Loader
                  size="20"
                  color="white"
                  style={{ width: "90px", height: "100%" }}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
            <textarea
              placeholder="Type your question..."
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="chatbot-textarea"
            />
            <button onClick={handleSend} className="chatbot-send-btn">
              {sendLoading ? (
                <Loader
                  loading={true}
                  size="20"
                  style={{ height: "24px", width: "24px" }}
                  color="white"
                  className=""
                />
              ) : (
                <SendHorizontal />
              )}
            </button>
          </div>
          <span className="chat-bot-corner"></span>
        </div>
      )}

      <div className="chatbot-icon" onClick={() => setIsChatBot(!isChatBot)}>
        <Bot />
      </div>
    </div>
  );
};

export default ChatBot;
