'use client';

import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useSiteDetails } from "../../context/siteContext";

export default function OpeningHours() {

  const siteDetails = useSiteDetails();

  const [open, setOpen] = useState(false);

  const [monday, setMondayTime] = useState('');
  const [tuesday, setTuesdayTime] = useState('');
  const [wednesday, setWednesdayTime] = useState('');
  const [thursday, setThursdayTime] = useState('');
  const [friday, setFridayTime] = useState('');
  const [saturday, setSaturdayTime] = useState('');
  const [sunday, setSundayTime] = useState('');

  useEffect(() => {
    if (siteDetails) {
      setMondayTime(siteDetails?.monday || '');
      setTuesdayTime(siteDetails?.tuesday || '');
      setWednesdayTime(siteDetails?.wednesday || '');
      setThursdayTime(siteDetails?.thursday || '');
      setFridayTime(siteDetails?.friday || '');
      setSaturdayTime(siteDetails?.saturday || '');
      setSundayTime(siteDetails?.sunday || '');
    }
  }, [siteDetails]);

const openingHours = [
  { label: "Monday", value: monday },
  { label: "Tuesday", value: tuesday },
  { label: "Wednesday", value: wednesday },
  { label: "Thursday", value: thursday },
  { label: "Friday", value: friday },
  { label: "Saturday", value: saturday },
  { label: "Sunday", value: sunday },
];

const hasOpeningHours = openingHours.some(day => day.value);

if (!hasOpeningHours) return null;

return (
  <div className="w-[80%] mx-auto border border-gray-300 rounded-md my-4 overflow-hidden">
    
    {/* Header */}
    <div
      className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
      onClick={() => setOpen(!open)}
    >
      <span className="font-medium text-lg">Opening Hours</span>
      {open ? <FaArrowUp /> : <FaArrowDown />}
    </div>

    {/* Content */}
    {open && (
      <div className="border-t border-gray-200 p-4 grid gap-3 grid-cols-3 sm:grid-cols-3">
        
        {openingHours
          .filter(day => day.value)
          .map((day) => (
            <div
              key={day.label}
              className="flex justify-between text-sm md:text-base"
            >
              <span className="font-medium text-gray-700">
                {day.label}
              </span>
              <span className="text-gray-600">
                {day.value}
              </span>
            </div>
          ))}
      
      </div>
    )}
  </div>
);
}