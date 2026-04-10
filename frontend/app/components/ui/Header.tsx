'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';


import { renderImage } from '../../lib/renderImage';
import { useSiteDetails } from '@/app/context/siteContext';

export function Header() {

const { siteDetails } = useSiteDetails();
  
  const { user, isLoaded } = useUser();

  const router = useRouter();

  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');
  const [tenantid, setTenantId] = useState(tenantidFromUrl || '');


  useEffect(() => {
    setTenantId(siteDetails?.tenantid || '');
    console.log("Site Details in Header", siteDetails);
  }, [siteDetails])

  useEffect(() => {
    setTenantId(tenantidFromUrl || '');
  }, [tenantidFromUrl]);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">{siteDetails?.sitelogourl && renderImage(siteDetails.sitelogourl, false)}</div>
          <div className="logo-text">
            <h1>{siteDetails?.sitetitle || ''}</h1>
            {/* {sitesubtitle &&  <span>{sitesubtitle}</span>} */}
          </div>
        </div>
        <div className="nav-actions">
          {isLoaded && user && tenantid && (
            <>
              <button className="nav-btn primary" onClick={() => router.push(`/admin/products?tenantid=${tenantid}`)}>📦 Products</button>
              <button className="nav-btn ghost" onClick={() => router.push(`/admin/settings?tenantid=${tenantid}`)}>⚙️ Site Settings</button>
              <button className="nav-btn ghost" onClick={() => router.push(`/store?tenantid=${tenantid}`)}>🏪 Customer Portal</button>
            </>)}
          <div className="avatar"> <UserButton /></div>
        </div>
      </div>
    </header>
  );
}

