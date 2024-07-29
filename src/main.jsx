import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { NextUIProvider } from "@nextui-org/react";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="w-screen max-w-screen-md mx-auto	h-screen text-foreground bg-background">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </main>
    </NextUIProvider>
  </React.StrictMode>
);
