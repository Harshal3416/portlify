'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useSiteDetails } from "@/app/context/siteContext";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { SiteDetail } from "@/app/interfaces/interface"

export default function Settings() {

    const router = useRouter();
    const { user, logout } = useAuth();
    const shopid = user?.shopid || '';

    const siteContextDetails = useSiteDetails();
    const settingsMutation = useSettings(shopid)
    const updateSettingsMutation = useUpdateSettings()

    const [localDetails, setLocalDetails] = useState<SiteDetail | null>(null)
    const [error, setError] = useState('')

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


    // Route protection - redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            router.push("/admin/login");
            return;
        }
    }, [user, router]);

    // Load initial details from context or mutation
    useEffect(() => {
        if (!shopid) return;

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
    }, [shopid, siteContextDetails]);

    const updateSettings = () => {

        if(((localDetails?.contactphone !== '' && !validatePhone(localDetails?.contactphone+'')) || 
        (localDetails?.alternatecontactphone !== '' && !validatePhone(localDetails?.alternatecontactphone+'')))) {
            return setError("Enter a valid Phone number")
        };

        if(localDetails?.contactemail !== '' && !validateEmail(localDetails?.contactemail || '')) {
            return setError("Enter a valid Email")
        };

        if ((localDetails?.instagramurl !== '' && !isValidUrl(localDetails?.instagramurl || '')) ||
            (localDetails?.googleurl !== '' && !isValidUrl(localDetails?.googleurl || '')) ||
            (localDetails?.justdialurl !== '' && !isValidUrl(localDetails?.justdialurl || ''))) {
            return setError("Enter valid URL")
        }

        const file = sitelogourl;
        console.log("FILE", file);
        const form = new FormData();

        // Add shopid to form data
        form.append('shopid', shopid);

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

    return (
        <div className="flex min-h-screen flex-col items-center justify-center w-[60%] mt-2 px-4 mx-auto">
            <h6 className="text-2xl mb-4">Site Settings</h6>
            <div className="flex flex-row ml-auto">
                <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
                    onClick={() => {
                        logout();
                        router.push("/admin/login");
                    }}
                >
                    Logout
                </button>
                <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-400 rounded-md hover:bg-gray-100"
                    onClick={() => {
                        router.push(`/store?shop=${shopid}`);
                    }}
                >
                    Customer Portal
                </button>
            </div>
            
            {/* Site Title */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Site Title<span className="text-red-700">*</span></label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="sitetitle"
                    type="text"
                    placeholder="Enter Site Title"
                    maxLength={50}
                    value={localDetails?.sitetitle ?? ''}
                    onChange={updateField('sitetitle' as keyof SiteDetail)}
                />
            </div>

            {/* Site Logo */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Site Logo</label>
                <div className="w-2/3">
                    <input
                        className="p-2 border border-gray-300 rounded-md w-full"
                        name="sitelogourl"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSitelogourl(e.target.files?.[0] || null)}
                    />
                    {renderLogoPreview()}
                </div>
            </div>

            {/* Owner Name */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Owner Name</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="ownername"
                    type="text"
                    placeholder="Enter Owner Name"
                    value={localDetails?.ownername ?? ''}
                    onChange={updateField('ownername' as keyof SiteDetail)}
                />
            </div>

            {/* Site Description */}
            <div className="flex flex-row items-start w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium pt-2">Site Description</label>
                <textarea
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="sitedescription"
                    placeholder="Enter Site Description"
                    value={localDetails?.sitedescription ?? ''}
                    onChange={updateField('sitedescription' as keyof SiteDetail)}
                />
            </div>

            {/* Contact Email */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Contact Email</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="contactemail"
                    type="email"
                    placeholder="Enter Contact Email"
                    value={localDetails?.contactemail ?? ''}
                    onChange={updateField('contactemail' as keyof SiteDetail)}
                />
            </div>

            {/* Phone Number */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Phone Number</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="contactphone"
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={localDetails?.contactphone ?? ''}
                    onChange={updateField('contactphone' as keyof SiteDetail)}
                />
            </div>

            {/* Alternate Phone */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Alternate Phone</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="alternatecontactphone"
                    type="tel"
                    placeholder="Enter Alternate Phone Number"
                    value={localDetails?.alternatecontactphone ?? ''}
                    onChange={updateField('alternatecontactphone' as keyof SiteDetail)}
                />
            </div>

            {/* Address */}
            <div className="flex flex-row items-start w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium pt-2">Address</label>
                <textarea
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="address"
                    placeholder="Enter Address"
                    maxLength={200}
                    value={localDetails?.address ?? ''}
                    onChange={updateField('address' as keyof SiteDetail)}
                />
            </div>

            {/* Social Links */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Instagram URL</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="instagramurl"
                    type="url"
                    placeholder="Enter Instagram URL"
                    value={localDetails?.instagramurl ?? ''}
                    onChange={updateField('instagramurl' as keyof SiteDetail)}
                />
            </div>

            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Google URL</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="googleurl"
                    type="url"
                    placeholder="Enter Google URL"
                    value={localDetails?.googleurl ?? ''}
                    onChange={updateField('googleurl' as keyof SiteDetail)}
                />
            </div>

            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Just Dial URL</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="justdialurl"
                    type="url"
                    placeholder="Enter Just Dial URL"
                    value={localDetails?.justdialurl ?? ''}
                    onChange={updateField('justdialurl' as keyof SiteDetail)}
                />
            </div>

            {/* Opening Hours */}
            <div className="flex flex-row items-start w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium pt-2">Opening Hours</label>
                <div className="w-2/3 space-y-2">
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Monday:</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={localDetails?.monday ?? ''}
                            onChange={updateField('monday' as keyof SiteDetail)}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Tuesday:</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={localDetails?.tuesday ?? ''}
                            onChange={updateField('tuesday' as keyof SiteDetail)}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Wednesday:</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={localDetails?.wednesday ?? ''}
                            onChange={updateField('wednesday' as keyof SiteDetail)}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Thursday:</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={localDetails?.thursday ?? ''}
                            onChange={updateField('thursday' as keyof SiteDetail)}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Friday:</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={localDetails?.friday ?? ''}
                            onChange={updateField('friday' as keyof SiteDetail)}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Saturday:</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={localDetails?.saturday ?? ''}
                            onChange={updateField('saturday' as keyof SiteDetail)}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Sunday:</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., Closed"
                            value={localDetails?.sunday ?? ''}
                            onChange={updateField('sunday' as keyof SiteDetail)}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <p className="text-red-600 mb-2 text-sm max-w-md text-center">
                    {error}
                </p>
            )}

            <button className="px-4 py-2 bg-black text-white rounded-md mt-3 disabled:opacity-30" onClick={updateSettings}
            disabled={!localDetails?.sitetitle}>
                Save Settings
            </button>
        </div>
    );
}
