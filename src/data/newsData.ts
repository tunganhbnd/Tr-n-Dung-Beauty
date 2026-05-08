export interface NewsArticle {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  isHtml?: boolean;
}

export const FALLBACK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "10 Bước Chăm Sóc Da Chuẩn Spa Trị Mụn",
    excerpt: "Bí quyết giúp bạn có làn da sạch mụn và khỏe mạnh từ bên trong với 10 bước đơn giản...",
    content: "Chi tiết 10 bước chăm sóc da chuẩn spa trị mụn...\n\n1. Làm sạch sâu...\n\n2. Tẩy tế bào chết...\n\n3. Xông hơi...\n\n4. Lấy nhân mụn chuẩn y khoa...\n\n5. Điện di tinh chất...\n\n6. Đắp mặt nạ...\n\n7. Chiếu ánh sáng sinh học...\n\n8. Massage bạch huyết...\n\n9. Thoa kem đặc trị...\n\n10. Chống nắng.",
    image: "https://images.unsplash.com/photo-1570172619644-641a5c689d14?auto=format&fit=crop&q=80&w=800",
    date: "12 Thg 10, 2023",
    category: "Skin Care",
    isHtml: false
  },
  {
    id: 2,
    title: "Xu Hướng Phun Xăm Điêu Khắc 2024",
    excerpt: "Cập nhật những mẫu chân mày điêu khắc tự nhiên và hot nhất dành cho năm 2024...",
    content: "Xu hướng phun xăm điêu khắc năm 2024 hướng tới vẻ đẹp tự nhiên, thanh tú...\n\nPhun mày tán bột siêu mịn...\n\nĐiêu khắc gảy sợi Hairstroke...\n\nPhun môi Collagen căng mọng...",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
    date: "05 Thg 11, 2023",
    category: "Permanent Makeup",
    isHtml: false
  },
  {
    id: 3,
    title: "Sự Thật Về Triệt Lông Vĩnh Viễn Bằng Laser",
    excerpt: "Giải đáp mọi thắc mắc của bạn về công nghệ triệt lông Diode Laser đang rất được ưa chuộng...",
    content: "Triệt lông vĩnh viễn bằng Laser có thực sự \"vĩnh viễn\"?\n\nCơ chế hoạt động của Laser Diode...\n\nNhững lưu ý quan trọng sau khi triệt lông...\n\nBao lâu thì lông mọc lại (nếu có)?",
    image: "https://images.unsplash.com/photo-1540555700373-f4edb393532e?auto=format&fit=crop&q=80&w=800",
    date: "20 Thg 12, 2023",
    category: "Hair Removal",
    isHtml: false
  }
];
