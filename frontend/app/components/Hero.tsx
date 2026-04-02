'use client'

import { useSiteDetails } from '../context/siteContext';

export function Hero() {
  const siteDetails = useSiteDetails();

  const stats = [
    { num: '20+', label: 'Years Experience' },
    { num: '500+', label: 'Products' },
    { num: '1000+', label: 'Happy Clients' },
  ];

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-badge">⭐ Trusted Wholesale Supplier · Bangalore</div>
        <h2>Premium <em>Stainless Steel</em><br/>Products & Cookware</h2>
        <p>Over two decades of supplying high-quality steel products to businesses and homes across Bangalore. Bulk pricing available.</p>
        <div className="hero-stats">
          {stats.map((stat, i) => (
            <div key={i} className="stat">
              <div className="stat-num">{stat.num}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

