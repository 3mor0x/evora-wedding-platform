import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAllInvitations, createOrder, getSiteSettings } from '../../services/db';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { CheckCircle2, ArrowRight, Copy, Check, Receipt, Send, Lock, Image as ImageIcon } from 'lucide-react';

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedId = searchParams.get('invitationId');

  const [currentInvitation, setCurrentInvitation] = useState(null);
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    eventDate: '',
    eventTime: '',
    venueName: '',
    venueLocationUrl: '',
    clientWhatsapp: '',
    notes: '',
    paymentMethod: 'instapay'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    whatsapp: '01009694831',
    paymentNumber: '01018622861',
    depositAmount: 100
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [receiptFile, setReceiptFile] = useState(null);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const [invData, settingsData] = await Promise.all([
          getAllInvitations(),
          getSiteSettings()
        ]);

        if (preselectedId && invData) {
          const found = invData.find(item => String(item.id) === String(preselectedId));
          if (found) setCurrentInvitation(found);
        }

        if (settingsData) {
          setPaymentSettings(prev => ({ ...prev, ...settingsData }));
        }
      } catch (err) {
        console.error('Error fetching data on order page:', err);
      }
    }
    init();
  }, [preselectedId]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopyPaymentNumber = () => {
    navigator.clipboard.writeText(paymentSettings.paymentNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleCoupleImagesChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // رفع كل الصور بالتوازي الصريح
      const imagesUploadPromise = Promise.all(
        selectedFiles.map(file => uploadImageToCloudinary(file))
      );
      const receiptUploadPromise = receiptFile 
        ? uploadImageToCloudinary(receiptFile) 
        : Promise.resolve('');

      const [rawImageUrls, receiptUrl] = await Promise.all([
        imagesUploadPromise,
        receiptUploadPromise
      ]);

      // استبعاد أي رابط فارغ
      const validImages = rawImageUrls.filter(url => Boolean(url));

      const systemNote = currentInvitation 
        ? `[نمط التصميم المعتمد: نفس هوية وتنسيق ${currentInvitation.title}]` 
        : `[طلب تصميم خاص جديد بالكامل]`;

      const fullNotes = formData.notes 
        ? `${formData.notes}\n${systemNote}`
        : systemNote;

      const orderPayload = {
        ...formData,
        notes: fullNotes,
        systemTemplateNote: systemNote,
        invitationId: currentInvitation ? currentInvitation.id : 'custom_design',
        invitationTitle: currentInvitation ? currentInvitation.title : 'طلب تصميم مخصص بالكامل',
        price: currentInvitation ? currentInvitation.price : 450,
        images: validImages, // صور العروسين مصفوفة نظيفة
        receiptUrl: receiptUrl || ''
      };

      const newOrder = await createOrder(orderPayload);
      setSubmittedOrder(newOrder);

      // رسالة الواتساب الجاهزة
      const whatsappMsg = encodeURIComponent(
        `مرحباً إيفورا | Evora 💍\n\n` +
        `• كود الطلب: ${newOrder.orderCode}\n` +
        `• نوع الطلب: ${currentInvitation ? currentInvitation.title : 'تصميم مخصص خاص'}\n` +
        (currentInvitation ? `• ملاحظة النمط: نفس هوية وتنسيق (${currentInvitation.title})\n` : '') +
        `• العروسين: ${formData.groomName} و ${formData.brideName}\n` +
        `• التاريخ: ${formData.eventDate}\n` +
        `• المكان: ${formData.venueName}\n` +
        `• وسيلة تحويل العربون: ${formData.paymentMethod === 'instapay' ? 'إنستاباي' : 'فودافون كاش'}\n` +
        (receiptUrl ? `• تم إرفاق صورة إيصال التحويل بالطلب بنجاح ✅\n` : '') +
        (validImages.length > 0 ? `• تم إرفاق عدد (${validImages.length}) صورة للعروسين ✅\n\n` : '\n') +
        `أرغب في متابعة تأكيد الحجز معكم.`
      );

      window.open(`https://wa.me/2${paymentSettings.whatsapp}?text=${whatsappMsg}`, '_blank');
    } catch (err) {
      console.error('Submit order error:', err);
      alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900">تم تسجيل طلبكم بنجاح في إيفورا</h2>
        <p className="text-slate-500 text-sm mb-6">
          كود الطلب: <span className="font-mono font-bold text-slate-900 text-base">{submittedOrder.orderCode}</span>
        </p>
        <div className="p-5 rounded-xl mb-8 text-xs leading-relaxed border border-slate-200 bg-white text-slate-600">
          تم توجيهكم إلى محادثة الواتساب. سنراجع تفاصيل الحفل والصور المرفقة وإيصال التحويل ونبدأ التنفيذ فوراً.
        </div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
        >
          <span>العودة للرئيسية</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">
          {currentInvitation ? 'تأكيد حجز الدعوة' : 'تفاصيل حجز تصميم دعوة خاصة'}
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          {currentInvitation
            ? `أدخل بيانات الحفل ليتم تطبيقها على نموذج (${currentInvitation.title})`
            : 'املأ بيانات المناسبة وسنتولى تجهيز وبرمجة بوابة دعوتكم بالكامل.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`grid grid-cols-1 ${currentInvitation ? 'lg:grid-cols-12' : 'max-w-2xl mx-auto'} gap-8 items-start`}>
        {/* كارت المعاينة */}
        {currentInvitation && (
          <div className="lg:col-span-5 border border-slate-200 rounded-2xl p-4 shadow-xs sticky top-24 bg-white">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              النموذج المختار من المعرض:
            </span>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={currentInvitation.thumbnail}
                alt={currentInvitation.title}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">{currentInvitation.title}</h4>
                  <a
                    href={currentInvitation.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-600 hover:underline mt-0.5 inline-block"
                  >
                    معاينة حية للدعوة ↗
                  </a>
                </div>
                <div className="font-mono font-bold text-base text-slate-900">
                  {currentInvitation.price} <span className="text-xs font-normal text-slate-400">ج.م</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* الحقول والفورم */}
        <div className={`${currentInvitation ? 'lg:col-span-7' : 'w-full'} border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-5 bg-white`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-900">
              بيانات الحفل والمناسبة
            </span>
            <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
              {currentInvitation ? `النموذج: ${currentInvitation.title}` : 'طلب تصميم حر'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">اسم العريس</label>
              <input
                type="text"
                required
                name="groomName"
                value={formData.groomName}
                onChange={handleInputChange}
                placeholder="مثال: يوسف"
                className="w-full rounded-xl px-3.5 py-2 text-sm border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">اسم العروسة</label>
              <input
                type="text"
                required
                name="brideName"
                value={formData.brideName}
                onChange={handleInputChange}
                placeholder="مثال: نادين"
                className="w-full rounded-xl px-3.5 py-2 text-sm border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">تاريخ المناسبة</label>
              <input
                type="date"
                required
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className="w-full rounded-xl px-3.5 py-2 text-sm border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">توقيت الحفل</label>
              <input
                type="text"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleInputChange}
                placeholder="مثال: 8:00 مساءً"
                className="w-full rounded-xl px-3.5 py-2 text-sm border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">اسم القاعة أو الفندق</label>
              <input
                type="text"
                required
                name="venueName"
                value={formData.venueName}
                onChange={handleInputChange}
                placeholder="مثال: فندق فور سيزونز"
                className="w-full rounded-xl px-3.5 py-2 text-sm border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">رابط اللوكيشن (Google Maps)</label>
              <input
                type="url"
                name="venueLocationUrl"
                value={formData.venueLocationUrl}
                onChange={handleInputChange}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full rounded-xl px-3.5 py-2 text-sm border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">رقم الواتساب للتواصل معك</label>
            <input
              type="tel"
              required
              name="clientWhatsapp"
              value={formData.clientWhatsapp}
              onChange={handleInputChange}
              placeholder="01xxxxxxxxx"
              className="w-full rounded-xl px-3.5 py-2 text-sm border border-slate-200 bg-slate-50 focus:outline-hidden"
            />
          </div>

          {/* صندوق تحويل العربون */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-slate-700" />
                <span>تحويل عربون الحجز (اختياري / لتسريع البدء فوراً)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-700 font-semibold">
                عربون: {paymentSettings.depositAmount || 100} ج.م
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'instapay' }))}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                  formData.paymentMethod === 'instapay'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                InstaPay (إنستاباي)
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'vodafone_cash' }))}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                  formData.paymentMethod === 'vodafone_cash'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                فودافون كاش
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white mb-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">رقم التحويل المعتمد:</span>
                <span className="font-mono font-bold text-xs tracking-wider text-slate-900">{paymentSettings.paymentNumber}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyPaymentNumber}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors cursor-pointer"
              >
                {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNumber ? 'تم النسخ' : 'نسخ الرقم'}</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">رفع صورة إيصال التحويل (Screenshot)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceiptFile(e.target.files[0] || null)}
                className="w-full text-xs text-slate-500 file:ml-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-slate-200 file:text-slate-800 file:text-xs cursor-pointer"
              />
            </div>
          </div>

          {/* رفع صور المناسبة أو العروسين */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              صور المناسبة أو العروسين (يمكنك اختيار أكثر من صورة)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleCoupleImagesChange}
              className="w-full text-xs text-slate-500 file:ml-3 file:py-1.5 file:px-2.5 file:rounded file:border-0 file:bg-slate-200 file:text-slate-800 file:text-xs cursor-pointer"
            />
            {selectedFiles.length > 0 && (
              <p className="text-[11px] text-emerald-600 mt-1.5 font-medium flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>تم اختيار {selectedFiles.length} صورة وسيتم رفعهم مضغوطين فوراً</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">ملاحظات أو طلبات إضافية</label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="أي تفاصيل ترغب بإضافتها..."
              className="w-full rounded-xl px-3.5 py-2 text-sm border border-slate-200 bg-slate-50 focus:outline-hidden"
            />
          </div>

          {/* الملاحظة المثبتة غير القابلة للتعديل */}
          <div className="p-3 rounded-xl border border-slate-200/90 bg-slate-100/70 text-slate-600 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div className="leading-relaxed">
              <span className="font-semibold text-slate-800 block text-[11px] mb-0.5">
                ملاحظة النظام (مثبّتة تلقائياً):
              </span>
              {currentInvitation ? (
                <span>
                  سيتم تجهيز وبرمجة هذه الدعوة بنمط وهوية نموذج <strong>[{currentInvitation.title}]</strong> وفقاً لاختيارك.
                </span>
              ) : (
                <span>
                  سيتم تنفيذ هذه الدعوة كطلب <strong>[تصميم خاص جديد بالكامل]</strong> حسب رغبتكم وتنسيق البيانات المرفقة.
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-medium text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري الرفع الفوري وإرسال الطلب...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الطلب وتأكيد الحجز عبر واتساب</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}