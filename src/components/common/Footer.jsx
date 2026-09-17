import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { getSiteSettings } from '../../services/db';

export default function Footer() {
  const [settings, setSettings] = useState({
    whatsapp: '01009694831',
    tiktok: '',
    instagram: '',
    facebook: ''
  });

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load settings in footer:', err);
      }
    }
    loadFooterSettings();
  }, []);

  return (
    <>
      <footer className="bg-white text-slate-500 border-t border-slate-200/80 pt-10 pb-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right text-xs">
          <div>
            <p className="text-slate-900 font-bold text-sm mb-1">إيفورا | Evora</p>
            <p className="text-slate-500">دعوات وبوابات زفاف رقمية تفاعلية مصممة بعناية لأفخم الليالي.</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {settings.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors inline-flex items-center justify-center"
                title="تيك توك"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43V13a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.22V6.69z" />
                </svg>
              </a>
            )}

            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors inline-flex items-center justify-center"
                title="إنستجرام"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            )}

            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors inline-flex items-center justify-center"
                title="فيسبوك"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>جميع الحقوق محفوظة © 2026 لـ <strong className="text-slate-800">Othman Ventures</strong></span>
          </div>
        </div>
      </footer>

      {/* الزر العائم للواتساب */}
      <a
        href={`https://wa.me/2${settings.whatsapp || '01009694831'}?text=مرحباً،%20أريد%20الاستفسار%20عن%20خدمات%20دعوات%20إيفورا`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="واتساب"
        className="fixed bottom-6 left-6 z-50 p-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
      </a>
    </>
  );
}