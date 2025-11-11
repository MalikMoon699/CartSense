import { Copy, ShoppingBag, SquareArrowOutUpRight } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text);
  toast.success("Code Copied!");
};

export const FormatResponse = ({
  text,
  products = [],
  routes = [],
  navigateTo,
}) => {
  const matchedProducts = products.filter(
    (p) => p.name && text.toLowerCase().includes(p.name.toLowerCase())
  );

  const matchedRoutes = routes.filter(
    (r) => r.name && text.toLowerCase().includes(r.name.toLowerCase())
  );

  return (
    <div
      style={{ padding: "0px 10px", borderRadius: "10px", lineHeight: "1.6" }}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <>
                <div className="code-header">
                  <strong>Code</strong>
                  <span onClick={() => handleCopy(String(children))}>
                    <Copy size={15} /> Copy
                  </span>
                </div>
                <SyntaxHighlighter
                  style={materialDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </>
            ) : (
              <code {...props}>{children}</code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
      {(matchedProducts.length > 0 || matchedRoutes.length > 0) && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {matchedProducts.map((p) => (
            <button
              key={p._id}
              onClick={() => navigateTo(p._id)}
              className="chatbot-view-product-btn"
            >
              <ShoppingBag size={16} /> View {p.name}
            </button>
          ))}

          {matchedRoutes.map((r) => (
            <button
              key={r.path}
              onClick={() => navigateTo(r.path)}
              className="chatbot-view-product-btn"
            >
              <SquareArrowOutUpRight size={16} /> Go {r.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
