'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSiteDetails } from "@/app/context/siteContext";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { SiteDetail } from "@/app/interfaces/interface"
import { getAdminDetails, updateAdminDetails } from "@/services/settingsService";
import { useToast } from "@/app/context/ToastContext";

export default function Settings() {

    const router = useRouter();
    const { showToast } = useToast();

    const siteContextDetails = useSiteDetails();
    const updateSettingsMutation = useUpdateSettings()
    
    const [localDetails, setLocalDetails] = useState<SiteDetail | null>(null)
    const [error, setError] = useState('')
    
    const [tenantid, setTenantid] = useState('');
    const settingsMutation = useSettings(tenantid)
    const [tenantdomain, setTenantDomain] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [isAdminDetailsFromDb, setIsAdminDetailsFromDb] = useState(false)

    const updateField = (field: keyof SiteDetail) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log("setting value", field, e.target.value)
        setLocalDetails(prev => {
            if (!prev) {
                const newDetails: SiteDetail = {
                    sitetitle: '',
                    [field]: e.target.value
                } as SiteDetail;
                return newDetails;
            }
            return { ...prev, [field]: e.target.value };
        });
    };

    const [sitelogourl, setSitelogourl] = useState<File | null>(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");

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

    // Load initial details from context or mutation
    useEffect(() => {
        if (!tenantid) return;

        console.log("siteContextDetails", siteContextDetails)
        if (siteContextDetails) {
            setLocalDetails(siteContextDetails);
            // Update current logo from context
            if (siteContextDetails.sitelogourl) {
                const logoUrl = typeof siteContextDetails.sitelogourl === 'object' ? siteContextDetails.sitelogourl.url : siteContextDetails.sitelogourl;
                setCurrentLogoUrl(logoUrl || '');
            } else {
                setCurrentLogoUrl('');
            }
        }
        // Fallback to mutation
        settingsMutation.mutate(undefined, {
            onSuccess: (data: any) => {
                console.log("RECEIVED DATA FROM MUTATION-SETTING", data);
                if (data) {
                    setLocalDetails(data);
                    if (data.sitelogourl) {
                        const logoUrl = typeof data.sitelogourl === 'object' ? data.sitelogourl.url : data.sitelogourl;
                        setCurrentLogoUrl(logoUrl || '');
                    }
                }
            },
            onError: (err) => {
                console.log("MUTATION ERROR-SETTING", err)
            }
        });
    }, [tenantid, siteContextDetails]);

    const updateSettings = () => {

        if(((localDetails?.contactphone && localDetails?.contactphone !== '' && !validatePhone(localDetails?.contactphone+'')) || 
        (localDetails?.alternatecontactphone && localDetails?.alternatecontactphone !== '' && !validatePhone(localDetails?.alternatecontactphone+'')))) {
            return setError("Enter a valid Phone number")
        };

        if(localDetails?.contactemail && localDetails?.contactemail !== '' && !validateEmail(localDetails?.contactemail || '')) {
            return setError("Enter a valid Email")
        };

        if ((localDetails?.instagramurl && localDetails?.instagramurl !== '' && !isValidUrl(localDetails?.instagramurl || '')) ||
            (localDetails?.googleurl && localDetails?.googleurl !== '' && !isValidUrl(localDetails?.googleurl || '')) ||
            (localDetails?.justdialurl && localDetails?.justdialurl !== '' && !isValidUrl(localDetails?.justdialurl || ''))) {
            return setError("Enter valid URL")
        }

        const file = sitelogourl;
        console.log("FILE", file);
        const form = new FormData();

        // Add tenantid to form data
        form.append('tenantid', tenantid);

        form.append('sitetitle', localDetails?.sitetitle || '');
        form.append('ownername', localDetails?.ownername || '');
        form.append('sitedescription', localDetails?.sitedescription || '');
        form.append('contactemail', localDetails?.contactemail || '');
        form.append('contactphone', localDetails?.contactphone || '');
        form.append('alternatecontactphone', localDetails?.alternatecontactphone || '');
        form.append('address', localDetails?.address || '');
        form.append('instagramurl', localDetails?.instagramurl || '');
        form.append('googleurl', localDetails?.googleurl || '');
        form.append('justdialurl', localDetails?.justdialurl || '');

        // Append opening hours
        form.append('monday', localDetails?.monday ?? '');
        form.append('tuesday', localDetails?.tuesday ?? '');
        form.append('wednesday', localDetails?.wednesday ?? '');
        form.append('thursday', localDetails?.thursday ?? '');
        form.append('friday', localDetails?.friday ?? '');
        form.append('saturday', localDetails?.saturday ?? '');
        form.append('sunday', localDetails?.sunday ?? '');

        if (file && file instanceof File) {
            form.append('sitelogourl', file);
        }

        updateSettingsMutation.mutate(form, {
            onSuccess: (data) => {
                console.log('Settings updated:', data);
                const updatedDetails = data.data;
                if (updatedDetails) {
                    setLocalDetails(updatedDetails);
                    // Always update logo URL from response - even if no new file uploaded
                    if (updatedDetails.sitelogourl) {
                        const logoUrl = typeof updatedDetails.sitelogourl === 'object' ? updatedDetails.sitelogourl.url : updatedDetails.sitelogourl;
                        setCurrentLogoUrl(logoUrl || '');
                    }
                }
                setError('')
                alert("Settings saved!");
                setSitelogourl(null);
            },
            onError: (error) => {
                console.error('Error updating settings:', error);
                alert("Failed to save settings");
            }
        });
    }

    // Render logo preview
    const renderLogoPreview = () => {
        if (sitelogourl && sitelogourl instanceof File) {
            return (
                <div className="mt-2">
                    <p className="text-sm text-gray-600">New logo preview:</p>
                    <img
                        src={URL.createObjectURL(sitelogourl)}
                        alt="New logo preview"
                        className="w-32 h-32 object-contain rounded-md mt-1"
                    />
                </div>
            );
        }

        if (currentLogoUrl) {
            return (
                <div className="mt-2">
                    <p className="text-sm text-gray-600">Current logo:</p>
                    <img
                        src={"http://localhost:3000" + currentLogoUrl}
                        alt="Current logo"
                        className="w-32 h-32 object-contain rounded-md mt-1"
                    />
                </div>
            );
        }

        return null;
    };

    const updateAdminDetailsFn = async () => {
        try {
            await updateAdminDetails({ tenantid, tenantdomain });
            showToast("Details saved!", "success")
            setIsAdminDetailsFromDb(true);

        } catch (error: any) {
            showToast(error, "danger")
        }
    };
    useEffect(() => {
        fetchAdminDetails()
    }, [])

    async function fetchAdminDetails() {
        try {
            const data = await getAdminDetails();
            setTenantid(data.tenantid)
            setTenantDomain(data.tenantdomain)
            setIsAdminDetailsFromDb(true)
        } catch (err: any) {
            showToast(err.message, "danger");
        }
    }

    const hasSpecialCharacter = (value: string) => {
        const regex = /[^a-zA-Z0-9]/;
        const isValid = regex.test(value);
        console.log("Validity", isValid)
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
                            <input className="field-input" type="text" placeholder="No special characters" />
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
                    </div>
                    <div className="save-section">
                        <button className="btn-primary">💾 Save Admin Details</button>
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
                                <input className="field-input" type="text" />
                            </div>
                            <div className="field-group">
                                <label className="field-label">Owner Name</label>
                                <input className="field-input" type="text" />
                            </div>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Site Logo</label>
                            <div className="upload-zone" >
                                <div className="upload-zone-icon">🖼️</div>
                                <p>Click to upload new logo</p>
                                <span>PNG, JPG, SVG · Recommended 200×200px</span>
                                <input type="file" id="logoInput" accept="image/*" />
                            </div>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Site Description</label>
                            <textarea className="field-input" rows={4}></textarea>
                        </div>
                    </div>
                    <div className="save-section">
                        <button className="btn-secondary">Reset</button>
                        <button className="btn-primary">💾 Save Site Info</button>
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
                                <input className="field-input" type="email" placeholder="your@email.com" />
                            </div>
                            <div className="field-group">
                                <label className="field-label">Phone Number</label>
                                <input className="field-input" type="tel" placeholder="10-digit number" />
                            </div>
                        </div>
                        <div className="field-row">
                            <div className="field-group">
                                <label className="field-label">Alternate Phone</label>
                                <input className="field-input" type="tel" placeholder="Optional" />
                            </div>
                            <div className="field-group">
                                <label className="field-label">Address</label>
                                <input className="field-input" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="save-section">
                        <button className="btn-primary" >💾 Save Contact</button>
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
                            <input className="field-input" type="url" placeholder="https://instagram.com/..." />
                        </div>
                        <div className="field-group">
                            <label className="field-label">🔍 Google Business URL</label>
                            <input className="field-input" type="url" placeholder="https://maps.google.com/..." />
                        </div>
                        <div className="field-group">
                            <label className="field-label">📒 Just Dial URL</label>
                            <input className="field-input" type="url" placeholder="https://justdial.com/..." />
                        </div>
                    </div>
                    <div className="save-section">
                        <button className="btn-primary">💾 Save Links</button>
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
                                    <td><input className="field-input" type="text" /></td>
                                </tr>
                                <tr>
                                    <td className="day-label">Tuesday</td>
                                    <td><input className="field-input" type="text" /></td>
                                </tr>
                                <tr>
                                    <td className="day-label">Wednesday</td>
                                    <td><input className="field-input" type="text" /></td>
                                </tr>
                                <tr>
                                    <td className="day-label">Thursday</td>
                                    <td><input className="field-input" type="text" /></td>
                                </tr>
                                <tr>
                                    <td className="day-label">Friday</td>
                                    <td><input className="field-input" type="text" /></td>
                                </tr>
                                <tr>
                                    <td className="day-label">Saturday</td>
                                    <td><input className="field-input" type="text" /></td>
                                </tr>
                                <tr>
                                    <td className="day-label">Sunday</td>
                                    <td><input className="field-input" type="text" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="save-section">
                        <button className="btn-secondary">Reset to Default</button>
                        <button className="btn-primary">💾 Save All Settings</button>
                    </div>
                </div>

            </div>
        </div>
        // <>
        //     <div className="m-4 w-[80%] mx-auto">
        //         <header className="flex flex-col lg:flex-row justify-between items-start lg:items-start mb-8 gap-4">
        //             <div className="text-2xl">Site Settings</div>
        //             {isAdminDetailsFromDb &&
        //                 <div className="flex flex-row">

        //                     <button className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100" onClick={() => {
        //                         router.push("/admin/products");
        //                     }}>Products
        //                     </button>

        //                     <button className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
        //                         onClick={() => {
        //                             router.push(`/store?tenantid=${tenantid}`);
        //                         }}
        //                     >Customer Portal
        //                     </button>
        //                 </div>
        //             }
        //         </header>

        //         <div className="w-[60%] mx-auto">
        //             {/* Tenant details */}
        //             <div className="flex flex-col items-start w-full mb-4">
        //                 <label className="text-left pr-4 font-medium">Tenant ID:<span className="text-red-700">*</span><span className="text-sm text-muted"> (Special characters are not allowed)</span></label>
        //                 <input
        //                     className="p-2 border border-gray-300 rounded-md w-full"
        //                     name="tenantid"
        //                     type="text"
        //                     placeholder="Create Your Own Tenant ID"
        //                     maxLength={10}
        //                     value={tenantid}
        //                     onChange={(e) =>
        //                         hasSpecialCharacter(e.target.value) &&
        //                         setTenantid(e.target.value)
        //                     }
        //                 />
        //             </div>

        //             <div className="flex flex-col items-start w-full mb-4">
        //                 <label className="font-medium mb-2">
        //                     I am a <span className="text-red-700">*</span>
        //                     <span className="text-sm text-muted">
        //                         {" "}About Yourself. (example: Shop Owner, Broker)
        //                     </span>
        //                 </label>

        //                 {/* Option 1 */}
        //                 <div className="flex items-center gap-2 mb-2">
        //                     <input
        //                         type="radio"
        //                         name="tenantdomain"
        //                         value="Shop Owner"
        //                         checked={selectedOption === "Shop Owner"}
        //                         onChange={(e) => {
        //                             setSelectedOption(e.target.value);
        //                             setTenantDomain(e.target.value);
        //                         }}
        //                         className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        //                     />
        //                     <span>Shop Owner</span>
        //                 </div>

        //                 {/* Option 2 */}
        //                 <div className="flex items-center gap-2 mb-2">
        //                     <input
        //                         type="radio"
        //                         name="tenantdomain"
        //                         value="Broker"
        //                         checked={selectedOption === "Broker"}
        //                         onChange={(e) => {
        //                             setSelectedOption(e.target.value);
        //                             setTenantDomain(e.target.value);
        //                         }}
        //                         className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        //                     />
        //                     <span>Broker</span>
        //                 </div>

        //                 {/* Option 3: Custom input */}
        //                 <div className="flex items-center gap-2">
        //                     <input
        //                         type="text"
        //                         placeholder="Enter your own"
        //                         value={tenantdomain}
        //                         onFocus={() => {
        //                             setSelectedOption("Custom");
        //                             setTenantDomain(""); // clear when focusing
        //                         }}
        //                         onChange={(e) => setTenantDomain(e.target.value)}
        //                         className="p-2 border border-gray-300 rounded-md w-full text-sm"
        //                     />
        //                 </div>
        //             </div>

        //             {/* {!isAdminDetailsFromDb && */}
        //                 <div className="flex justify-center">
        //                     <button className="px-4 py-2 bg-black text-white rounded-md mt-3 disabled:opacity-30" onClick={updateAdminDetailsFn}
        //                         disabled={!tenantdomain || !tenantid}>
        //                         Save Admin Details
        //                     </button>
        //                 </div>
        //             {/* } */}


        //             {isAdminDetailsFromDb &&
        //                 <div>
        //                     <hr></hr>
        //                     {/* Site Title */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium">Site Title:<span className="text-red-700">*</span></label>
        //                         <input
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="sitetitle"
        //                             type="text"
        //                             placeholder="Enter Site Title"
        //                             maxLength={50}
        //                             value={localDetails?.sitetitle ?? ''}
        //                             onChange={updateField('sitetitle' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     {/* Site Logo */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium">Site Logo:</label>
        //                         <div className="w-full">
        //                             <input
        //                                 className="p-2 border border-gray-300 rounded-md w-full"
        //                                 name="sitelogourl"
        //                                 type="file"
        //                                 accept="image/*"
        //                                 onChange={(e) => setSitelogourl(e.target.files?.[0] || null)}
        //                             />
        //                             {renderLogoPreview()}
        //                         </div>
        //                     </div>

        //                     {/* Owner Name */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium">Owner Name:</label>
        //                         <input
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="ownername"
        //                             type="text"
        //                             placeholder="Enter Owner Name"
        //                             value={localDetails?.ownername ?? ''}
        //                             onChange={updateField('ownername' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     {/* Site Description */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium pt-2">Site Description:</label>
        //                         <textarea
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="sitedescription"
        //                             placeholder="Enter Site Description"
        //                             value={localDetails?.sitedescription ?? ''}
        //                             onChange={updateField('sitedescription' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     {/* Contact Email */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium">Contact Email:</label>
        //                         <input
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="contactemail"
        //                             type="email"
        //                             placeholder="Enter Contact Email"
        //                             value={localDetails?.contactemail ?? ''}
        //                             onChange={updateField('contactemail' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     {/* Phone Number */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium">Phone Number:</label>
        //                         <input
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="contactphone"
        //                             type="tel"
        //                             placeholder="Enter Phone Number"
        //                             value={localDetails?.contactphone ?? ''}
        //                             onChange={updateField('contactphone' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     {/* Alternate Phone */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium">Alternate Phone:</label>
        //                         <input
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="alternatecontactphone"
        //                             type="tel"
        //                             placeholder="Enter Alternate Phone Number"
        //                             value={localDetails?.alternatecontactphone ?? ''}
        //                             onChange={updateField('alternatecontactphone' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     {/* Address */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium pt-2">Address:</label>
        //                         <textarea
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="address"
        //                             placeholder="Enter Address"
        //                             maxLength={200}
        //                             value={localDetails?.address ?? ''}
        //                             onChange={updateField('address' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     {/* Social Links */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium">Instagram URL:</label>
        //                         <input
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="instagramurl"
        //                             type="url"
        //                             placeholder="Enter Instagram URL"
        //                             value={localDetails?.instagramurl ?? ''}
        //                             onChange={updateField('instagramurl' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium">Google URL:</label>
        //                         <input
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="googleurl"
        //                             type="url"
        //                             placeholder="Enter Google URL"
        //                             value={localDetails?.googleurl ?? ''}
        //                             onChange={updateField('googleurl' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left pr-4 font-medium">Just Dial URL:</label>
        //                         <input
        //                             className="p-2 border border-gray-300 rounded-md w-full"
        //                             name="justdialurl"
        //                             type="url"
        //                             placeholder="Enter Just Dial URL"
        //                             value={localDetails?.justdialurl ?? ''}
        //                             onChange={updateField('justdialurl' as keyof SiteDetail)}
        //                         />
        //                     </div>

        //                     {/* Opening Hours */}
        //                     <div className="flex flex-col items-start w-full mb-4">
        //                         <label className="text-left font-medium py-2">Opening Hours:</label>
        //                         <div className="w-full space-y-2">
        //                             <div className="flex items-start">
        //                                 <span className="w-24 text-sm font-medium">Monday:</span>
        //                                 <input
        //                                     className="p-2 border border-gray-300 rounded-md flex-1"
        //                                     type="text"
        //                                     placeholder="e.g., 9:00 AM - 6:00 PM"
        //                                     value={localDetails?.monday ?? ''}
        //                                     onChange={updateField('monday' as keyof SiteDetail)}
        //                                 />
        //                             </div>
        //                             <div className="flex items-start">
        //                                 <span className="w-24 text-sm font-medium">Tuesday:</span>
        //                                 <input
        //                                     className="p-2 border border-gray-300 rounded-md flex-1"
        //                                     type="text"
        //                                     placeholder="e.g., 9:00 AM - 6:00 PM"
        //                                     value={localDetails?.tuesday ?? ''}
        //                                     onChange={updateField('tuesday' as keyof SiteDetail)}
        //                                 />
        //                             </div>
        //                             <div className="flex items-start">
        //                                 <span className="w-24 text-sm font-medium">Wednesday:</span>
        //                                 <input
        //                                     className="p-2 border border-gray-300 rounded-md flex-1"
        //                                     type="text"
        //                                     placeholder="e.g., 9:00 AM - 6:00 PM"
        //                                     value={localDetails?.wednesday ?? ''}
        //                                     onChange={updateField('wednesday' as keyof SiteDetail)}
        //                                 />
        //                             </div>
        //                             <div className="flex items-start">
        //                                 <span className="w-24 text-sm font-medium">Thursday:</span>
        //                                 <input
        //                                     className="p-2 border border-gray-300 rounded-md flex-1"
        //                                     type="text"
        //                                     placeholder="e.g., 9:00 AM - 6:00 PM"
        //                                     value={localDetails?.thursday ?? ''}
        //                                     onChange={updateField('thursday' as keyof SiteDetail)}
        //                                 />
        //                             </div>
        //                             <div className="flex items-start">
        //                                 <span className="w-24 text-sm font-medium">Friday:</span>
        //                                 <input
        //                                     className="p-2 border border-gray-300 rounded-md flex-1"
        //                                     type="text"
        //                                     placeholder="e.g., 9:00 AM - 6:00 PM"
        //                                     value={localDetails?.friday ?? ''}
        //                                     onChange={updateField('friday' as keyof SiteDetail)}
        //                                 />
        //                             </div>
        //                             <div className="flex items-start">
        //                                 <span className="w-24 text-sm font-medium">Saturday:</span>
        //                                 <input
        //                                     className="p-2 border border-gray-300 rounded-md flex-1"
        //                                     type="text"
        //                                     placeholder="e.g., 9:00 AM - 6:00 PM"
        //                                     value={localDetails?.saturday ?? ''}
        //                                     onChange={updateField('saturday' as keyof SiteDetail)}
        //                                 />
        //                             </div>
        //                             <div className="flex items-start">
        //                                 <span className="w-24 text-sm font-medium">Sunday:</span>
        //                                 <input
        //                                     className="p-2 border border-gray-300 rounded-md flex-1"
        //                                     type="text"
        //                                     placeholder="e.g., Closed"
        //                                     value={localDetails?.sunday ?? ''}
        //                                     onChange={updateField('sunday' as keyof SiteDetail)}
        //                                 />
        //                             </div>
        //                         </div>
        //                     </div>

        //                     {error && (
        //                         <p className="text-red-600 mb-2 text-sm max-w-md text-left">
        //                             {error}
        //                         </p>
        //                     )}

        //                     <div className="flex justify-center">
        //                         <button className="px-4 py-2 bg-black text-white rounded-md mt-3 disabled:opacity-30" onClick={updateSettings}
        //                             disabled={!localDetails?.sitetitle || tenantid === ''}>
        //                             Save Settings
        //                         </button>
        //                     </div>
        //                 </div>
        //             }
        //         </div>
        //     </div>
        // </>
    );
}
