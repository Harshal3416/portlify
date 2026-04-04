'use client';

import { useEffect, useRef, useState } from "react";
import { getAdminContactDetails, getAdminDetails, getAdminSocialLinks, getOpeningHours, getSiteInformation, updateAdminContactDetails, updateAdminDetails, updateAdminSocialLinks, updateOpeningHours, updateSiteInformation } from "@/services/settingsService";
import { useToast } from "@/app/context/ToastContext";
import { renderImage } from "@/app/lib/renderImage";

export default function Settings() {

    const { showToast } = useToast();

    const [tenantid, setTenantid] = useState('');

    const [tenantdomain, setTenantDomain] = useState("Shop owner");

    // Admin details states
    const [shoptype, setShopType] = useState("");
    const [shortdescription, setShortDescription] = useState("");
    const [yearsofexperience, setYearsOfExperience] = useState("");
    const [productssold, setProductsSold] = useState("");
    const [happyclients, setHappyClients] = useState("");

    // Site Information states
    const [sitetitle, setSiteTitle] = useState("");
    const [sitelogourl, setSitelogourl] = useState<File | null>(null);
    const [ownername, setOwnerName] = useState("");
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

    const [isAdminDetailsFromDb, setIsAdminDetailsFromDb] = useState(false)
    
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");

    useEffect(() => {
        fetchAdminDetails()
        fetchSiteInformation()
        fetchAdminContactDetails()
        fetchAdminSocialLinks()
        fetchOpeningHours()
    }, [tenantid])

    // Admin details Update functions
    const updateAdminDetailsFn = async () => {
        try {
            await updateAdminDetails({ tenantid, tenantdomain, shoptype, shortdescription, yearsofexperience, productssold, happyclients });
            showToast("Details saved!", "success")
            setIsAdminDetailsFromDb(true);

        } catch (error: any) {
            showToast(error, "danger")
        }
    };

    // Fetch Admin details
    const fetchAdminDetails = async () => {
        try {
            const data = await getAdminDetails();
            setTenantid(data.tenantid)
            setTenantDomain(data.tenantdomain)
            setShopType(data.shoptype)
            setShortDescription(data.shortdescription)
            setYearsOfExperience(data.yearsofexperience)
            setProductsSold(data.productssold)
            setHappyClients(data.happyclients)
            setIsAdminDetailsFromDb(true)
        } catch (err: any) {
            showToast(err.message, "danger");
        }
    }

    // Site information update function
    const updateSiteInformationFn = async () => {
        try {
            await updateSiteInformation({ tenantid, sitetitle, sitelogourl, ownername, sitedescription });
            showToast("Details saved!", "success")
            setIsAdminDetailsFromDb(true);

        } catch (error: any) {
            showToast(error, "danger")
        }
    };

    // Fetch site Information
    const fetchSiteInformation = async () => {
        try {
            const data = await getSiteInformation(tenantid);
            setSiteTitle(data?.sitetitle || '')
            setOwnerName(data?.ownername || '')
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
        try {
            await updateAdminContactDetails({ tenantid, contactemail, contactphone, alternatecontactphone, address });
            showToast("Details saved!", "success")
            setIsAdminDetailsFromDb(true);

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
        try {
            await updateAdminSocialLinks({ tenantid, instagramurl, googlemapurl, justdialurl });
            showToast("Details saved!", "success")
            setIsAdminDetailsFromDb(true);

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

    function isValidUrl(url: string) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }


    const hasSpecialCharacter = (value: string) => {
        const regex = /[^a-zA-Z0-9]/;
        const isValid = regex.test(value);
        return !isValid;
    }

    return (
        <div className="settings-layout">
            {/* <!-- Left Nav --> */}
            <div className="settings-nav">
                <div className="settings-nav-header">Settings</div>
                <div className="nav-item active" ><span className="nav-item-icon">🔑</span> Admin Details</div>
                <div className="nav-item"><span className="nav-item-icon">🏪</span> Site Info</div>
                <div className="nav-item"><span className="nav-item-icon">📞</span> Contact</div>
                <div className="nav-item"><span className="nav-item-icon">🔗</span> Social Links</div>
                <div className="nav-item"><span className="nav-item-icon">🕐</span> Opening Hours</div>
            </div>

            {/* <!-- Right Content --> */}
            <div>

                {/* <!-- Admin Details --> */}
                <div className="settings-card">
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
                            <label className="field-label">I am a <span className="required">*</span></label>
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
                            <label className="field-label">Short Description</label>
                            <input className="field-input" type="text" placeholder="Give a short description" value={shortdescription} onChange={(e) => setShortDescription(e.target.value)} />
                            <span className="field-hint">Ex: Over two decades of supplying high-quality steel products to businesses and homes across Bangalore. Bulk pricing available.</span>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Years of Experience</label>
                            <input className="field-input" type="text" placeholder="Give your years of experience" value={yearsofexperience} onChange={(e) => setYearsOfExperience(e.target.value)} />
                            <span className="field-hint">Ex: 25+</span>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Products Sold</label>
                            <input className="field-input" type="text" placeholder="How many unique products did you sell?" value={productssold} onChange={(e) => setProductsSold(e.target.value)} />
                            <span className="field-hint">Ex: 20000+</span>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Happy Clients</label>
                            <input className="field-input" type="text" placeholder="How many satisfied customers do you have?" value={happyclients} onChange={(e) => setHappyClients(e.target.value)} />
                            <span className="field-hint">Ex: 2000+</span>
                        </div>
                    </div>
                    <div className="save-section">
                        <button className="btn-primary" onClick={updateAdminDetailsFn}
                        // disabled={!tenantdomain || !tenantid}
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
                        <div className="field-row">
                            <div className="field-group">
                                <label className="field-label">Site Title <span className="required">*</span></label>
                                <input className="field-input" type="text" value={sitetitle} onChange={(e) => setSiteTitle(e.target.value)} />
                            </div>
                            <div className="field-group">
                                <label className="field-label">Owner Name</label>
                                <input className="field-input" type="text" value={ownername} onChange={(e) => setOwnerName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Site Logo</label>
                            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                                <div className="upload-zone-icon">{renderImage(sitelogourl, true)}</div>
                                <p>Click to upload new logo</p>
                                <span>PNG, JPG, SVG · Recommended 200×200px</span>
                                <input ref={fileInputRef} className="hidden" type="file" id="logoInput" accept="image/*" onChange={(e) => setSitelogourl(e.target.files?.[0] || null)} />
                            </div>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Site Description</label>
                            <textarea className="field-input" rows={4} value={sitedescription} onChange={(e) => setSiteDescription(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="save-section">
                        <button className="btn-secondary">Reset</button>
                        <button className="btn-primary" onClick={updateSiteInformationFn} >💾 Save Site Info</button>
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
                                <input className="field-input" type="tel" placeholder="Optional" onChange={(e) => setAlternateContactPhone(e.target.value)}
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
                        <button className="btn-primary" onClick={updateAdminContactDetailsFn}>💾 Save Contact</button>
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
                    <div className="settings-card-body">
                        <div className="field-group">
                            <label className="field-label">📷 Instagram URL</label>
                            <input className="field-input" type="url" placeholder="https://instagram.com/..." value={instagramurl} onChange={(e) => setInstagramUrl(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">🔍 Google Map URL</label>
                            <input className="field-input" type="url" placeholder="https://maps.google.com/..." value={googlemapurl} onChange={(e) => setGoogleMapUrl(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label className="field-label">📒 Just Dial URL</label>
                            <input className="field-input" type="url" placeholder="https://justdial.com/..." value={justdialurl} onChange={(e) => setJustDialUrl(e.target.value)} />
                        </div>
                    </div>
                    <div className="save-section">
                        <button className="btn-primary" onClick={updateAdminSocialLinksFn}>💾 Save Links</button>
                    </div>
                </div>

                {/* <!-- Opening Hours --> */}
                <div className="settings-card" id="hoursSec">
                    <div className="settings-card-header">
                        <div className="settings-card-icon">🕐</div>
                        <div>
                            <div className="settings-card-title">Opening Hours</div>
                            <div className="settings-card-desc">Set your shop's operating hours per day</div>
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
                        <button className="btn-secondary">Reset to Default</button>
                        <button className="btn-primary" onClick={updateOpeningHoursFn}>💾 Save All Settings</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
