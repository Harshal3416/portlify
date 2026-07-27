'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';


import { renderImage } from '../../lib/renderImage';
import { useSiteDetails } from '@/app/context/siteContext';
import { usePathname } from 'next/navigation';
import { QRCodeModal } from './QRCodeModal';

  
export function Header() {
  const { siteDetails, authTenantId } = useSiteDetails();
  const pathname = usePathname();
  
  const { user, isLoaded } = useUser();

  const router = useRouter();

  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');
  const [tenantid, setTenantId] = useState(tenantidFromUrl || '');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const isStorePage = pathname === '/store' || pathname?.startsWith('/store?');
  const currentPageURL = typeof window !== 'undefined' ? window.location.href : '';


  useEffect(() => {
    setTenantId(siteDetails?.tenantid || '');
    console.log("Site Details in Header", siteDetails);
  }, [siteDetails])

  useEffect(() => {
    setTenantId(tenantidFromUrl || '');
  }, [tenantidFromUrl]);

  useEffect(() => {
    function updateHeaderOffset() {
      const el = document.querySelector('header.header');
      const height = el ? (el.getBoundingClientRect().height) : 72;
      document.documentElement.style.setProperty('--header-offset', `${Math.ceil(height + 8)}px`);
    }
    updateHeaderOffset();
    window.addEventListener('resize', updateHeaderOffset);
    return () => window.removeEventListener('resize', updateHeaderOffset);
  }, []);

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
        {(isLoaded && user) && (
          <div className="nav-actions">
            {(authTenantId === tenantid || authTenantId) && (
              <>
                <button className="nav-btn ghost" onClick={() => router.push(`/admin/products${tenantid ? `?tenantid=${tenantid}` : ''}`)}>📦 Manage Collection</button>
                <button className="nav-btn ghost" onClick={() => router.push(`/admin/settings${tenantid ? `?tenantid=${tenantid}` : ''}`)}>⚙️ Site Settings</button>
                <button className="nav-btn ghost" onClick={() => router.push(`/store${tenantid ? `?tenantid=${tenantid}` : ''}`)}>🏪 Customer Portal</button>
              </>)}
            {!authTenantId && (
              <button className="nav-btn ghost" onClick={() => router.push('/admin/settings')}>⚙️ Site Settings</button>
            )}
            <div className="avatar"> <UserButton /></div>
          </div>
        )}
        <div>

        {isStorePage && (
          <button 
          className="nav-btn qr-btn" 
          onClick={() => setIsQRModalOpen(true)}
          title="Share QR Code"
          >
            📱 QR Code
          </button>
        )}
        </div>
      </div>
      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        url={currentPageURL}
      />
    </header>
  );
}
