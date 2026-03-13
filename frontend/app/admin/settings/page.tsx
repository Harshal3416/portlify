'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { SiteDetail } from "@/app/lib/siteDetails";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";



export default function Settings() {

    const router = useRouter();
    const { user, logout } = useAuth();

    const settingsMutation = useSettings()
    const updateSettingsMutation = useUpdateSettings()

const [siteDetails, setSiteDetails] = useState<SiteDetail | null>(null)

    const updateField = (field: keyof SiteDetail) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log("setting value", field, e.target.value)
setSiteDetails(prev => {
      if (!prev) {
        const newDetails: SiteDetail = {
          sitetitle: '',
          [field]: e.target.value
        } as SiteDetail;
        return newDetails;
      }
      return { ...prev, [field]: e.target.value };
    });
        console.log(siteDetails)
    };

    const [sitelogourl, setSitelogourl] = useState<File | null>(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");

    const shopid = user?.shopid || '';

    // Route protection - redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            router.push("/admin/login");
            return;
        }
    }, [user, router]);

    useEffect(() => {
        console.log("SHOP ID IN SETTING PAGE", shopid)
        console.log("Local storage", localStorage.getItem('auth_user'))
        if (!shopid) return;

        settingsMutation.mutate(shopid,
            {
                onSuccess: (data: any) => {
                    console.log("RECEIVED DATA FROM MUTATION-SETTING", data, data?.data[0]);
                    const details = data?.data[0];
                    if (details) {
                      setSiteDetails(details);
                      // Set current logo
                      if (details.sitelogourl) {
                          if (typeof details.sitelogourl === 'object' && details.sitelogourl.url) {
                              setCurrentLogoUrl(details.sitelogourl.url);
                          } else if (typeof details.sitelogourl === 'string') {
                              setCurrentLogoUrl(details.sitelogourl);
                          }
                      }
                    }
                },
                onError: (err) => {
                    console.log("MUTATION ERROR-SETTING", err)
                }
            }
        )
    }, [shopid]);

    const updateSettings = () => {
        const file = sitelogourl;
        console.log("FILE", file);
        const form = new FormData();
        
        // Add shopid to form data
        form.append('shopid', shopid);
        
        form.append('sitetitle', siteDetails?.sitetitle || '');
        form.append('ownername', siteDetails?.ownername || '');
        form.append('sitedescription', siteDetails?.sitedescription || '');
        form.append('contactemail', siteDetails?.contactemail || '');
        form.append('contactphone', siteDetails?.contactphone || '');
        form.append('alternatecontactphone', siteDetails?.alternatecontactphone || '');
        form.append('address', siteDetails?.address || '');
        form.append('instagramurl', siteDetails?.instagramurl || '');
        form.append('googleurl', siteDetails?.googleurl || '');
        form.append('justdialurl', siteDetails?.justdialurl || '');
        
        // Append opening hours for each day
        form.append('monday', siteDetails?.monday ?? '');
        form.append('tuesday', siteDetails?.tuesday ?? '');
        form.append('wednesday', siteDetails?.wednesday ?? '');
        form.append('thursday', siteDetails?.thursday ?? '');
        form.append('friday', siteDetails?.friday ?? '');
        form.append('saturday', siteDetails?.saturday ?? '');
        form.append('sunday', siteDetails?.sunday ?? '');

        // Only append the logo file if a new file was selected
        if (file && file instanceof File) {
            form.append('sitelogourl', file);
        }

        updateSettingsMutation.mutate(form, {
            onSuccess: (data) => {
                console.log('Settings updated:', data);
                alert("Settings saved!");
                // Update the current logo if a new file was uploaded
                if (sitelogourl && data.data && data.data.sitelogourl) {
                    setCurrentLogoUrl(data.data[0]?.sitelogourl?.url || '');
                }
                // Clear the file input after successful save
                setSitelogourl(null);
            },
            onError: (error) => {
                console.error('Error updating settings:', error);
                alert("Failed to save settings");
            }
        });
    }

    // Render logo preview - shows current logo or newly selected file
    const renderLogoPreview = () => {
        // If a new file is selected, show preview of the new file
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

        // If there's an existing logo URL, show it
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
                <label className="w-1/3 text-right pr-4 font-medium">Site Title</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Site Title"
                    type="text"
                    placeholder="Enter Site Title"
                    maxLength={50}
value={siteDetails?.sitetitle ?? ''}
                    onChange={updateField('sitetitle')}
                />
            </div>

            {/* Site Logo URL */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Site Logo</label>
                <div className="w-2/3">
                    <input
                        className="p-2 border border-gray-300 rounded-md w-full"
                        name="Site Logo URL"
                        type="file"
                        placeholder="Enter Site Logo URL"
                        accept="image/*"
onChange={(e) => setSitelogourl(e.target.files?.[0] || null)}
                    />
                    {/* Logo Preview - shows current logo or newly selected file */}
                    {renderLogoPreview()}
                </div>
            </div>

            {/* Owner Name */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Owner Name</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Owner Name"
                    type="text"
                    placeholder="Enter Owner Name"
value={siteDetails?.ownername ?? ''}
                    onChange={updateField('ownername')}
                />
            </div>

            {/* Site Description */}
            <div className="flex flex-row items-start w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium pt-2">Site Description</label>
                <textarea
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Site Description"
                    placeholder="Enter Site Description"
value={siteDetails?.sitedescription ?? ''}
                    onChange={updateField('sitedescription')}
                />
            </div>

            {/* Contact Email */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Contact Email</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Contact Email"
                    type="email"
                    placeholder="Enter Contact Email"
value={siteDetails?.contactemail ?? ''}
                    onChange={updateField('contactemail')}
                />
            </div>

            {/* Phone Number */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Phone Number</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Phone Number"
                    type="tel"
                    placeholder="Enter Phone Number"
value={siteDetails?.contactphone ?? ''}
                    onChange={updateField('contactphone')}
                />
            </div>

            {/* Alternate Phone Number */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Alternate Phone</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Alternate Phone Number"
                    type="tel"
                    placeholder="Enter Alternate Phone Number"
value={siteDetails?.alternatecontactphone ?? ''}
                    onChange={updateField('alternatecontactphone')}
                />
            </div>

            {/* Address */}
            <div className="flex flex-row items-start w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium pt-2">Address</label>
                <textarea
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Address"
                    placeholder="Enter Address"
                    maxLength={200}
value={siteDetails?.address ?? ''}
                    onChange={updateField('address')}
                />
            </div>

            {/* Instagram URL */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Instagram URL</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Instagram URL"
                    type="url"
                    placeholder="Enter Instagram URL"
value={siteDetails?.instagramurl ?? ''}
                    onChange={updateField('instagramurl')}
                />
            </div>

            {/* Google URL */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Google URL</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Google URL"
                    type="url"
                    placeholder="Enter Google URL"
value={siteDetails?.googleurl ?? ''}
                    onChange={updateField('googleurl')}
                />
            </div>

            {/* Just Dial URL */}
            <div className="flex flex-row items-center w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium">Just Dial URL</label>
                <input
                    className="p-2 border border-gray-300 rounded-md w-2/3"
                    name="Just Dial URL"
                    type="url"
                    placeholder="Enter Just Dial URL"
value={siteDetails?.justdialurl ?? ''}
                    onChange={updateField('justdialurl')}
                />
            </div>

            {/* Opening Hours - Each Day */}
            <div className="flex flex-row items-start w-full mb-4">
                <label className="w-1/3 text-right pr-4 font-medium pt-2">Opening Hours</label>
                <div className="w-2/3 space-y-2">
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Monday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
value={siteDetails?.monday ?? ''}
                            onChange={updateField('monday')}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Tuesday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={siteDetails?.tuesday ?? ''}
                            onChange={updateField('tuesday')}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Wednesday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={siteDetails?.wednesday ?? ''}
                            onChange={updateField('wednesday')}
                        />
                    </div>
                    <div className="flex items-center">
        <span className="w-24 text-sm font-medium">Thursday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={siteDetails?.thursday ?? ''}
                            onChange={updateField('thursday')}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Friday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={siteDetails?.friday ?? ''}
                            onChange={updateField('friday')}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Saturday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., 9:00 AM - 6:00 PM"
                            value={siteDetails?.saturday ?? ''}
                            onChange={updateField('saturday')}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="w-24 text-sm font-medium">Sunday</span>
                        <input
                            className="p-2 border border-gray-300 rounded-md flex-1"
                            type="text"
                            placeholder="e.g., Closed"
                            value={siteDetails?.sunday ?? ''}
                            onChange={updateField('sunday')}
                        />
                    </div>
                </div>
            </div>

            <button className="px-4 py-2 bg-black text-white rounded-md mt-3" onClick={() => updateSettings()}>
                Save Settings
            </button>
        </div>
    );
}
