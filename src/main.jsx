import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { InventoryProvider } from "./contexts/InventoryContext.jsx";

// *** Disable console logs & warnings only in production ***
if (process.env.NODE_ENV === "production") {
  console.log = function () {};
  console.warn = function () {};
  // Keep errors visible for debugging in production
}

// Render React App
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <InventoryProvider>
      <App />
    </InventoryProvider>
  </StrictMode>
);
