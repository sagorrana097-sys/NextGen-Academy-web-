import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function DigitalClock({ className = '' }) {
  const { lang } = useLanguage();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date, language) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // '0' becomes '12'

    const pad = (n) => n.toString().padStart(2, '0');
    const formattedEn = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;

    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return formattedEn
        .replace(/[0-9]/g, (d) => bnDigits[Number(d)])
        .replace(/AM/gi, 'এএম')
        .replace(/PM/gi, 'পিএম');
    }

    return formattedEn;
  };

  const currentTime = formatTime(time, lang);

  return (
    <div
      className={`flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 sm:px-4 py-1.5 rounded-full shadow-inner select-none transition-all ${className}`}
      title={lang === 'bn' ? 'বর্তমান সময় (লাইভ ডিজিটাল ঘড়ি)' : 'Current Time (Live Digital Clock)'}
    >
      <Clock className="text-emerald-400 w-3.5 sm:w-4 h-3.5 sm:h-4 animate-pulse flex-shrink-0" />
      <span className="text-emerald-50 font-mono font-bold tracking-wider text-xs sm:text-sm">
        {currentTime}
      </span>
    </div>
  );
}
