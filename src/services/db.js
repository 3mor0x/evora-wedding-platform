import { rtdb } from '../firebase';
import { ref, get, set, push, update, remove, child } from 'firebase/database';

// ---------------- INVITATIONS ----------------

// جلب جميع الدعوات
export async function getAllInvitations() {
  const dbRef = ref(rtdb);
  const snapshot = await get(child(dbRef, 'invitations'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
  return [];
}

// إضافة تصميم دعوة جديد
export async function createInvitation(invitationData) {
  const invitationsRef = ref(rtdb, 'invitations');
  const newRef = push(invitationsRef);
  const payload = {
    ...invitationData,
    createdAt: new Date().toISOString()
  };
  await set(newRef, payload);
  return {
    id: newRef.key,
    ...payload
  };
}

// تعديل بيانات دعوة (السعر، العنوان، إلخ)
export async function updateInvitation(invitationId, updateData) {
  const invRef = ref(rtdb, `invitations/${invitationId}`);
  await update(invRef, updateData);
  return true;
}

// حذف دعوة نهائياً
export async function deleteInvitation(invitationId) {
  const invRef = ref(rtdb, `invitations/${invitationId}`);
  await remove(invRef);
  return true;
}

// ---------------- ORDERS ----------------

// جلب جميع طلبات الحجز
export async function getAllOrders() {
  const dbRef = ref(rtdb);
  const snapshot = await get(child(dbRef, 'orders'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    const ordersList = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
    // ترتيب تنازلي بالأحدث
    return ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return [];
}

// تسجيل طلب حجز جديد
export async function createOrder(orderData) {
  const ordersRef = ref(rtdb, 'orders');
  const newOrderRef = push(ordersRef);
  const orderCode = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  
  const payload = {
    ...orderData,
    orderCode,
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  await set(newOrderRef, payload);
  return {
    id: newOrderRef.key,
    ...payload
  };
}

// تحديث حالة الطلب
export async function updateOrderStatus(orderId, status) {
  const orderRef = ref(rtdb, `orders/${orderId}`);
  await update(orderRef, { status });
  return true;
}

// حذف طلب
export async function deleteOrder(orderId) {
  const orderRef = ref(rtdb, `orders/${orderId}`);
  await remove(orderRef);
  return true;
}

// ---------------- SETTINGS ----------------

// جلب إعدادات الموقع
export async function getSiteSettings() {
  const dbRef = ref(rtdb);
  const snapshot = await get(child(dbRef, 'settings'));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
}

// تحديث إعدادات الموقع
export async function updateSiteSettings(settingsData) {
  const settingsRef = ref(rtdb, 'settings');
  await update(settingsRef, settingsData);
  return true;
}