import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="w-screen h-screen text-foreground bg-background">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </main>
    </NextUIProvider>
  </React.StrictMode>
);
