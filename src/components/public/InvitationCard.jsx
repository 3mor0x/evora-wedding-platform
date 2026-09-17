import React, { useState } from 'react';
import { ExternalLink, ArrowUpLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InvitationCard({ invitation }) {
  const { id, title, price, oldPrice, thumbnail, previewUrl, category } = invitation;
  const [imgError, setImgError] = useState(false);

  const categoryLabels = {
    wedding: 'زفاف',
    engagement: 'خطوبة',
    katb_ktab: 'كتب كتاب'
  };

  const fallbackImg = "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800";

  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
      {/* الصورة والبادج */}
      <div className="relative aspect-[4/5] w-full bg-slate-100 overflow-hidden">
        <img
          src={imgError ? fallbackImg : (thumbnail || fallbackImg)}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
        />

        <span className="absolute top-3 right-3 bg-white/95 text-slate-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
          {categoryLabels[category] || 'دعوة'}
        </span>
      </div>

      {/* البيانات والأزرار */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-semibold text-slate-900 text-xs md:text-sm truncate">
          {title}
        </h3>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <div className="flex items-baseline gap-1">
            <span className="text-sm md:text-base font-bold text-slate-900 font-mono">
              {price}
            </span>
            <span className="text-[10px] text-slate-500">ج.م</span>
            {oldPrice && (
              <span className="text-[10px] text-slate-400 line-through font-mono mr-1">
                {oldPrice} ج.م
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              title="معاينة حية"
            >
              <ExternalLink className="w-3 h-3" />
            </a>

            <Link
              to={`/order?invitationId=${id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
            >
              <span>طلب</span>
              <ArrowUpLeft className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}