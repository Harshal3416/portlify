'use client';

import { useEffect, useRef, useState } from "react";
import { getAdminContactDetails, getAdminSocialLinks, getOpeningHours, getSiteInformation, updateAdminContactDetails, updateAdminDetails, updateAdminSocialLinks, updateOpeningHours, updateSiteInformation } from "@/services/settingsService";
import { useToast } from "@/app/context/ToastContext";
import { renderImage } from "@/app/lib/renderImage";
import { useSiteDetails } from "@/app/context/siteContext";

export default function Settings() {

    const { showToast } = useToast();
    const { siteDetails, refetchSiteInfo } = useSiteDetails();
    
    const [tenantid, setTenantid] = useState('');

    // Admin details states
    const [ownername, setOwnerName] = useState("");
    const [ownertitle, setOwnerTitle] = useState("");
    const [aboutowner, setAboutOwner] = useState("");
    const [yearsofexperience, setYearsOfExperience] = useState("");
    const [productssold, setProductsSold] = useState("");
    const [happyclients, setHappyClients] = useState("");

    // Site Information states
    const [sitelogourl, setSitelogourl] = useState<File | null>(null);
    const [sitetitle, setSiteTitle] = useState("");
    const [sitesubtitle, setSubSiteTitle] = useState("");
    const [trustedtagline, setTrustedTagline] = useState("");
    const [sitedescription, setSiteDescription] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Admin contact details states
    const [contactemail, setContactEmail] = useState("");
    const [contactphone, setContactPhone] = useState("");
    const [alternatecontactphone, setAlternateContactPhone] = useState("");
    const [address, setAddress] = useState("");

    // Admin social links states
    const [instagramurl, setInstagramUrl] = useState("");
    const [googlemapurl, setGoogleMapUrl] = useState("");
    const [justdialurl, setJustDialUrl] = useState("");

    // Opening hours states
    const [monday, setMonday] = useState("");
    const [tuesday, setTuesday] = useState("");
    const [wednesday, setWednesday] = useState("");
    const [thursday, setThursday] = useState("");
    const [friday, setFriday] = useState("");
    const [saturday, setSaturday] = useState("");
    const [sunday, setSunday] = useState("");
    const [activeSection, setActiveSection] = useState('adminSec');

    const [isAdminDetailsFromDb, setIsAdminDetailsFromDb] = useState(false)

    const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");

    // Error states
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorAlternatePhone, setErrorAlternatePhone] = useState("");
    const [errorInstagram, setErrorInstagram] = useState("");
    const [errorGoogleMap, setErrorGoogleMap] = useState("");
    const [errorJustDial, setErrorJustDial] = useState("");

    useEffect(() => {
        setTenantid(siteDetails?.tenantid || '');
        setOwnerName(siteDetails?.ownername || '');
        setOwnerTitle(siteDetails?.ownertitle || '');
        setAboutOwner(siteDetails?.aboutowner || '');
        setYearsOfExperience(siteDetails?.yearsofexperience || '');
        setProductsSold(siteDetails?.productssold || '');
        setHappyClients(siteDetails?.happyclients || '');

        if(siteDetails?.tenantid) {
            setIsAdminDetailsFromDb(true);
        }
    }, [siteDetails])

    useEffect(() => {
        if(!isAdminDetailsFromDb) return;
        console.log("fetching additional details for tenantid", tenantid);
        fetchSiteInformation()
        fetchAdminContactDetails()
        fetchAdminSocialLinks()
        fetchOpeningHours()
    }, [isAdminDetailsFromDb]);

    // Admin details Update functions
    const updateAdminDetailsFn = async () => {
        try {
            await updateAdminDetails({ tenantid, ownername, ownertitle, aboutowner, yearsofexperience, productssold, happyclients });
            showToast("Details saved!", "success")
            setIsAdminDetailsFromDb(true);
            // set tenant id in url without refreshing the page
                const newUrl = `${window.location.pathname}?tenantid=${tenantid}`;
                window.history.pushState({ path: newUrl }, '', newUrl);

        } catch (error: any) {
            showToast(error, "danger")
        }
    };

    // Site information update function
    const updateSiteInformationFn = async () => {
        if(!isAdminDetailsFromDb) { return showToast("Please enter Tenant ID first in Admin Details section and save it to navigate.", "warning") }
        try {
            await updateSiteInformation({ tenantid, sitetitle, sitesubtitle, sitelogourl, trustedtagline, sitedescription });
            showToast("Saved Successfully", "success");
            await fetchSiteInformation();
            refetchSiteInfo?.();
            setIsAdminDetailsFromDb(true);
            refetchSiteInfo && refetchSiteInfo();
        } catch (error: any) {
            showToast(error?.message, "danger")
        }
    };

    // Fetch site Information
    const fetchSiteInformation = async () => {
        try {
            const data = await getSiteInformation(tenantid);
            console.log("Fetched site information:", data);
            setSiteTitle(data?.sitetitle || '')
            setSubSiteTitle(data?.sitesubtitle || '')
            setTrustedTagline(data?.trustedtagline || '')
            setSiteDescription(data?.sitedescription || '')
            if (data?.sitelogourl) {
                const logoUrl = typeof data.sitelogourl === 'object' ? data.sitelogourl.url : data.sitelogourl;
                setCurrentLogoUrl(logoUrl || '');
            }
        } catch (err: any) {
            showToast(err, "danger")
        }
    };

    // Update admin contact details function
    const updateAdminContactDetailsFn = async () => {
        if(!isAdminDetailsFromDb) { return showToast("Please enter Tenant ID first in Admin Details section and save it to navigate.", "warning") }
        if ((!validateEmail(contactemail)) || (!validatePhone(contactphone)) || (!validatePhone(alternatecontactphone))) {
            if (!validateEmail(contactemail) && contactemail !== "") {
                setErrorEmail("Enter a valid email address");
            } else {
                setErrorEmail("");
            }
            if (!validatePhone(contactphone) && contactphone !== "") {
                setErrorPhone("Enter a valid 10-digit phone number");
            } else {
                setErrorPhone("");
            }
            if (!validatePhone(alternatecontactphone) && alternatecontactphone !== "") {
                setErrorAlternatePhone("Enter a valid 10-digit phone number (Alternate Phone Number)");
            } else {
                setErrorAlternatePhone("");
            }
            return;
        }
        try {
            await updateAdminContactDetails({ tenantid, contactemail, contactphone, alternatecontactphone, address });
            showToast("Details saved!", "success")
            setIsAdminDetailsFromDb(true);
            showToast("Saved Successfully", "success");

            setErrorEmail("");
            setErrorPhone("");
            setErrorAlternatePhone("");

        } catch (error: any) {
            showToast(error, "danger")
        }
    };

    // Fetch admin contact details
    const fetchAdminContactDetails = async () => {
        try {
            const data = await getAdminContactDetails(tenantid);
            setContactEmail(data?.contactemail || '');
            setContactPhone(data?.contactphone || '');
            setAlternateContactPhone(data?.alternatecontactphone || '');
            setAddress(data?.address || '');
        } catch (err: any) {
            showToast(err.message, "danger");
        }
    }

    // Update social links details function
    const updateAdminSocialLinksFn = async () => {
        if(!isAdminDetailsFromDb) { return showToast("Please enter Tenant ID first in Admin Details section and save it to navigate.", "warning") }
        if ((instagramurl && !isValidUrl(instagramurl)) || (googlemapurl && !isValidUrl(googlemapurl)) || (justdialurl && !isValidUrl(justdialurl))) {
            if (instagramurl && !isValidUrl(instagramurl)) {
                setErrorInstagram("Enter a valid URL for Instagram");
            }
            if (googlemapurl && !isValidUrl(googlemapurl)) {
                setErrorGoogleMap("Enter a valid URL for Google Map");
            }
            if (justdialurl && !isValidUrl(justdialurl)) {
                setErrorJustDial("Enter a valid URL for Just Dial");
            }
            return;
        }
        try {
            await updateAdminSocialLinks({ tenantid, instagramurl, googlemapurl, justdialurl });
            showToast("Details saved!", "success")
            setIsAdminDetailsFromDb(true);
            setErrorInstagram("");
            setErrorGoogleMap("");
            setErrorJustDial("");
            showToast("Saved Successfully", "success");

        } catch (error: any) {
            showToast(error, "danger")
        }
    };

    // Fetch social links details
    const fetchAdminSocialLinks = async () => {
        try {
            const data = await getAdminSocialLinks(tenantid);
            setInstagramUrl(data?.instagramurl || '');
            setGoogleMapUrl(data?.googlemapurl || '');
            setJustDialUrl(data?.justdialurl || '');
        } catch (err: any) {
            showToast(err.message, "danger");
        }
    }

    // Update opening hours details function
    const updateOpeningHoursFn = async () => {
        if(!isAdminDetailsFromDb) { return showToast("Please enter Tenant ID first in Admin Details section and save it to navigate.", "warning") }

        try {
            const data = await updateOpeningHours({ tenantid, monday, tuesday, wednesday, thursday, friday, saturday, sunday });
            showToast("Details saved!", "success")
            setMonday(data?.monday || '')
            setTuesday(data?.tuesday || '');
            setWednesday(data?.wednesday || '');
            setThursday(data?.thursday || '');
            setFriday(data?.friday || '');
            setSaturday(data?.saturday || '');
            setSunday(data?.sunday || '');
            showToast("Saved Successfully", "success");

        } catch (error: any) {
            showToast(error, "danger")
        }
    };

    // Fetch opening hours details
    const fetchOpeningHours = async () => {
        try {
            const data = await getOpeningHours(tenantid);
            setMonday(data?.monday || '');
            setTuesday(data?.tuesday || '');
            setWednesday(data?.wednesday || '');
            setThursday(data?.thursday || '');
            setFriday(data?.friday || '');
            setSaturday(data?.saturday || '');
            setSunday(data?.sunday || '');
        } catch (err: any) {
            showToast(err.message, "danger");
        }
    }


    const validateEmail = (value: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const validatePhone = (value: string) => {
        const regex = /^[6-9][0-9]{9}$/; // Indian 10-digit numbers starting with 6–9
        return regex.test(value);
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '-100px 0px 0px 0px' }
        );

        const sections = document.querySelectorAll('.settings-card');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const handleNavClick = (sectionId: string) => {
        if(!tenantid) { return showToast("Please enter Tenant ID first in Admin Details section and save it to navigate.", "warning") }
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            const navHeight = 120; // Adjust based on your nav height
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const hasSpecialCharacter = (value: string) => {
        const regex = /[^a-zA-Z0-9]/;
        const isValid = regex.test(value);
        return !isValid;
    };

    return (
        <div className="settings-layout">
            {/* <!-- Left Nav --> */}
            <div className="settings-nav">
                <div className="settings-nav-header">Settings</div>
                <div className={`nav-item ${activeSection === 'adminSec' ? 'active' : ''}`} data-target="adminSec" onClick={() => handleNavClick('adminSec')}><span className="nav-item-icon">🔑</span> Admin Details</div>
                <div className={`nav-item ${activeSection === 'siteInfo' ? 'active' : ''}`} data-target="siteInfo" onClick={() => handleNavClick('siteInfo')}><span className="nav-item-icon">🏪</span> Site Info</div>
                <div className={`nav-item ${activeSection === 'contactSec' ? 'active' : ''}`} data-target="contactSec" onClick={() => handleNavClick('contactSec')}><span className="nav-item-icon">📞</span> Contact</div>
                <div className={`nav-item ${activeSection === 'socialSec' ? 'active' : ''}`} data-target="socialSec" onClick={() => handleNavClick('socialSec')}><span className="nav-item-icon">🔗</span> Social Links</div>
                <div className={`nav-item ${activeSection === 'hoursSec' ? 'active' : ''}`} data-target="hoursSec" onClick={() => handleNavClick('hoursSec')}><span className="nav-item-icon">🕐</span> Opening Hours</div>
            </div>

            {/* <!-- Right Content --> */}
            <div>
                {/* <!-- Admin Details --> */}
                <div className="settings-card" id="adminSec">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">🔑</div>
                        <div>
                            <div className="settings-card-title">Admin Details</div>
                            <div className="settings-card-desc">Your tenant ID and role configuration</div>
                        </div>
                    </div>
                    <div className="settings-card-body">
                        <div className="field-group">
                            <label className="field-label">Tenant ID <span className="required">*</span></label>
                            <input className="field-input" type="text" placeholder="No special characters" value={tenantid}
                                disabled={isAdminDetailsFromDb}
                                onChange={(e) =>
                                    hasSpecialCharacter(e.target.value) &&
                                    setTenantid(e.target.value)
                                } />
                            <span className="field-hint">⚠️ Special characters are not allowed. This is your unique shop identifier.</span>
                        </div>
                        <div className="field-group">
                            <label className="field-label">I am a</label>
                            <div className="role-options">
                                <div className="role-option selected">
                                    <div className="role-icon">🏪</div>
                                    <div className="role-name">Shop Owner</div>
                                    <div className="role-desc">Direct retail / wholesale</div>
                                </div>
                                <div className="role-option">
                                    <div className="role-icon">🤝</div>
                                    <div className="role-name">Broker</div>
                                    <div className="role-desc">Agent / intermediary</div>
                                </div>
                            </div>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Owner Name</label>
                            <input className="field-input" type="text" placeholder="Raj Kapoor" value={ownername} onChange={(e) => setOwnerName(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Owner Title</label>
                            <input className="field-input" type="text" placeholder="Proprietor" value={ownertitle} onChange={(e) => setOwnerTitle(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">About Owner</label>
                            <textarea className="field-input" placeholder="With over two decades of experience, we are a reliable partner for businesses across various sectors. Our commitment to quality, customer satisfaction, and sustainable practices has been the cornerstone of our success." value={aboutowner} onChange={(e) => setAboutOwner(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Years of Experience</label>
                            <input className="field-input" type="text" placeholder="Give your years of experience. Ex: 25+" value={yearsofexperience} onChange={(e) => setYearsOfExperience(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Products Sold</label>
                            <input className="field-input" type="text" placeholder="How many unique products did you sell?. Ex: 20000+" value={productssold} onChange={(e) => setProductsSold(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Happy Clients</label>
                            <input className="field-input" type="text" placeholder="How many satisfied customers do you have?. Ex: 2000+" value={happyclients} onChange={(e) => setHappyClients(e.target.value)} />
                        </div>
                    </div>
                    <div className="save-section">
                        <button className={tenantid ? "btn-primary" : "btn-secondary"} disabled={!tenantid} onClick={updateAdminDetailsFn}
                        >💾 Save Admin Details</button>
                    </div>
                </div>

                {/* <!-- Site Info --> */}
                <div className="settings-card" id="siteInfo">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">🏪</div>
                        <div>
                            <div className="settings-card-title">Site Information</div>
                            <div className="settings-card-desc">Public-facing shop details shown to customers</div>
                        </div>
                    </div>
                    <div className="settings-card-body">
                        <div className="field-group">
                            <label className="field-label">Site Title <span className="required">*</span></label>
                            <input className="field-input" type="text" placeholder="Raj Steel Shop" value={sitetitle} onChange={(e) => setSiteTitle(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Site Sub Title</label>
                            <input className="field-input" type="text" placeholder="Stainless Steel Shop" value={sitesubtitle} onChange={(e) => setSubSiteTitle(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Trusted Tagline</label>
                            <input className="field-input" type="text" placeholder="Trusted Wholesale Supplier · Bangalore" value={trustedtagline} onChange={(e) => setTrustedTagline(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Site Logo</label>
                            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                                <div className="upload-area-icon">{renderImage(sitelogourl || currentLogoUrl, true)}</div>
                                <p>Click to upload new logo</p>
                                <span>PNG, JPG, SVG · Recommended 200×200px</span>
                                <input ref={fileInputRef} className="hidden" type="file" id="logoInput" accept="image/*" onChange={(e) => setSitelogourl(e.target.files?.[0] || null)} />
                            </div>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Site Description</label>
                            <textarea className="field-input" rows={4} 
                            placeholder="Give a nice description, it will be displayed on the top section of your page."
                            value={sitedescription} onChange={(e) => setSiteDescription(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="save-section">
                        {/* <button className="btn-secondary">Reset</button> */}
                        <button className={isAdminDetailsFromDb ? "btn-primary" : "btn-secondary"} disabled={!isAdminDetailsFromDb} onClick={updateSiteInformationFn} >💾 Save Site Info</button>
                    </div>
                </div>

                {/* <!-- Contact --> */}
                <div className="settings-card" id="contactSec">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">📞</div>
                        <div>
                            <div className="settings-card-title">Contact Details</div>
                            <div className="settings-card-desc">Shown on your customer-facing portal</div>
                        </div>
                    </div>
                    <div className="mx-4 my-2">
                        {errorPhone && <p className="text-sm text-[indianred] my-0">❌{errorPhone}</p>}
                        {errorAlternatePhone && <p className="text-sm text-[indianred] my-0">❌{errorAlternatePhone}</p>}
                        {errorEmail && <p className="text-sm text-[indianred] my-0">❌{errorEmail}</p>}
                    </div>
                    <div className="settings-card-body">

                        <div className="field-row">
                            <div className="field-group">
                                <label className="field-label">Contact Email</label>
                                <input className="field-input" type="email" placeholder="your@email.com" onChange={(e) => setContactEmail(e.target.value)}
                                    value={contactemail} />
                            </div>
                            <div className="field-group">
                                <label className="field-label">Phone Number</label>
                                <input className="field-input" type="tel" placeholder="10-digit number" onChange={(e) => setContactPhone(e.target.value)}
                                    value={contactphone} />
                            </div>
                        </div>
                        <div className="field-row">
                            <div className="field-group">
                                <label className="field-label">Alternate Phone</label>
                                <input className="field-input" type="tel" placeholder="10-digit number" onChange={(e) => setAlternateContactPhone(e.target.value)}
                                    value={alternatecontactphone} />
                            </div>
                            <div className="field-group">
                                <label className="field-label">Address</label>
                                <input className="field-input" type="text" placeholder="Enter your address" onChange={(e) => setAddress(e.target.value)}
                                    value={address} />
                            </div>
                        </div>
                    </div>
                    <div className="save-section">
                        <button className={isAdminDetailsFromDb ? "btn-primary" : "btn-secondary"} disabled={!isAdminDetailsFromDb} onClick={updateAdminContactDetailsFn}>💾 Save Contact</button>
                    </div>
                </div>

                {/* <!-- Social Links --> */}
                <div className="settings-card" id="socialSec">
                        <div className="settings-card-header">
                            <div className="settings-card-icon">🔗</div>
                            <div>
                                <div className="settings-card-title">Social & Directory Links</div>
                                <div className="settings-card-desc">Links shown in your contact section</div>
                            </div>
                        </div>
                        <div className="mx-4 my-2">
                            {errorInstagram && <p className="text-sm text-[indianred] my-0">❌ {errorInstagram}</p>}
                            {errorGoogleMap && <p className="text-sm text-[indianred] my-0">❌ {errorGoogleMap}</p>}
                            {errorJustDial && <p className="text-sm text-[indianred] my-0">❌ {errorJustDial}</p>}
                        </div>
                        <div className="settings-card-body">
                            <div className="field-group">
                                <label className="field-label">📷 Instagram URL</label>
                                <input className="field-input" type="url" placeholder="https://instagram.com/..." value={instagramurl} onChange={(e) => setInstagramUrl(e.target.value)} />
                            </div>
                            <div className="field-group">
                                <label className="field-label">📍 Google Map URL</label>
                                <input className="field-input" type="url" placeholder="https://maps.google.com/..." value={googlemapurl} onChange={(e) => setGoogleMapUrl(e.target.value)} />
                            </div>
                            <div className="field-group">
                                <label className="field-label">📒 Just Dial URL</label>
                                <input className="field-input" type="url" placeholder="https://justdial.com/..." value={justdialurl} onChange={(e) => setJustDialUrl(e.target.value)} />
                            </div>
                        </div>
                        <div className="save-section">
                            <button className={isAdminDetailsFromDb ? "btn-primary" : "btn-secondary"} disabled={!isAdminDetailsFromDb} onClick={updateAdminSocialLinksFn}>💾 Save Links</button>
                        </div>
                    </div>

                    {/* <!-- Opening Hours --> */}
                    <div className="settings-card" id="hoursSec">
                        <div className="settings-card-header">
                            <div className="settings-card-icon">🕐</div>
                            <div>
                                <div className="settings-card-title">Available Hours</div>
                                <div className="settings-card-desc">Set your available hours per day</div>
                            </div>
                        </div>
                        <div className="settings-card-body">
                            <table className="hours-table">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Opening Hours</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="day-label">Monday</td>
                                        <td><input className="field-input" type="text" value={monday} onChange={(e) => setMonday(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <td className="day-label">Tuesday</td>
                                        <td><input className="field-input" type="text" value={tuesday} onChange={(e) => setTuesday(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <td className="day-label">Wednesday</td>
                                        <td><input className="field-input" type="text" value={wednesday} onChange={(e) => setWednesday(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <td className="day-label">Thursday</td>
                                        <td><input className="field-input" type="text" value={thursday} onChange={(e) => setThursday(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <td className="day-label">Friday</td>
                                        <td><input className="field-input" type="text" value={friday} onChange={(e) => setFriday(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <td className="day-label">Saturday</td>
                                        <td><input className="field-input" type="text" value={saturday} onChange={(e) => setSaturday(e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <td className="day-label">Sunday</td>
                                        <td><input className="field-input" type="text" value={sunday} onChange={(e) => setSunday(e.target.value)} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="save-section">
                            {/* <button className="btn-secondary">Reset to Default</button> */}
                            <button className={isAdminDetailsFromDb ? "btn-primary" : "btn-secondary"} disabled={!isAdminDetailsFromDb} onClick={updateOpeningHoursFn}>💾 Save All Settings</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}
