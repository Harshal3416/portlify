'use client';

import { useToast } from "@/app/context/ToastContext";
import { getOpeningHours } from "@/services/settingsService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OpeningHours() {
  const { showToast } = useToast();

  const searchParams = useSearchParams();
  const tenantidFromUrl = searchParams.get('tenantid');
  const tenantid = tenantidFromUrl; // Get tenantid: from URL params first, then from auth context, then fallback

  const [monday, setMondayTime] = useState('');
  const [tuesday, setTuesdayTime] = useState('');
  const [wednesday, setWednesdayTime] = useState('');
  const [thursday, setThursdayTime] = useState('');
  const [friday, setFridayTime] = useState('');
  const [saturday, setSaturdayTime] = useState('');
  const [sunday, setSundayTime] = useState('');
  const [today, setToday] = useState('monday')

  useEffect(() => {
    fetchData();

    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    setToday(dayName)
  }, []);

  const fetchData = async () => {
    if (!tenantid) return;
    try {
      const data = await getOpeningHours(tenantid);
      setMondayTime(data?.monday || '');
      setTuesdayTime(data?.tuesday || '');
      setWednesdayTime(data?.wednesday || '');
      setThursdayTime(data?.thursday || '');
      setFridayTime(data?.friday || '');
      setSaturdayTime(data?.saturday || '');
      setSundayTime(data?.sunday || '');
    } catch (err: any) {
      showToast(err.message, "danger");
    }
  }

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
      <div className="card">
      <div className="custom-card-header">
        <div className="card-title mb-0"><div className="card-title-icon">🕐</div>Opening Hours</div>
        {/* <span className="open-badge"><span className="open-dot"></span> Open Now</span> */}
      </div>
      <div className="card-body" >
        <div className="hour-row"><span className={`day-name ${today === 'Monday' ? 'today' : ''}`}>Monday {`${today === 'Monday' ? '← Today' : ''}`}</span><span className="day-time">{monday}</span></div>
        <div className="hour-row"><span className={`day-name ${today === 'Tuesday' ? 'today' : ''}`}>Tuesday {`${today === 'Tuesday' ? '← Today' : ''}`}</span><span className="day-time">{tuesday}</span></div>
        <div className="hour-row"><span className={`day-name ${today === 'Wednesday' ? 'today' : ''}`}>Wednesday {`${today === 'Wednesday' ? '← Today' : ''}`}</span><span className="day-time">{wednesday}</span></div>
        <div className="hour-row"><span className={`day-name ${today === 'Thursday' ? 'today' : ''}`}>Thursday {`${today === 'Thursday' ? '← Today' : ''}`}</span><span className="day-time">{thursday}</span></div>
        <div className="hour-row"><span className={`day-name ${today === 'Friday' ? 'today' : ''}`}>Friday {`${today === 'Friday' ? '← Today' : ''}`}</span><span className="day-time">{friday}</span></div>
        <div className="hour-row"><span className={`day-name ${today === 'Saturday' ? 'today' : ''}`}>Saturday {`${today === 'Saturday' ? '← Today' : ''}`}</span><span className="day-time">{saturday}</span></div>
        <div className="hour-row"><span className={`day-name ${today === 'Sunday' ? 'today' : ''}`}>Sunday {`${today === 'Sunday' ? '← Today' : ''}`}</span><span className="day-time">{sunday}</span></div>
      </div>
    </div>
);
}