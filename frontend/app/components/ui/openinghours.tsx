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
  const [today, setToday] = useState('monday')

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

    // const today = new Date();
    // const day = String(today.getDate()).padStart(2, '0'); // Pads with 0 if single digit
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    setToday(dayName)
    console.log("TODAY", dayName)

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
      <div className="card">
      <div className="custom-card-header">
        <div className="card-title"><div className="card-title-icon">🕐</div>Opening Hours</div>
        {/* <span className="open-badge"><span className="open-dot"></span> Open Now</span> */}
      </div>
      {/* style="padding:8px 24px 16px;" */}
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