'use client';

import { useEffect, useState } from "react";
import { useSiteDetails } from "../context/siteContext";

export default function About() {

  const siteDetails = useSiteDetails();

  const [ownername, setOwnerName] = useState("");
  const [ownertitle, setOwnerTitle] = useState("");
  const [aboutowner, setAboutOwner] = useState("");

  useEffect(() => {
    setOwnerName(siteDetails?.ownername || '')
    setOwnerTitle(siteDetails?.ownertitle || '')
    setAboutOwner(siteDetails?.aboutowner || '')
  }, [siteDetails])

  return (
    <div className="card">
      <div className="custom-card-header">
        <div className="card-title mb-0"><div className="card-title-icon">👤</div>About Us</div>
      </div>
      <div className="card-body">
        <div className="owner-row">
          <div className="owner-avatar">{ownername.charAt(0)}</div>
          <div><div className="owner-name">{ownername}</div><div className="owner-role">{ownertitle}</div></div>
        </div>
        <p className="about-text">{aboutowner}</p>
      </div>
    </div>
  );
}
