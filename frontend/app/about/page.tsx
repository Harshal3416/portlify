'use client';

import { useSiteDetails } from "../context/siteContext";

export default function About() {
  const { siteDetails } = useSiteDetails();
  const ownerName = siteDetails?.ownername ?? "";
  const ownerTitle = siteDetails?.ownertitle ?? "";
  const aboutOwner = siteDetails?.aboutowner ?? "";
  const ownerInitial = siteDetails?.ownername?.charAt(0) ?? "";

  return (
    <div className="card">
      <div className="custom-card-header">
        <div className="card-title mb-0"><div className="card-title-icon">👤</div>About Us</div>
      </div>
      <div className="card-body">
        <div className="owner-row">
          <div className="owner-avatar">{ownerInitial}</div>
          <div><div className="owner-name">{ownerName}</div><div className="owner-role">{ownerTitle}</div></div>
        </div>
        <p className="about-text">{aboutOwner}</p>
      </div>
    </div>
  );
}
