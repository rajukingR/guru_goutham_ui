import React, { useState } from "react";
import { Star, Laptop, Send, CheckCircle } from "lucide-react";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

// === Reusable Components ===
const Field = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  readOnly = false,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
    />
  </div>
);

// === Main Component ===
const FeedBackFormLayoutfb = () => {
  const [formData, setFormData] = useState({
    rating: 0,
    hoveredRating: 0,
    feedback: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async () => {
    if (formData.rating === 0) {
      setSnackbar({
        open: true,
        message: "Please provide a rating before submitting.",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const feedbackData = {
      product: "Dell Inspiron 15 3000 Series - Rental",
      rating: formData.rating,
      feedback: formData.feedback,
      timestamp: new Date().toISOString(),
    };

    console.log("Feedback submitted:", feedbackData);
    setSnackbar({
      open: true,
      message:
        "Thank you for your feedback! Your review has been submitted successfully.",
      severity: "success",
    });

    // Reset form
    setFormData({
      rating: 0,
      hoveredRating: 0,
      feedback: "",
    });
    setIsSubmitting(false);
  };

  const getRatingText = (rating) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return texts[rating] || "";
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundDecorStyle}></div>

      <div style={formContainerStyle}>
        {/* === Product Feedback === */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <div style={iconStyle}>
              <div style={iconInnerStyle}>💻</div>
            </div>
            <div>
              <h3 style={cardHeaderStyle}>Product Feedback</h3>
              <p style={subtitleStyle}>Share your experience with us</p>
            </div>
          </div>

          {/* Product Info */}
          <div style={productInfoStyle}>
            <div style={productIconStyle}>
              <Laptop style={laptopIconStyle} />
            </div>
            <div>
              <h3 style={productTitleStyle}>Dell Inspiron 15 3000 Series</h3>
              <p style={productSubtitleStyle}>Rental Product</p>
            </div>
          </div>

          {/* Star Rating */}
          <div style={ratingContainerStyle}>
            <label style={labelStyle}>How would you rate this product?</label>
            <div style={starsContainerStyle}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  style={starButtonStyle}
                  onClick={() => handleInputChange("rating", star)}
                  onMouseEnter={() => handleInputChange("hoveredRating", star)}
                  onMouseLeave={() => handleInputChange("hoveredRating", 0)}
                >
                  <Star
                    style={{
                      ...starIconStyle,
                      color:
                        star <= (formData.hoveredRating || formData.rating)
                          ? "#f59e0b"
                          : "#e5e7eb",
                      fill:
                        star <= (formData.hoveredRating || formData.rating)
                          ? "#f59e0b"
                          : "none",
                    }}
                  />
                </button>
              ))}
            </div>
            {(formData.hoveredRating || formData.rating) > 0 && (
              <p style={ratingTextStyle}>
                {getRatingText(formData.hoveredRating || formData.rating)}
              </p>
            )}
          </div>

          {/* Feedback Textarea */}
          <div style={textareaContainerStyle}>
            <label style={labelStyle}>Tell us about your experience</label>
            <textarea
              placeholder="What did you like or dislike about this product? Your feedback helps us improve..."
              style={textareaStyle}
              value={formData.feedback}
              onChange={(e) => handleInputChange("feedback", e.target.value)}
            />
            <div style={characterCountStyle}>
              {formData.feedback.length}/500
            </div>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button
            style={{
              ...submitBtnStyle,
              ...(isSubmitting ? submitBtnDisabledStyle : {}),
              ...(formData.rating === 0 ? submitBtnDisabledStyle : {}),
            }}
            onClick={handleSubmit}
            disabled={isSubmitting || formData.rating === 0}
          >
            {isSubmitting ? (
              <>
                <div style={spinnerStyle}></div>
                Submitting...
              </>
            ) : (
              <>
                <Send style={buttonIconStyle} />
                Submit Review
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Snackbar */}
      {snackbar.open && (
        <div style={snackbarStyle}>
          <div
            style={{
              ...snackbarContentStyle,
              ...(snackbar.severity === "error"
                ? snackbarErrorStyle
                : snackbarSuccessStyle),
            }}
          >
            <div style={snackbarIconStyle}>
              {snackbar.severity === "success" ? (
                <CheckCircle style={snackbarIconInnerStyle} />
              ) : (
                <span style={snackbarIconInnerStyle}>⚠</span>
              )}
            </div>
            <div style={snackbarTextStyle}>{snackbar.message}</div>
            <button style={snackbarCloseStyle} onClick={handleCloseSnackbar}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
  // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  position: "relative",
  overflow: "hidden",
};

const backgroundDecorStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
  `,
  zIndex: 0,
};

const formContainerStyle = {
  display: "grid",
  gap: "2rem",
  maxWidth: "600px",
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
};

const cardStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: "2rem",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow:
    "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

const cardHeaderContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "2rem",
  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
  paddingBottom: "1.5rem",
};

const iconStyle = {
  marginRight: "1rem",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "1rem",
  borderRadius: "16px",
  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
};

const iconInnerStyle = {
  fontSize: "1.5rem",
  filter: "grayscale(1) brightness(0) invert(1)",
};

const cardHeaderStyle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1e293b",
  margin: 0,
  letterSpacing: "-0.02em",
};

const subtitleStyle = {
  fontSize: "0.875rem",
  color: "#64748b",
  margin: "0.25rem 0 0 0",
  fontWeight: "400",
};

const productInfoStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "2rem",
  padding: "1.5rem",
  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  borderRadius: "16px",
  border: "1px solid rgba(0, 0, 0, 0.05)",
};

const productIconStyle = {
  width: "56px",
  height: "56px",
  background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "1rem",
  boxShadow: "0 8px 16px rgba(14, 165, 233, 0.2)",
};

const laptopIconStyle = {
  width: "24px",
  height: "24px",
  color: "white",
};

const productTitleStyle = {
  fontSize: "1.125rem",
  fontWeight: "600",
  color: "#1e293b",
  margin: 0,
  letterSpacing: "-0.01em",
};

const productSubtitleStyle = {
  fontSize: "0.875rem",
  color: "#64748b",
  margin: "0.25rem 0 0 0",
  fontWeight: "500",
};

const ratingContainerStyle = {
  marginBottom: "2rem",
};

const starsContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "0.75rem",
  marginTop: "1rem",
};

const starButtonStyle = {
  background: "none",
  border: "none",
  padding: "0.5rem",
  cursor: "pointer",
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    transform: "scale(1.1)",
  },
};

const starIconStyle = {
  width: "28px",
  height: "28px",
  transition: "all 0.2s ease",
};

const ratingTextStyle = {
  textAlign: "center",
  marginTop: "0.75rem",
  fontSize: "1rem",
  fontWeight: "600",
  color: "#f59e0b",
};

const fieldContainerStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
};

const labelStyle = {
  marginBottom: "0.75rem",
  fontWeight: "600",
  fontSize: "0.875rem",
  color: "#374151",
  letterSpacing: "-0.01em",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#fff",
  transition: "all 0.2s ease",
  ":focus": {
    outline: "none",
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
};

const textareaContainerStyle = {
  marginTop: "1rem",
  position: "relative",
};

const textareaStyle = {
  width: "100%",
  minHeight: "120px",
  padding: "1rem",
  borderRadius: "16px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#fff",
  resize: "vertical",
  transition: "all 0.2s ease",
  fontFamily: "inherit",
  ":focus": {
    outline: "none",
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
};

const characterCountStyle = {
  position: "absolute",
  bottom: "-1.5rem",
  right: "0",
  fontSize: "0.75rem",
  color: "#9ca3af",
  fontWeight: "500",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "2rem",
};

const submitBtnStyle = {
  padding: "1rem 2rem",
  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  color: "white",
  border: "none",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.875rem",
  transition: "all 0.2s ease",
  boxShadow: "0 8px 16px rgba(16, 185, 129, 0.3)",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  letterSpacing: "-0.01em",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 24px rgba(16, 185, 129, 0.4)",
  },
};

const submitBtnDisabledStyle = {
  background: "#e5e7eb",
  color: "#9ca3af",
  cursor: "not-allowed",
  boxShadow: "none",
  ":hover": {
    transform: "none",
    boxShadow: "none",
  },
};

const buttonIconStyle = {
  width: "16px",
  height: "16px",
};


const spinnerStyle = {
  width: "16px",
  height: "16px",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  borderTop: "2px solid white",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// Custom Snackbar Styles
const snackbarStyle = {
  position: "fixed",
  top: "2rem",
  right: "2rem",
  zIndex: 1000,
  animation: "slideIn 0.3s ease-out",
};

const snackbarContentStyle = {
  display: "flex",
  alignItems: "center",
  padding: "1rem 1.5rem",
  borderRadius: "16px",
  minWidth: "300px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

const snackbarSuccessStyle = {
  backgroundColor: "rgba(16, 185, 129, 0.95)",
  color: "white",
};

const snackbarErrorStyle = {
  backgroundColor: "rgba(239, 68, 68, 0.95)",
  color: "white",
};

const snackbarIconStyle = {
  marginRight: "0.75rem",
};

const snackbarIconInnerStyle = {
  width: "20px",
  height: "20px",
};

const snackbarTextStyle = {
  flex: 1,
  fontSize: "0.875rem",
  fontWeight: "500",
};

const snackbarCloseStyle = {
  background: "none",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "1.5rem",
  padding: "0",
  marginLeft: "0.75rem",
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
};

// Add keyframes for animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  textarea:focus, input:focus {
    outline: none !important;
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  
  button:hover {
    transform: translateY(-2px);
  }
  
  button:disabled:hover {
    transform: none !important;
  }
`;
document.head.appendChild(styleSheet);

export default FeedBackFormLayoutfb;