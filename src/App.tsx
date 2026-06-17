import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Subscribe from "@/pages/Subscribe";
import Dashboard from "@/pages/Dashboard";
import Unbox from "@/pages/Unbox";
import Review from "@/pages/Review";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminBoxes from "@/pages/admin/AdminBoxes";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 80);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/unbox/:periodId" element={<Unbox />} />
        <Route path="/review/:periodId" element={<Review />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/boxes" element={<AdminBoxes />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin" element={<AdminAnalytics />} />
      </Routes>
    </Router>
  );
}
