'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { getAdminDetails, getSiteInformation } from '@/services/settingsService';
import { useToast } from '../context/ToastContext';
import { renderImage } from '../lib/renderImage';

export function Header() {
  const { showToast } = useToast();

  const router = useRouter();
  const [sitetitle, setSiteTitle] = useState('');
  const [sitesubtitle, setSubSiteTitle] = useState('');
  const [tenantid, setTenantId] = useState('');
  const [sitelogourl, setSiteLogoUrl] = useState<string | { filename: string; size: number; url?: string } | null>(null);

  // Simulate cart count from localStorage (match existing logic)
  useEffect(() => {
    fetchData();
    fetchAdminDetails();
    // setTenantId(tenantidFromUrl || '');
  }, [tenantid]);

  const fetchAdminDetails = async () => {
    try {
      const data = await getAdminDetails();
      setTenantId(data?.tenantid || '');
    } catch (err: any) {
      showToast(err.message, "danger");
    }
  }

  const fetchData = async () => {
    if (!tenantid) return;
    try {
      const data = await getSiteInformation(tenantid);
      setSiteTitle(data?.sitetitle || '');
      setSubSiteTitle(data?.sitesubtitle || '');
      setSiteLogoUrl(data?.sitelogourl || null);
    } catch (err: any) {
      showToast(err.message, "danger");
    }
  }

  // const openWhatsapp = () => {
  //   const phoneNumber = siteDetails?.contactphone || siteDetails?.alternatecontactphone || '';
  //   const message = "Hello, I would like to inquire about your products.";
  //   const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  //   window.open(url, "_blank");
  // };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">{renderImage(sitelogourl, false)}</div>
          <div className="logo-text">
            <h1>{sitetitle || 'Raj Wholesale'}</h1>
            {/* {sitesubtitle &&  <span>{sitesubtitle}</span>} */}
          </div>
        </div>
        <div className="nav-actions">
          {tenantid && (
            <>
              <button className="nav-btn primary" onClick={() => router.push("/admin/products")}>📦 Products</button>
              <button className="nav-btn ghost" onClick={() => router.push("/admin/settings")}>⚙️ Site Settings</button>
              <button className="nav-btn ghost" onClick={() => router.push(`/store?tenantid=${tenantid}`)}>🏪 Customer Portal</button>
            </>)}
          <div className="avatar"> <UserButton /></div>
        </div>
      </div>
    </header>
  );
}

