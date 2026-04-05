'use client'

import { getSiteInformation } from '@/services/settingsService';
import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useSearchParams } from 'next/navigation';
import { useSiteDetails } from '@/app/context/siteContext';

export function Hero() {
  const { showToast } = useToast();
  const siteDetails = useSiteDetails();
  
  const [trustedtagline, setTrustedTagline] = useState('');
  const [sitedescription, setSiteDescription] = useState('');
  const [sitesubtitle, setSubSiteTitle] = useState('');
  const [yearsofexperience, setYOE] = useState('');
  const [productssold, setProductsSold] = useState('');
  const [happyclients, setHappyClients] = useState('');

  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');
  const [tenantid, setTenantId] = useState(tenantidFromUrl || '');

  useEffect(() => {
    setTenantId(siteDetails?.tenantid || '');
    setYOE(siteDetails?.yearsofexperience || '');
    setProductsSold(siteDetails?.productssold || '');
    setHappyClients(siteDetails?.happyclients || '');
  }, [siteDetails])

  useEffect(() => {
    fetchData();
  }, [tenantid]);

  const fetchData = async () => {
    if (!tenantid) return;
    try {
      const data = await getSiteInformation(tenantid);
      setTrustedTagline(data?.trustedtagline || '');
      setSubSiteTitle(data?.sitesubtitle || '');
      setSiteDescription(data?.sitedescription || '');
    } catch (err: any) {
      showToast(err.message, "danger");
    }
  }

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-badge">⭐ {trustedtagline}</div>
        {/* <h2>Premium <em>Stainless Steel</em><br/>Products & Cookware</h2> */}
        <h2>{sitesubtitle}</h2>
        <p>{sitedescription}</p>
        <div className="hero-stats">
          {yearsofexperience &&
            <div className="stat">
              <div className="stat-num-hero">{yearsofexperience}</div>
              <div className="stat-label-hero">Years</div>
            </div>
          }
          {productssold &&
            <div className="stat">
              <div className="stat-num-hero">{productssold}</div>
              <div className="stat-label-hero">Products</div>
            </div>
          }
          {happyclients &&

            <div className="stat">
              <div className="stat-num-hero">{happyclients}</div>
              <div className="stat-label-hero">Happy Clients</div>
            </div>
          }
        </div>
      </div>
    </section>
  );
}

