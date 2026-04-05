'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { getSiteInformation } from '@/services/settingsService';
import { useToast } from '../../context/ToastContext';
import { renderImage } from '../../lib/renderImage';
import { useSiteDetails } from '@/app/context/siteContext';

export function Header() {
  const { showToast } = useToast();
  const siteDetails = useSiteDetails();
  
  const { user, isLoaded } = useUser();

  const router = useRouter();
  const [sitetitle, setSiteTitle] = useState('');

  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');
  const [tenantid, setTenantId] = useState(tenantidFromUrl || '');
  const [sitelogourl, setSiteLogoUrl] = useState<string | { filename: string; size: number; url?: string } | null>(null);

  useEffect(() => {
    setTenantId(siteDetails?.tenantid || '');
  }, [siteDetails])

  useEffect(() => {
    setTenantId(tenantidFromUrl || '');
  }, [tenantidFromUrl]);

  useEffect(() => {
    if (tenantid) {
      fetchData();
    }
  }, [tenantid]);

  const fetchData = async () => {
    if (!tenantid) return;
    try {
      const data = await getSiteInformation(tenantid);
      setSiteTitle(data?.sitetitle || '');
      setSiteLogoUrl(data?.sitelogourl || null);
    } catch (err: any) {
      showToast(err.message, "danger");
    }
  }

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
          {isLoaded && user && tenantid && (
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

