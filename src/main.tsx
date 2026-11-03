import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/global.css";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/common/Layout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </StrictMode>,
);
