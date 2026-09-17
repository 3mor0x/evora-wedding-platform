import React, { useState, useEffect } from 'react';
import { getAllInvitations } from '../../services/db';
import { INITIAL_INVITATIONS } from '../../services/seedData';
import InvitationCard from '../../components/public/InvitationCard';
import { QrCode, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const [invitations, setInvitations] = useState([]);
  const [filteredInvitations, setFilteredInvitations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const invData = await getAllInvitations();
        const sourceData = (invData && invData.length > 0)
          ? invData
          : INITIAL_INVITATIONS.map((inv, idx) => ({ id: `inv_${idx + 1}`, ...inv }));
        setInvitations(sourceData);
        setFilteredInvitations(sourceData);
      } catch (err) {
        const fallback = INITIAL_INVITATIONS.map((inv, idx) => ({ id: `inv_${idx + 1}`, ...inv }));
        setInvitations(fallback);
        setFilteredInvitations(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredInvitations(invitations);
    } else {
      setFilteredInvitations(invitations.filter(item => item.category === category));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* العنونة النظيفة الفخمة */}
      <section className="text-center py-8 max-w-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2.5">
          دعوات زفاف إلكترونية تفاعلية
        </h1>
        
        <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
          تصاميم رقمية خاصة تُرسل عبر واتساب بكامل تفاصيل الحفل، وموقع القاعة عبر Google Maps، مع تأكيد الحضور التلقائي.
        </p>

        {/* مميزات سريعة ومختصرة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-6 pt-6 border-t border-slate-200/70 text-xs text-slate-600">
          <div className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-lg border border-slate-200/70 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-slate-800" />
            <span>تسليم خلال 24 ساعة</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-lg border border-slate-200/70 shadow-xs">
            <QrCode className="w-3.5 h-3.5 text-slate-800" />
            <span>رمز QR مخصص</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-lg border border-slate-200/70 shadow-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-slate-800" />
            <span>تأكيد حضور الضيوف</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-lg border border-slate-200/70 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
            <span>رابط واستضافة دائمة</span>
          </div>
        </div>
      </section>

      {/* تصنيفات الفلترة */}
      <section className="flex items-center justify-center gap-1.5 flex-wrap my-8">
        {[
          { key: 'all', label: 'جميع النماذج' },
          { key: 'wedding', label: 'دعوات زفاف' },
          { key: 'engagement', label: 'دعوات خطوبة' },
          { key: 'katb_ktab', label: 'كتب كتاب' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => handleFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* شبكة الكروت */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-mono">جاري تحميل المعرض...</p>
        </div>
      ) : filteredInvitations.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          لا توجد نماذج متاحة حالياً في هذه الفئة.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredInvitations.map(invitation => (
            <InvitationCard key={invitation.id} invitation={invitation} />
          ))}
        </div>
      )}
    </div>
  );
}