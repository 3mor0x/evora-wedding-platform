import { rtdb } from '../firebase';
import { ref, set, get, child } from 'firebase/database';

export const INITIAL_INVITATIONS = [
  {
    title: "دعوة زفاف تيسير وشهد",
    slug: "taisir-shahd-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://taisir-shahd-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة كتب كتاب محمود وسلمى",
    slug: "katb-ktab-mahmoud-salma",
    category: "katb_ktab",
    price: 300,
    oldPrice: 450,
    previewUrl: "https://katb-ktab-mahmoud-salma.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف طارق وهنا",
    slug: "tarek-hana-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://tarek-hana-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف سيف وفريدة",
    slug: "seif-farida-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://seif-farida-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف يوسف ونادين",
    slug: "youssef-nadine-story-wedding",
    category: "wedding",
    price: 400,
    oldPrice: 600,
    previewUrl: "https://youssef-nadine-story-wedding.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف مازن وريم",
    slug: "mazen-reem-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://mazen-reem-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف محمود وهالة",
    slug: "mahmoud-hala-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://mahmoud-hala-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف مهاب وآلاء",
    slug: "mohab-alaa-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://mohab-alaa-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف محمود ورولا",
    slug: "mahmoud-rola-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://mahmoud-rola-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "مراسم لوميير الفاخرة",
    slug: "lumiere-ceremony",
    category: "wedding",
    price: 450,
    oldPrice: 650,
    previewUrl: "https://lumiere-ceremony-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة خطوبة بلال وشيماء",
    slug: "belal-shimaa-engagement",
    category: "engagement",
    price: 250,
    oldPrice: 400,
    previewUrl: "https://belal-shimaa-engagement-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة ألفا كلاسيك",
    slug: "wedding-alpha-invitation",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://wedding-invitation-alpha-ten-61.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف عبدالرحمن ونورهان",
    slug: "abdelrahman-nourhan-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://abdelrahman-nourhan-wedding-invitat.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف رحيم وحبيبة",
    slug: "wedding-rahim-habiba",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://wedding-invitation-rahim-habiba.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة خطوبة حمدي وفاطمة",
    slug: "hamdy-fatma-engagement",
    category: "engagement",
    price: 250,
    oldPrice: 400,
    previewUrl: "https://hamdy-fatma-engagement-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة خطوبة محمود وشهد",
    slug: "mahmoud-shahd-engagement",
    category: "engagement",
    price: 250,
    oldPrice: 400,
    previewUrl: "https://mahmoud-shahd-engagement-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف محمد ونورهان",
    slug: "mohamed-nourhan-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://mohamed-nourhan-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1460364157752-926555421a7e?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف يوسف ونعمة",
    slug: "youssef-neama-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://youssef-neama-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة زفاف كريم وشهد",
    slug: "kareem-shahd-wedding",
    category: "wedding",
    price: 350,
    oldPrice: 500,
    previewUrl: "https://kareem-shahd-wedding-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1502635380703-cf585d26a65f?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  },
  {
    title: "دعوة خطوبة معاذ وريم",
    slug: "moaaz-reem-engagement",
    category: "engagement",
    price: 250,
    oldPrice: 400,
    previewUrl: "https://moaaz-reem-engagement-invitation.vercel.app/",
    thumbnail: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=85",
    isActive: true
  }
];

export async function seedInitialDatabaseIfEmpty() {
  const dbRef = ref(rtdb);
  const snapshot = await get(child(dbRef, 'invitations'));
  
  if (!snapshot.exists()) {
    const invitationsMap = {};
    INITIAL_INVITATIONS.forEach((inv, index) => {
      const id = `inv_${index + 1}`;
      invitationsMap[id] = {
        ...inv,
        createdAt: new Date().toISOString()
      };
    });

    await set(ref(rtdb, 'invitations'), invitationsMap);

    await set(ref(rtdb, 'settings'), {
      heroTitle: "دعوات زفاف رقمية بتفاصيل استثنائية",
      heroSubtitle: "بطاقات إلكترونية تفاعلية لمناسبتكم مع إمكانية المعاينة والحجز المباشر.",
      whatsappNumber: "201009694831",
      instagramUrl: "",
      tiktokUrl: ""
    });
  }
}