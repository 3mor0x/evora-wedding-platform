import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder, 
  getAllInvitations, 
  createInvitation, 
  updateInvitation, 
  deleteInvitation,
  getSiteSettings,
  updateSiteSettings
} from '../../services/db';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { 
  Package, 
  LayoutGrid, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Receipt, 
  FileImage, 
  X, 
  Phone, 
  Calendar, 
  MapPin,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'invitations' | 'settings'
  const [orders, setOrders] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // إعدادات المنصة والتواصل
  const [settings, setSettings] = useState({
    whatsapp: '01009694831',
    paymentNumber: '01018622861',
    depositAmount: 100,
    tiktok: '',
    instagram: '',
    facebook: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // مودال إضافة دعوة جديدة
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInv, setNewInv] = useState({
    title: '',
    category: 'wedding',
    price: '',
    oldPrice: '',
    previewUrl: '',
    thumbnail: ''
  });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [savingInv, setSavingInv] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('isAdminAuth');
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersData, invData, settingsData] = await Promise.all([
        getAllOrders(),
        getAllInvitations(),
        getSiteSettings()
      ]);
      setOrders(ordersData || []);
      setInvitations(invData || []);
      if (settingsData) {
        setSettings(prev => ({ ...prev, ...settingsData }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuth');
    navigate('/admin/login');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('حذف هذا الطلب نهائياً؟')) {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const handlePriceUpdate = async (invId, currentPrice) => {
    const newPrice = prompt('أدخل السعر الجديد بالجنيه:', currentPrice);
    if (newPrice && !isNaN(newPrice)) {
      await updateInvitation(invId, { price: Number(newPrice) });
      setInvitations(prev => prev.map(inv => inv.id === invId ? { ...inv, price: Number(newPrice) } : inv));
    }
  };

  const handleDeleteInvitation = async (invId) => {
    if (window.confirm('حذف هذا التصميم نهائياً؟')) {
      await deleteInvitation(invId);
      setInvitations(prev => prev.filter(inv => inv.id !== invId));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setNewInv(prev => ({ ...prev, thumbnail: url }));
    } catch (err) {
      alert('فشل رفع الصورة');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSaveInvitation = async (e) => {
    e.preventDefault();
    if (!newInv.title || !newInv.price || !newInv.previewUrl) return alert('أكمل البيانات المطلوبة');

    setSavingInv(true);
    try {
      const created = await createInvitation({
        ...newInv,
        price: Number(newInv.price),
        oldPrice: newInv.oldPrice ? Number(newInv.oldPrice) : null,
        thumbnail: newInv.thumbnail || 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
        isActive: true
      });
      setInvitations(prev => [created, ...prev]);
      setShowAddModal(false);
      setNewInv({ title: '', category: 'wedding', price: '', oldPrice: '', previewUrl: '', thumbnail: '' });
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSavingInv(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSiteSettings(settings);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2500);
    } catch (err) {
      alert('فشل حفظ الإعدادات');
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase().trim();
    return orders.filter(o => 
      (o.orderCode && o.orderCode.toLowerCase().includes(q)) ||
      (o.groomName && o.groomName.toLowerCase().includes(q)) ||
      (o.brideName && o.brideName.toLowerCase().includes(q)) ||
      (o.clientWhatsapp && o.clientWhatsapp.includes(q)) ||
      (o.invitationTitle && o.invitationTitle.toLowerCase().includes(q))
    );
  }, [orders, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            لوحة الإدارة والتحكم — إيفورا
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            متابعة الحجوزات الواردة، البحث بالكود، وإدارة وسائل التواصل والأسعار
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={loadDashboardData}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>الطلبات ({filteredOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invitations')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'invitations'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>التصاميم والأسعار ({invitations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>إعدادات السوشيال والدفع</span>
          </button>
        </div>

        {activeTab === 'invitations' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة تصميم جديد</span>
          </button>
        )}
      </div>

      {/* Main Tabs Area */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-[11px] text-slate-400 font-mono">جاري التحميل...</p>
        </div>
      ) : activeTab === 'orders' ? (
        /* Orders Tab */
        <div className="space-y-4">
          <div className="relative flex items-center rounded-xl border border-slate-200 bg-white p-1">
            <div className="pr-3 pl-2 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بكود العميل (ORD-83264) أو اسم العريس أو رقم الواتساب..."
              className="w-full bg-transparent py-2 px-2 text-xs focus:outline-hidden"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="rounded-xl p-10 text-center text-slate-400 text-xs border border-slate-200 bg-white">
              {searchQuery ? `لا توجد نتائج تطابق "${searchQuery}"` : 'لا توجد طلبات مسجلة حتى الآن.'}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-4 md:p-5 border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 w-full md:w-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {order.orderCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      order.status === 'READY'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      {order.status === 'READY' ? 'مكتمل ومسلّم' : 'قيد التنفيذ'}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900">
                    {order.groomName} & {order.brideName} —{' '}
                    <span className="text-xs font-normal text-slate-500">{order.invitationTitle}</span>
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{order.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{order.venueName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <a
                        href={`https://wa.me/2${order.clientWhatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-medium hover:underline text-emerald-700"
                      >
                        {order.clientWhatsapp}
                      </a>
                    </div>
                  </div>

                  {order.receiptUrl && (
                    <div className="pt-1">
                      <a
                        href={order.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>معاينة إيصال التحويل</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <select
                    value={order.status || 'NEW'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="rounded-lg px-2.5 py-1.5 text-xs border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden"
                  >
                    <option value="NEW">جديد</option>
                    <option value="IN_PROGRESS">قيد التنفيذ</option>
                    <option value="READY">جاهز ومسلّم</option>
                  </select>

                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="حذف الطلب"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'invitations' ? (
        /* Invitations Tab */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="rounded-xl p-3 border border-slate-200 bg-white flex flex-col justify-between gap-3 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <img
                  src={inv.thumbnail}
                  alt={inv.title}
                  className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-xs text-slate-900 truncate">{inv.title}</h4>
                  <div className="font-mono font-bold text-xs mt-1 text-slate-800">
                    {inv.price} ج.م
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => handlePriceUpdate(inv.id, inv.price)}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium hover:bg-slate-200 cursor-pointer"
                >
                  تعديل السعر
                </button>
                <div className="flex items-center gap-1">
                  <a
                    href={inv.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-slate-800"
                    title="معاينة"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => handleDeleteInvitation(inv.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Settings Tab (TikTok, Social, Payment) */
        <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-1">إعدادات وسائل التواصل والدفع</h2>
          <p className="text-xs text-slate-500 mb-6">
            أي رابط أو رقم تدخله هنا سيتغير تلقائياً في الفوتر وصفحة الطلب بدون تعديل أي كود.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">رقم الواتساب الرسمي</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="01009694831"
                  className="w-full rounded-lg px-3 py-2 text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">رقم تحويل العربون (إنستاباي / كاش)</label>
                <input
                  type="text"
                  value={settings.paymentNumber}
                  onChange={(e) => setSettings(prev => ({ ...prev, paymentNumber: e.target.value }))}
                  placeholder="01018622861"
                  className="w-full rounded-lg px-3 py-2 text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">رابط حساب تيك توك (TikTok URL)</label>
              <input
                type="url"
                value={settings.tiktok}
                onChange={(e) => setSettings(prev => ({ ...prev, tiktok: e.target.value }))}
                placeholder="https://tiktok.com/@evora_invitations"
                className="w-full rounded-lg px-3 py-2 text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">رابط حساب إنستجرام (Instagram URL)</label>
              <input
                type="url"
                value={settings.instagram}
                onChange={(e) => setSettings(prev => ({ ...prev, instagram: e.target.value }))}
                placeholder="https://instagram.com/evora_invitations"
                className="w-full rounded-lg px-3 py-2 text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">رابط صفحة فيسبوك (Facebook URL)</label>
              <input
                type="url"
                value={settings.facebook}
                onChange={(e) => setSettings(prev => ({ ...prev, facebook: e.target.value }))}
                placeholder="https://facebook.com/evora.invitations"
                className="w-full rounded-lg px-3 py-2 text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSettings ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
              </button>

              {settingsSuccess && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم حفظ الإعدادات بنجاح في قاعدة البيانات</span>
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Modal إضافة دعوة جديدة */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-sm w-full p-5 border border-slate-200 bg-white shadow-xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 mb-3">إضافة تصميم جديد</h3>
            <form onSubmit={handleSaveInvitation} className="space-y-3">
              <input
                type="text"
                required
                placeholder="اسم التصميم..."
                value={newInv.title}
                onChange={(e) => setNewInv(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg px-3 py-1.5 text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newInv.category}
                  onChange={(e) => setNewInv(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
                >
                  <option value="wedding">زفاف</option>
                  <option value="engagement">خطوبة</option>
                  <option value="katb_ktab">كتب كتاب</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="السعر..."
                  value={newInv.price}
                  onChange={(e) => setNewInv(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full rounded-lg px-3 py-1.5 text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
                />
              </div>
              <input
                type="url"
                required
                placeholder="رابط المعاينة (Vercel URL)..."
                value={newInv.previewUrl}
                onChange={(e) => setNewInv(prev => ({ ...prev, previewUrl: e.target.value }))}
                className="w-full rounded-lg px-3 py-1.5 text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-slate-500 file:ml-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-900 file:text-white file:text-xs cursor-pointer"
              />
              <button
                type="submit"
                disabled={savingInv || uploadingImg}
                className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold mt-2 cursor-pointer disabled:opacity-50"
              >
                {savingInv ? 'جاري الحفظ...' : 'حفظ التصميم ونشره'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}