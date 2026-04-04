'use client'

import { useSiteDetails } from '../context/siteContext';
import { useEffect, useState } from 'react';

export function Header() {
  const siteDetails = useSiteDetails();
  const [cartCount, setCartCount] = useState(0);

  // Simulate cart count from localStorage (match existing logic)
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(items.length);
  }, [cartCount]);

  const openWhatsapp = () => {
    const phoneNumber = siteDetails?.contactphone || siteDetails?.alternatecontactphone || '';
    const message = "Hello, I would like to inquire about your products.";
    const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">🔩</div>
          <div className="logo-text">
            <h1>{siteDetails?.sitetitle || 'Raj Wholesale'}<span className="admin-badge">Admin</span></h1>
            <span>Stainless Steel Shop</span>
          </div>
        </div>
    <div className="nav-actions">
      <button className="nav-btn primary">📦 Products</button>
      <button className="nav-btn ghost">⚙️ Site Settings</button>
      <button className="nav-btn ghost">🏪 Customer Portal</button>
      <div className="avatar">H</div>
    </div>
      </div>
    </header>
  );
}

