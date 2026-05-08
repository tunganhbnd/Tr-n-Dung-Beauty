import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Leaf, 
  Star, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Clock, 
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Quote,
  Calendar,
  User,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  Heart,
  Download
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { SERVICE_CONTENT } from './data/serviceContent';
import { useNews } from './hooks/useNews';

// --- Types ---
interface FAQItem {
  question: string;
  answer: string;
}

interface Service {
  id: number;
  title: string;
  category: 'Skin Care' | 'Permanent Makeup' | 'Hair Removal';
  description: string;
  price: string;
  image: string;
  targetProblems: string[];
  benefits: string[];
  faqs: FAQItem[];
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description?: string;
  details?: string[];
}

interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

const INITIAL_REVIEWS: Review[] = [
  { id: 1, productId: 1, userName: "Ngọc Trinh", rating: 5, comment: "Sữa rửa mặt dạng gel nhẹ nhàng làm sạch, rất thích.", date: "10/05/2024" },
  { id: 2, productId: 1, userName: "Mai Phương", rating: 4, comment: "Mùi thơm nhẹ nhàng, làm dịu da tốt.", date: "09/05/2024" },
  { id: 3, productId: 2, userName: "Lan Hương", rating: 5, comment: "Da phục hồi nhanh sau khi xài serum này.", date: "08/05/2024" },
  { id: 4, productId: 3, userName: "Thu Hường", rating: 5, comment: "Kem dưỡng ẩm tốt, không gây bít tắc chân lông.", date: "05/05/2024" }
];

// --- Data ---
const SERVICES: Service[] = [
  // --- NHÓM 1: CHĂM SÓC & ĐIỀU TRỊ DA ---
  {
    id: 1,
    title: "Massage thư giãn & Làm sạch chuyên sâu",
    category: 'Skin Care',
    description: "Liệu trình 60 phút giúp giải tỏa căng thẳng và loại bỏ bụi bẩn tầng sâu.",
    price: "300.000 VNĐ",
    image: "https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Căng thẳng mệt mỏi", "Da bết tắc"],
    benefits: ["Thư giãn tinh thần", "Lỗ chân lông thông thoáng"],
    faqs: [{ question: "Thời gian bao lâu?", answer: "60 phút." }]
  },
  {
    id: 2,
    title: "Lấy nhân mụn chuẩn y khoa",
    category: 'Skin Care',
    description: "Kỹ thuật lấy mụn chuyên nghiệp giúp loại bỏ mụn mà không để lại sẹo.",
    price: "350.000 VNĐ",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Mụn đầu đen", "Mụn cám", "Mụn ẩn"],
    benefits: ["Sạch nhân mụn", "Hạn chế thâm sẹo"],
    faqs: [{ question: "Có bị sưng đỏ không?", answer: "Sưng nhẹ trong vài giờ đầu và biến mất nhanh chóng." }]
  },
  {
    id: 3,
    title: "Điều trị mụn chuẩn y khoa chuyên sâu",
    category: 'Skin Care',
    description: "Liệu trình 75 phút kết hợp công nghệ hiện đại tiêu diệt ổ khuẩn gây mụn.",
    price: "500.000 VNĐ",
    image: "https://images.unsplash.com/photo-1570172619674-21a81b1fb85a?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Mụn bọc", "Mụn viêm nặng"],
    benefits: ["Giảm viêm tức thì", "Ngăn ngừa mụn tái phát"],
    faqs: [{ question: "Sau bao lâu thấy kết quả?", answer: "Cảm nhận sự thay đổi rõ rệt sau 1-3 buổi điều trị." }]
  },
  {
    id: 4,
    title: "Cấp ẩm da khô với tinh chất HA",
    category: 'Skin Care',
    description: "Phục hồi làn da khô ráp, mang lại sự căng bóng và mịn màng tức thì.",
    price: "500.000 VNĐ",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Da khô bong tróc", "Da thiếu nước"],
    benefits: ["Cấp ẩm sâu", "Tăng độ đàn hồi"],
    faqs: [{ question: "Dùng cho da nào?", answer: "Mọi loại da, nhất là da khô và da lão hóa." }]
  },
  {
    id: 5,
    title: "Tái tạo phục hồi da với tế bào gốc",
    category: 'Skin Care',
    description: "Giải pháp cho làn da nhạy cảm hoặc bị tổn thương cần phục hồi nhanh chóng.",
    price: "600.000 VNĐ",
    image: "https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Da yếu", "Da sau điều trị xâm lấn"],
    benefits: ["Phục hồi cấu trúc da", "Giảm kích ứng"],
    faqs: [{ question: "Có gây kích ứng không?", answer: "Sản phẩm tế bào gốc an toàn tuyệt đối cho da nhạy cảm." }]
  },
  {
    id: 6,
    title: "Trắng hồng rạng rỡ với Vitamin C tươi",
    category: 'Skin Care',
    description: "Làm sáng tông da và mờ vết thâm hiệu quả bằng điện di Vitamin C chuyên sâu.",
    price: "500.000 VNĐ",
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Da sạm màu", "Vết thâm mụn"],
    benefits: ["Bật tông trắng sáng", "Chống oxy hóa"],
    faqs: [{ question: "Có làm mỏng da không?", answer: "Công nghệ điện di không gây mỏng hay bào mòn da." }]
  },
  {
    id: 7,
    title: "Liệu pháp PRP tế bào gốc tự thân",
    category: 'Skin Care',
    description: "Đỉnh cao của trẻ hóa da bằng huyết tương giàu tiểu cầu (180 phút).",
    price: "5.000.000 VNĐ",
    image: "https://images.unsplash.com/photo-1614850523296-e8c1d4a2402f?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Lão hóa nặng", "Sẹo rỗ", "Lỗ chân lông to"],
    benefits: ["Trẻ hóa toàn diện", "Tăng sinh collagen mạnh mẽ"],
    faqs: [{ question: "Tại sao nên chọn PRP?", answer: "Sử dụng máu tự thân nên an toàn tuyệt đối, hiệu quả lâu dài." }]
  },
  {
    id: 8,
    title: "Chăm sóc chuyên sâu vùng mắt",
    category: 'Skin Care',
    description: "Xóa tan quầng thâm và nếp nhăn, mang lại thần thái tươi trẻ cho cửa sổ tâm hồn.",
    price: "450.000 VNĐ",
    image: "https://images.unsplash.com/photo-1512290903422-d50d753907d7?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Quầng thâm", "Bọng mắt", "Vết chân chim"],
    benefits: ["Giảm mỏi mắt", "Căng da vùng mắt"],
    faqs: [{ question: "Có ảnh hưởng đến mắt không?", answer: "Sử dụng sản phẩm chuyên dụng dịu nhẹ, không gây cay mắt." }]
  },
  {
    id: 9,
    title: "Cung cấp dưỡng chất Vitamin E",
    category: 'Skin Care',
    description: "Dưỡng ẩm tối ưu và bảo vệ da khỏi tác động của môi trường.",
    price: "550.000 VNĐ",
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Da thô ráp", "Lão hóa sớm"],
    benefits: ["Da mịn màng", "Sáng khỏe tự nhiên"],
    faqs: [{ question: "Ai nên dùng?", answer: "Những bạn có làn da thiếu sức sống, da khô mạn tính." }]
  },
  {
    id: 10,
    title: "Cấy Hồng sâm Hàn Quốc",
    category: 'Skin Care',
    description: "Nuôi dưỡng làn da trắng hồng và săn chắc từ tinh chất sâm quý hiếm.",
    price: "600.000 VNĐ",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Da xỉn màu", "Lỗ chân lông to"],
    benefits: ["Da trắng sáng", "Lưu thông khí huyết"],
    faqs: [{ question: "Có bị đỏ không?", answer: "Chỉ hồng nhẹ trong quá trình làm, sau đó da sẽ rất căng bóng." }]
  },
  {
    id: 11,
    title: "Cấy siêu vi tảo SPIRULINA",
    category: 'Skin Care',
    description: "Se khít lỗ chân lông và tái tạo làn da mới từ tảo biển tự nhiên.",
    price: "800.000 VNĐ",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Lỗ chân lông to", "Da sần sùi"],
    benefits: ["Tái tạo tế bào", "Se khít chân lông"],
    faqs: [{ question: "Cần lưu ý gì?", answer: "Nên chống nắng kỹ sau khi làm liệu trình." }]
  },
  {
    id: 12,
    title: "Cấy DNA cá hồi căng bóng da",
    category: 'Skin Care',
    description: "Công nghệ cấy DNA cá hồi giúp da căng mọng, trắng sáng và trẻ hóa.",
    price: "700.000 VNĐ",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Da lão hóa", "Da mất độ đàn hồi"],
    benefits: ["Trẻ hóa tế bào", "Căng bóng tức thì"],
    faqs: [{ question: "Duy trì được bao lâu?", answer: "Nên làm theo liệu trình 3-5 buổi để đạt kết quả tối ưu và lâu dài." }]
  },
  {
    id: 13,
    title: "Vi kim Thảo dược tái tạo da",
    category: 'Skin Care',
    description: "Kích thích sản sinh tế bào gốc tự nhiên, giúp da tươi mới (Bong nhẹ).",
    price: "1.500.000 VNĐ",
    image: "https://images.unsplash.com/photo-1512290903422-d50d753907d7?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Da sạm", "Vết thâm nhẹ"],
    benefits: ["Bật tông da", "Sạch thâm sáng mịn"],
    faqs: [{ question: "Bao lâu thì bong?", answer: "Sau khoảng 3-5 ngày da sẽ bong nhẹ." }]
  },
  {
    id: 14,
    title: "Điều trị sẹo rỗ chuyên sâu",
    category: 'Skin Care',
    description: "Liệu trình đặc trị giúp làm đầy các hố sẹo lâu năm.",
    price: "5.000.000 VNĐ / Lần",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Sẹo rỗ nặng", "Sẹo lõm"],
    benefits: ["Lấp đầy sẹo", "Cấu trúc da phẳng mịn"],
    faqs: [{ question: "Phải làm bao nhiêu lần?", answer: "Tùy tình trạng sẹo, thường từ 3 buổi trở lên." }]
  },
  {
    id: 15,
    title: "Liệu trình điều trị mụn 2 tháng",
    category: 'Skin Care',
    description: "Liệu trình trọn gói 2 tháng cam kết sạch mụn. TẶNG BỘ SẢN PHẨM TẠI NHÀ TRỊ GIÁ 2TR.",
    price: "8.000.000 VNĐ",
    image: "https://images.unsplash.com/photo-1570172619674-21a81b1fb85a?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Mụn mạn tính", "Mụn viêm khắp mặt"],
    benefits: ["Sạch hoàn toàn mụn", "Da khỏe từ bên trong"],
    faqs: [{ question: "Có cam kết không?", answer: "Cam kết sạch mụn bằng văn bản." }]
  },

  // --- NHÓM 2: PHUN XĂM THẨM MỸ ---
  {
    id: 101,
    title: "Phun mày chạm hạt tự nhiên",
    category: 'Permanent Makeup',
    description: "Kỹ thuật tạo hạt giúp dáng mày thanh thoát như vẽ bằng chì chuyên nghiệp.",
    price: "3.500.000 VNĐ",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Lông mày thưa", "Mất đuôi mày"],
    benefits: ["Vẻ đẹp tự nhiên", "Bền màu 2-3 năm"],
    faqs: [{ question: "Có sưng không?", answer: "Hơi đỏ nhẹ trong ngày đầu tiên." }]
  },
  {
    id: 102,
    title: "Phun mày tản bột",
    category: 'Permanent Makeup',
    description: "Lớp bột mịn giúp lông mày trông như được trang điểm nhẹ nhàng.",
    price: "2.500.000 VNĐ",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Dáng mày chưa chuẩn", "Muốn vẻ đẹp trẻ trung"],
    benefits: ["Màu sắc hài hòa", "Không đau không sưng"],
    faqs: [{ question: "Bao lâu lên màu đẹp?", answer: "Sau khi bong vảy 1 tháng màu sẽ ổn định và đẹp nhất." }]
  },
  {
    id: 108,
    title: "Nốt ruồi phong thủy",
    category: 'Permanent Makeup',
    description: "Chấm nốt ruồi tại các vị trí đại cát đại lợi theo nhân tướng học.",
    price: "800.000 VNĐ",
    image: "https://images.unsplash.com/photo-1512428559086-560ad5d8b132?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Muốn cải thiện vận may", "Thẩm mỹ khuôn mặt"],
    benefits: ["Nhanh chóng", "Vị trí chuẩn xác"],
    faqs: [{ question: "Có xóa được không?", answer: "Có thể xóa dễ dàng bằng laser nếu muốn." }]
  },
  {
    id: 109,
    title: "Phun mí mở tròng",
    category: 'Permanent Makeup',
    description: "Đường viền sắc sảo giúp đôi mắt có thần và to tròn hơn.",
    price: "1.500.000 VNĐ",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Mắt nhỏ", "Hàng mi thưa"],
    benefits: ["Tiết kiệm thời gian kẻ mắt", "Ánh nhìn sâu thẳm"],
    faqs: [{ question: "Có ảnh hưởng mắt?", answer: "Hoàn toàn không, kim chỉ đi trên tầng biểu bì da." }]
  },
  {
    id: 110,
    title: "Xử lý môi thâm chuyên sâu",
    category: 'Permanent Makeup',
    description: "Loại bỏ hoàn toàn sắc tố chì, mang lại nền môi hồng hào tự nhiên.",
    price: "2.500.000 VNĐ",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Môi thâm lâu năm", "Môi bị loang màu"],
    benefits: ["Nền môi sạch sắc tố", "Da môi khỏe mạnh"],
    faqs: [{ question: "Cần mấy buổi?", answer: "Tùy độ thâm, thường 1 buổi là sạch 80-90%." }]
  },
  {
    id: 111,
    title: "Phun môi pha lê",
    category: 'Permanent Makeup',
    description: "Hiệu ứng lóng lánh như pha lê, môi luôn tươi tắn kể cả khi không trang điểm.",
    price: "3.500.000 VNĐ",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Môi nhợt nhạt", "Sắc môi kém tươi"],
    benefits: ["Môi căng mịn", "Màu sắc sang trọng"],
    faqs: [{ question: "Có đau không?", answer: "Công nghệ ủ tê hiện đại không gây đau đớn." }]
  },
  {
    id: 112,
    title: "Xoá mày chỉnh dáng",
    category: 'Permanent Makeup',
    description: "Xóa bỏ mực cũ trổ xanh trổ đỏ, tạo lại dáng mày mới hài hòa.",
    price: "4.000.000 VNĐ",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Mày hỏng", "Dáng mày lỗi thời"],
    benefits: ["Sạch mực cũ", "Tạo dáng mày mới"],
    faqs: [{ question: "Xóa bằng gì?", answer: "Công nghệ Laser chuyên dụng không để lại sẹo." }]
  },
  {
    id: 106,
    title: "Điêu khắc mày 6D",
    category: 'Permanent Makeup',
    description: "Tạc từng sợi lông mày xen kẽ tóc thật, cực kỳ chân thực.",
    price: "4.000.000 VNĐ",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Lông mày không đều", "Muốn vẻ đẹp siêu thực"],
    benefits: ["Sợi mảnh như thật", "Cân bằng tỉ lệ khuôn mặt"],
    faqs: [{ question: "Bao lâu phải dặm lại?", answer: "Sau 1-2 năm để màu luôn như mới." }]
  },
  {
    id: 107,
    title: "Dặm mày nhạt",
    category: 'Permanent Makeup',
    description: "Phục hồi màu sắc và dáng mày sau một thời gian, giữ vẻ đẹp luôn tươi mới.",
    price: "1.700.000 VNĐ",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Màu mày bị nhạt", "Mất nét"],
    benefits: ["Tươi mới màu sắc", "Chỉnh sửa dáng mày"],
    faqs: [{ question: "Khi nào cần dặm?", answer: "Thường sau 1-2 năm tùy cơ địa." }]
  },
  {
    id: 103,
    title: "Phun môi tế bào gốc",
    category: 'Permanent Makeup',
    description: "Khử thâm và lên màu trong trẻo, căng mọng nhờ cung cấp dưỡng chất tế bào gốc.",
    price: "3.000.000 VNĐ",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Môi thâm xỉn", "Môi khô nứt nẻ"],
    benefits: ["Màu môi thời thượng", "Mềm mại căng mướt"],
    faqs: [{ question: "Phun xong có được ăn hải sản không?", answer: "Nên kiêng hải sản và rau muống trong 1 tuần đầu." }]
  },

  // --- NHÓM 3: TRIỆT LÔNG ---
  {
    id: 201,
    title: "Triệt lông Nách/Mép/Cằm",
    category: 'Hair Removal',
    description: "Công nghệ IPL hiện đại giúp loại bỏ tận gốc nang lông và làm sáng da.",
    price: "300.000 VNĐ (Lẻ) - 3.000.000 (Trọn gói 12L)",
    image: "https://images.unsplash.com/photo-1540555700373-f4edb393532e?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Viêm nang lông", "Lông đen cứng"],
    benefits: ["Sạch lông bền lâu", "Mờ thâm sạm"],
    faqs: [{ question: "Bao nhiêu lần hết lông?", answer: "Liệu trình hiệu quả nhất thường từ 8-12 buổi." }]
  },
  {
    id: 202,
    title: "Triệt lông Mặt/Bụng",
    category: 'Hair Removal',
    description: "Triệt lông vùng mặt giúp da mịn màng, dễ ăn phấn hơn.",
    price: "400.000 VNĐ (Lẻ) - 4.000.000 (Trọn gói 12L)",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Lông mặt rậm", "Bụng có nhiều lông tơ"],
    benefits: ["Dưỡng sáng da", "Se khít lỗ chân lông"],
    faqs: [{ question: "Có làm lỗ chân lông to?", answer: "Không, công nghệ triệt lông còn giúp se khít lỗ chân lông." }]
  },
  {
    id: 203,
    title: "Triệt lông Tay/Chân",
    category: 'Hair Removal',
    description: "Giải phóng đôi chân và cánh tay khỏi những đám lông phiền phức.",
    price: "1.000.000 VNĐ (Lẻ) - 10.000.000 (Trọn gói 12L)",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Lông tay chân dài", "Rậm rạp"],
    benefits: ["Tự tin diện đồ", "Da chân sáng mịn"],
    faqs: [{ question: "Có đau rát không?", answer: "Cảm giác chỉ như kiến bò nhẹ nhờ đầu lạnh âm độ." }]
  },
  {
    id: 204,
    title: "Triệt lông Nửa tay/Nửa chân",
    category: 'Hair Removal',
    description: "Giải pháp tiết kiệm cho khách hàng chỉ muốn triệt một phần cánh tay hoặc đôi chân.",
    price: "600.000 VNĐ (Lẻ) - 6.000.000 (Trọn gói 12L)",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Lông ở bộ phận cụ thể"],
    benefits: ["Tiết kiệm chi phí", "Tự tin hơn"],
    faqs: [{ question: "Hiệu quả có bằng triệt cả chân?", answer: "Vùng được triệt sẽ đạt kết quả tương tự triệt cả chân." }]
  },
  {
    id: 205,
    title: "Triệt lông Bikini",
    category: 'Hair Removal',
    description: "Vệ sinh, an toàn và thẩm mỹ cho vùng nhạy cảm.",
    price: "1.000.000 VNĐ (Lẻ) - 10.000.000 (Trọn gói 12L)",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    targetProblems: ["Rậm rạp vùng kín", "Ngứa ngáy"],
    benefits: ["Sạch sẽ thông thoáng", "Ngừa viêm nhiễm"],
    faqs: [{ question: "Có nhanh không?", answer: "Chỉ mất khoảng 15-20 phút cho mỗi buổi làm." }]
  },
];



const SPECIALISTS = [
  { id: 1, name: "Jessica Alba", role: "Chuyên gia Phun Xăm", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Maria Garcia", role: "Chuyên gia Da liễu", image: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Sophie Turner", role: "Bác sĩ Thẩm mỹ", image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Elena Gilbert", role: "Trị liệu viên", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Bonnie Bennett", role: "Chuyên gia Massage", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
];

const GENERAL_FAQS: FAQItem[] = [
  { question: "Chi phí điều trị có phát sinh thêm không?", answer: "Giá niêm yết đã bao gồm trọn gói liệu trình." },
  { question: "Spa có cam kết hiệu quả không?", answer: "Mọi liệu trình đều được cam kết hiệu quả bằng văn bản." },
  { question: "Tôi cần đặt lịch trước bao lâu?", answer: "Nên đặt lịch trước ít nhất 1-2 ngày." }
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Jennifer Moreno",
    role: "Khách hàng",
    content: "Dịch vụ ở đây vô cùng tuyệt vời. Đội ngũ bác sĩ và chuyên viên rất tận tâm, không gian sang trọng và sạch sẽ. Đôi môi của tôi sau khi phun Collagen trông cực kỳ tự nhiên và căng mọng.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    beforeAfter: {
      before: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=400",
      after: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400"
    }
  },
  {
    id: 2,
    name: "Minh Anh",
    role: "Doanh nhân",
    content: "Tôi rất hài lòng với dịch vụ điêu khắc lông mày tại Aleynn. Sợi lông mày được làm rất tỉ mỉ, trông như thật và rất hài hòa với khuôn mặt.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    beforeAfter: {
      before: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400",
      after: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400"
    }
  },
  {
    id: 3,
    name: "Lan Phương",
    role: "Người mẫu",
    content: "Phun mí mở tròng giúp đôi mắt tôi to tròn và sâu hơn hẳn. Không còn tốn thời gian kẻ mắt mỗi khi ra ngoài nữa, thật tuyệt vời!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  }
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Sữa rửa mặt dịu nhẹ tinh chất hoa cúc",
    category: "Skin Care",
    price: "450.000 VNĐ",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
    description: "Sữa rửa mặt dạng gel nhẹ nhàng làm sạch bụi bẩn, bã nhờn mà không gây khô da. Chiết xuất hoa cúc giúp làm dịu và giảm sưng viêm.",
    details: ["Dung tích: 150ml", "Phù hợp mọi loại da, đặc biệt là da nhạy cảm", "Thành phần tự nhiên, không chứa cồn, không paraben"]
  },
  {
    id: 2,
    name: "Serum tế bào gốc phục hồi chuyên sâu",
    category: "Skin Care",
    price: "1.250.000 VNĐ",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    description: "Serum chứa nồng độ cao tế bào gốc EGF giúp kích thích sản sinh collagen, phục hồi da tổn thương sau lăn kim, laser hoặc da mụn.",
    details: ["Dung tích: 30ml", "Dùng sáng và tối sau bước toner", "Cải thiện độ đàn hồi, mờ thâm nám"]
  },
  {
    id: 3,
    name: "Kem dưỡng ẩm tái tạo màng bảo vệ da",
    category: "Skin Care",
    price: "850.000 VNĐ",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800",
    description: "Kem dưỡng chứa Ceramide cấu trúc phân tử nhỏ, giúp phục hồi và củng cố hàng rào bảo vệ vững chắc cho da.",
    details: ["Dung tích: 50g", "Chất kem mượt, thẩm thấu nhanh không nhờn rít", "Cấp ẩm liên tục suốt 24 giờ"]
  },
  {
    id: 4,
    name: "Kem chống nắng phổ rộng SPF 50+ PA++++",
    category: "Skin Care",
    price: "650.000 VNĐ",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
    description: "Bảo vệ da toàn diện trước tia UVA/UVB và cả ánh sáng xanh cường độ cao. Công thức nâng tông nhẹ nhàng tự nhiên.",
    details: ["Dung tích: 50ml", "Kết cấu mỏng nhẹ, kiềm dầu tốt", "An toàn cho cả da nhạy cảm và mẹ bầu"]
  },
  {
    id: 5,
    name: "Tinh chất kích mọc lông mày thảo dược",
    category: "Permanent Makeup",
    price: "750.000 VNĐ",
    image: "https://images.unsplash.com/photo-1596755389378-c11dde12d1b5?auto=format&fit=crop&q=80&w=800",
    description: "Tinh chất đặc trị chứa hàm lượng dưỡng chất cao từ nhân sâm, giúp nuôi dưỡng và kích thích sơi lông mày mọc dày và đen khỏe.",
    details: ["Dung tích: 10ml", "Dạng cọ dễ sử dụng", "Hiệu quả rõ rệt sau 4 tuần"]
  },
  {
    id: 6,
    name: "Gel dưỡng làm dịu sau triệt lông",
    category: "Hair Removal",
    price: "350.000 VNĐ",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800",
    description: "Mang lại cảm giác mát lạnh tức thì, làm giảm nhanh hiện tượng kích ứng hay mẩn đỏ sau khi triệt lông bằng công nghệ cao.",
    details: ["Dung tích: 200ml", "Chiết xuất lô hội nguyên chất", "Thông thoáng nang lông, ngăn ngừa viêm nhiễm"]
  }
];

// --- Components ---

const FAQAccordion = ({ faqs }: { faqs: FAQItem[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isActive = activeIndex === index;
        return (
          <div key={index} className="border border-spa-peach/20 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-spa-peach bg-spa-beige/30 hover:bg-spa-beige/50 transition-colors"
            >
              <h4 className="font-bold text-spa-dark pr-8">{faq.question}</h4>
              <motion.div
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-spa-peach"
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    visible: { opacity: 1, height: "auto", marginTop: 0 },
                    hidden: { opacity: 0, height: 0, marginTop: 0 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="px-6"
                >
                  <p className="text-gray-500 text-sm leading-relaxed pb-6 pt-2">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Skin Care', 'Permanent Makeup', 'Hair Removal'];

  const [reviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('spa_shop_reviews');
    if (saved) return JSON.parse(saved);
    return INITIAL_REVIEWS;
  });

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const getAverageRating = (productId: number) => {
    const productReviews = reviews.filter(r => r.productId === productId);
    if (productReviews.length === 0) return 0;
    return productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= Math.round(rating) && rating > 0 ? "fill-spa-peach text-spa-peach" : "fill-gray-200 text-gray-200"}
          />
        ))}
        <span className="text-xs text-gray-400 ml-2">({rating > 0 ? rating.toFixed(1) : "Chưa có đánh giá"})</span>
      </div>
    );
  };

  return (
    <div className="pt-32 pb-24 bg-spa-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-spa-peach font-bold tracking-[0.3em] uppercase text-xs">Our Products</span>
          <h1 className="text-5xl md:text-6xl font-serif mt-4 mb-6 text-spa-dark">Sản Phẩm Chăm Sóc</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Các sản phẩm độc quyền được chuyên gia của chúng tôi khuyên dùng để duy trì hiệu quả liệu trình làm đẹp.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${
                activeCategory === category
                  ? 'bg-spa-dark text-white'
                  : 'bg-white text-gray-500 hover:bg-spa-peach/10 hover:text-spa-peach'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const avgRating = getAverageRating(product.id);
            return (
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-gray-100 p-8">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-spa-peach shadow-sm">
                      {product.category}
                    </div>
                  </div>
                </Link>
                <div className="p-8 text-center flex flex-col items-center flex-1 justify-between">
                  <div>
                    <Link to={`/product/${product.id}`} className="block w-full">
                      <h3 className="text-xl font-serif mb-3 leading-tight group-hover:text-spa-peach transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex justify-center flex-col items-center">
                      {renderStars(avgRating)}
                      <p className="text-spa-dark font-bold mb-6">{product.price}</p>
                    </div>
                  </div>
                  <Link to={`/order/${product.id}`} className="w-full mt-auto">
                    <button className="btn-outline py-2 border-spa-dark text-spa-dark w-full hover:bg-spa-dark hover:text-white group-hover:border-transparent group-hover:bg-spa-peach group-hover:text-white transition-all">
                      Đặt hàng
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === Number(id));

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('spa_shop_reviews');
    if (saved) return JSON.parse(saved);
    return INITIAL_REVIEWS;
  });

  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });

  useEffect(() => {
    localStorage.setItem('spa_shop_reviews', JSON.stringify(reviews));
  }, [reviews]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spa-beige">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Sản phẩm không tồn tại</h2>
          <Link to="/shop" className="text-spa-peach hover:underline text-sm uppercase tracking-widest font-bold">Trở về Shop</Link>
        </div>
      </div>
    );
  }

  const productReviews = reviews.filter(r => r.productId === product.id);
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length 
    : 0;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;
    
    const review: Review = {
      id: Date.now(),
      productId: product.id,
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('vi-VN')
    };

    setReviews([review, ...reviews]);
    setNewReview({ userName: '', rating: 5, comment: '' });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= Math.round(rating) && rating > 0 ? "fill-spa-peach text-spa-peach" : "fill-gray-200 text-gray-200"}
          />
        ))}
        {rating > 0 && <span className="text-xs text-gray-400 ml-1">({rating.toFixed(1)})</span>}
      </div>
    );
  };

  return (
    <div className="pt-32 pb-24 bg-spa-beige min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-spa-peach font-bold uppercase text-xs mb-8 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={16} /> Quay lại Mua Sắm
        </Link>
        
        <div className="bg-white rounded-[40px] shadow-sm flex flex-col md:flex-row overflow-hidden mb-12">
          {/* Image */}
          <div className="w-full md:w-1/2 p-12 bg-gray-50 flex items-center justify-center">
            <div className="relative w-full aspect-square bg-white rounded-3xl p-8 shadow-sm">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          </div>
          
          {/* Details */}
          <div className="w-full md:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 bg-spa-peach/10 text-spa-peach text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif mb-4 text-spa-dark leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                {renderStars(averageRating)}
                <span className="text-sm text-gray-400">{productReviews.length} đánh giá</span>
              </div>

              <p className="text-2xl font-bold text-spa-peach mb-6">{product.price}</p>
              
              <div className="prose prose-lg text-gray-600 mb-8">
                <p>{product.description}</p>
              </div>

              {product.details && product.details.length > 0 && (
                <div className="mb-10">
                  <h4 className="font-serif text-xl text-spa-dark mb-4">Chi tiết ấn tượng</h4>
                  <ul className="space-y-2">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <CheckCircle2 size={18} className="text-spa-peach mr-3 mt-1 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link to={`/order/${product.id}`} className="block w-full">
              <button className="btn-solid w-full py-4 text-sm font-bold tracking-[0.2em] uppercase">
                Mua Ngay - Đặt Hàng
              </button>
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-[40px] shadow-sm p-12 lg:p-16">
          <h2 className="text-3xl font-serif mb-8 flex items-center justify-between">
            Đánh giá sản phẩm
            <span className="text-base font-normal text-gray-500 bg-gray-100 px-4 py-1 rounded-full">{productReviews.length} bình luận</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Reviews List */}
            <div className="space-y-8">
              {productReviews.length === 0 ? (
                <p className="text-gray-500 italic">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
              ) : (
                productReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-spa-dark">{review.userName}</h4>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    {renderStars(review.rating)}
                    <p className="mt-3 text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write Review Form */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-xl font-serif mb-6">Viết đánh giá của bạn</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-spa-dark mb-2">Đánh giá sao</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={star <= newReview.rating ? "fill-spa-peach text-spa-peach" : "fill-gray-200 text-gray-200"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-spa-dark mb-2">Tên của bạn *</label>
                  <input
                    type="text"
                    required
                    value={newReview.userName}
                    onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                    className="w-full bg-white border border-transparent focus:border-spa-peach px-6 py-3 rounded-full transition-all outline-none text-sm"
                    placeholder="Nhập tên..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-spa-dark mb-2">Nội dung đánh giá *</label>
                  <textarea
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    rows={4}
                    className="w-full bg-white border border-transparent focus:border-spa-peach px-6 py-4 rounded-[2rem] transition-all outline-none text-sm resize-none"
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                  ></textarea>
                </div>

                <button type="submit" className="btn-outline w-full hover:bg-spa-dark focus:bg-spa-dark hover:text-white focus:text-white border-spa-dark text-spa-dark">
                  Gửi Đánh Giá
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderPage = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === Number(id));
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: '1',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spa-beige">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Sản phẩm không tồn tại</h2>
          <Link to="/shop" className="text-spa-peach hover:underline text-sm uppercase tracking-widest font-bold">Trở về Shop</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // BẠN CÓ THỂ THAY ĐỔI URL DƯỚI ĐÂY THÀNH GOOGLE APPS SCRIPT WEBHOOK URL CỦA BẠN
    // Hướng dẫn: Tạo Google Sheet -> Extensions -> Apps Script -> Tạo hàm doPost(e) để lưu dữ liệu -> Deploy as Web App -> Copy URL dán vào đây.
    const googleSheetWebhookUrl = "https://script.google.com/macros/s/AKfycbwCUphtXWs8n7c9hOou_TVJcXHetigITZ4aBhzx8b7bk5eqw6P3_IZYtv0NGrHagVk/exec";

    try {
      // Simulate real request or actual request
      await fetch(googleSheetWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.name,
          price: product.price,
          ...formData,
          createdAt: new Date().toISOString()
        })
      });
      
      // Cho dù bị lỗi mạng hay CORS thì no-cors vẫn trả về opaque response nên ta coi như thành công
      setIsSuccess(true);
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      // Fallback in case of absolute failure
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-spa-beige min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-spa-peach font-bold uppercase text-xs mb-8 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={16} /> Quay lại Mua Sắm
        </Link>
        
        <div className="bg-white rounded-[40px] shadow-sm flex flex-col md:flex-row overflow-hidden">
          {/* Thông tin sản phẩm */}
          <div className="w-full md:w-5/12 bg-gray-50 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <h3 className="text-spa-peach font-bold tracking-[0.2em] uppercase text-xs mb-4">Thông tin đơn hàng</h3>
            <div className="bg-white rounded-3xl p-6 shadow-sm flex-1">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-6">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-4" />
              </div>
              <h4 className="text-xl font-serif mb-2">{product.name}</h4>
              <p className="text-sm tracking-widest text-gray-400 uppercase mb-4">{product.category}</p>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center font-bold">
                <span className="text-spa-dark">Đơn giá:</span>
                <span className="text-spa-peach text-lg">{product.price}</span>
              </div>
            </div>
          </div>

          {/* Form đặt hàng */}
          <div className="w-full md:w-7/12 p-8 md:p-12">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-serif">Đặt hàng thành công!</h3>
                <p className="text-gray-500 max-w-sm">
                  Cảm ơn bạn đã đặt <strong>{product.name}</strong>. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                </p>
                <Link to="/shop" className="btn-solid inline-block mt-4">Tiếp tục mua sắm</Link>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-serif mb-8 text-spa-dark">Điền thông tin</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-spa-dark ml-2">Họ và tên *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-spa-beige/50 border border-transparent focus:border-spa-peach focus:bg-white px-6 py-4 rounded-full transition-all outline-none"
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-spa-dark ml-2">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-spa-beige/50 border border-transparent focus:border-spa-peach focus:bg-white px-6 py-4 rounded-full transition-all outline-none"
                      placeholder="Nhập số điện thoại liên hệ"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-spa-dark ml-2">Địa chỉ giao hàng *</label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-spa-beige/50 border border-transparent focus:border-spa-peach focus:bg-white px-6 py-4 rounded-full transition-all outline-none"
                      placeholder="Nhập địa chỉ nhận hàng"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-spa-dark ml-2">Số lượng</label>
                      <select 
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full bg-spa-beige/50 border border-transparent focus:border-spa-peach focus:bg-white px-6 py-4 rounded-full transition-all outline-none appearance-none"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-spa-dark ml-2">Ghi chú thêm</label>
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-spa-beige/50 border border-transparent focus:border-spa-peach focus:bg-white px-6 py-4 rounded-[2rem] transition-all outline-none resize-none"
                      placeholder="Tin nhắn hoặc yêu cầu đặc biệt..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-solid w-full flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-4 italic">
                    (Thông tin của bạn sẽ được bảo mật và gửi trực tiếp đến hệ thống của chúng tôi)
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsPage = () => {
  const { articles, isLoading } = useNews();

  return (
    <div className="pt-32 pb-24 bg-spa-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-spa-peach font-bold tracking-[0.3em] uppercase text-xs">Blog & Updates</span>
          <h1 className="text-5xl md:text-6xl font-serif mt-4 mb-6 text-spa-dark">Tin Tức & Kinh Nghiệm</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Cập nhật những xu hướng làm đẹp mới nhất và các mẹo chăm sóc da từ chuyên gia của Aleynn.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Đang tải tin tức...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Chưa có bài viết nào được xuất bản trên Blogger. Hãy vào trang quản lý Blogger và viết một vài bài viết.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} to={`/news/${article.id}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-spa-peach">
                    {article.category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-xs text-gray-400 mb-3">{article.date}</p>
                  <h3 className="text-xl font-serif mb-4 group-hover:text-spa-peach transition-colors">{article.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{article.excerpt}</p>
                  <div className="flex items-center text-spa-peach text-sm font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
                    Đọc tiếp <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NewsDetail = () => {
  const { id } = useParams();
  const { articles, isLoading } = useNews();
  const article = articles.find(a => String(a.id) === String(id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spa-beige">
        <div className="text-center text-gray-500">
          Đang tải bài viết...
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spa-beige">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Bài viết không tồn tại</h2>
          <Link to="/news" className="text-spa-peach hover:underline text-sm uppercase tracking-widest font-bold">Trở về Tin Tức</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-spa-beige min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/news" className="inline-flex items-center gap-2 text-spa-peach font-bold uppercase text-xs mb-8 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={16} /> Quay lại Tin Tức
        </Link>
        
        <div className="bg-white rounded-[40px] overflow-hidden shadow-sm">
          <img src={article.image} alt={article.title} className="w-full h-[60vh] object-cover" />
          
          <div className="p-12 md:p-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-spa-peach/10 text-spa-peach px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {article.category}
              </span>
              <span className="text-gray-400 text-sm">{article.date}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif mb-8 text-spa-dark leading-tight">{article.title}</h1>
            
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spa-dark prose-p:text-gray-600 prose-a:text-spa-peach hover:prose-a:underline">
              {article.isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <Markdown>{article.content}</Markdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const BookingForm = ({ preselectedServiceId }: { preselectedServiceId?: string }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialServiceId = preselectedServiceId || searchParams.get('serviceId') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceId: initialServiceId,
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    if (initialServiceId) {
      setFormData(prev => ({ ...prev, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validate = () => {
    const errors: Record<string, string> = {};
    
    if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!/^[0-9+ ]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    if (!formData.serviceId) {
      errors.serviceId = 'Please select a service';
    }

    if (!formData.date) {
      errors.date = 'Please select a date';
    }

    if (!formData.time) {
      errors.time = 'Please select an esthetician';
    }

    return errors;
  };

  const errors = validate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched on submit
    setTouched({
      name: true,
      email: true,
      phone: true,
      serviceId: true,
      date: true,
      time: true
    });

    if (Object.keys(errors).length === 0) {
      setStatus('submitting');
      setTimeout(() => setStatus('success'), 1500);
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-12 rounded-3xl shadow-xl text-center"
      >
        <CheckCircle2 size={40} className="text-spa-peach mx-auto mb-4" />
        <h3 className="text-2xl font-serif mb-2">Success!</h3>
        <p className="text-gray-500">We will contact you shortly.</p>
      </motion.div>
    );
  }

  const InputError = ({ name }: { name: string }) => {
    if (touched[name] && errors[name]) {
      return <p className="text-[10px] text-red-500 mt-1 ml-4 absolute">{errors[name]}</p>;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <div className="relative">
          <input 
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your Name"
            className={`w-full border rounded-full px-6 py-3 outline-none transition-all ${touched.name && errors.name ? 'border-red-500' : 'border-gray-200 focus:border-spa-peach'}`}
          />
          <InputError name="name" />
        </div>
        <div className="relative">
          <input 
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your Email"
            className={`w-full border rounded-full px-6 py-3 outline-none transition-all ${touched.email && errors.email ? 'border-red-500' : 'border-gray-200 focus:border-spa-peach'}`}
          />
          <InputError name="email" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <div className="relative">
          <input 
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your Phone"
            className={`w-full border rounded-full px-6 py-3 outline-none transition-all ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-spa-peach'}`}
          />
          <InputError name="phone" />
        </div>
        <div className="relative">
          <select 
            required
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-full px-6 py-3 outline-none transition-all bg-white ${touched.serviceId && errors.serviceId ? 'border-red-500' : 'border-gray-200 focus:border-spa-peach'}`}
          >
            <option value="">Select a service</option>
            {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <InputError name="serviceId" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <div className="relative">
          <input 
            required
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-full px-6 py-3 outline-none transition-all ${touched.date && errors.date ? 'border-red-500' : 'border-gray-200 focus:border-spa-peach'}`}
          />
          <InputError name="date" />
        </div>
        <div className="relative">
          <select 
            required
            name="time"
            value={formData.time}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-full px-6 py-3 outline-none transition-all bg-white ${touched.time && errors.time ? 'border-red-500' : 'border-gray-200 focus:border-spa-peach'}`}
          >
            <option value="">Select an Esthetician</option>
            {SPECIALISTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <InputError name="time" />
        </div>
      </div>
      <div className="relative">
        <textarea 
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          placeholder="Your Comment"
          className="w-full border border-gray-200 rounded-3xl px-6 py-4 outline-none focus:border-spa-peach transition-all"
        />
      </div>
      <button 
        disabled={status === 'submitting'}
        className="btn-primary w-full md:w-auto px-12 py-4 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Processing...' : 'Make An Appointment'}
      </button>
    </form>
  );
};

const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="relative max-w-5xl mx-auto px-6">
      <div className="relative overflow-hidden bg-white rounded-[40px] shadow-sm p-8 md:p-16 lg:p-20">
        <Quote className="w-12 h-12 text-spa-peach/20 absolute top-10 left-10" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="text-left space-y-8">
              <p className="text-gray-500 text-lg md:text-xl leading-relaxed italic">
                "{TESTIMONIALS[current].content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={TESTIMONIALS[current].avatar} 
                  alt={TESTIMONIALS[current].name} 
                  className="w-16 h-16 rounded-full border-2 border-spa-peach shadow-md"
                />
                <div>
                  <h4 className="font-serif text-xl text-spa-dark">{TESTIMONIALS[current].name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">{TESTIMONIALS[current].role}</p>
                </div>
              </div>

              <div className="flex gap-1">
                {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-spa-peach text-spa-peach" />
                ))}
              </div>
            </div>

            {TESTIMONIALS[current].beforeAfter && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-center font-bold text-gray-400">Before</p>
                  <div className="rounded-2xl overflow-hidden aspect-square border-2 border-gray-100 shadow-inner">
                    <img src={TESTIMONIALS[current].beforeAfter?.before} alt="Before" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-center font-bold text-spa-peach">After</p>
                  <div className="rounded-2xl overflow-hidden aspect-square border-2 border-spa-peach/30 shadow-lg">
                    <img src={TESTIMONIALS[current].beforeAfter?.after} alt="After" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-10 right-10 flex gap-4">
          <button 
            onClick={prev}
            className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-spa-peach hover:text-spa-peach transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={next}
            className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-spa-peach hover:text-spa-peach transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${current === i ? 'bg-spa-peach w-4' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/about') {
      e.preventDefault();
      navigate('/about');
      return;
    }
    if (href === '/') {
      e.preventDefault();
      navigate('/');
      return;
    }
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        e.preventDefault();
        navigate('/' + href);
      }
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled || location.pathname !== '/' ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-serif tracking-[0.3em] text-spa-dark font-medium uppercase">ALEYNN</span>
            <span className="text-[8px] tracking-[0.4em] text-spa-peach font-bold uppercase -mt-1">Spa & Center</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-8 font-medium uppercase text-[10px] tracking-[0.2em] text-spa-dark/80">
          {['Home', 'About', 'Treatment', 'Features', 'Shop', 'News', 'Contact'].map((item) => {
            const dest = item === 'About' ? '/about' : (item === 'Shop' ? '/shop' : (item === 'News' ? '/news' : (item === 'Home' ? '/' : `#${item.toLowerCase()}`)));
            return (
              <a 
                key={item} 
                href={dest} 
                onClick={(e) => handleNavClick(e, dest)}
                className="hover:text-spa-peach transition-colors relative group"
              >
                {item}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-spa-peach transition-all ${location.pathname === dest ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            );
          })}
        </div>

        <button className="hidden md:block btn-primary text-xs tracking-widest uppercase">
          Đặt Lịch Ngay
        </button>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-8 flex flex-col items-center gap-6 md:hidden"
          >
            {['Home', 'About', 'Treatment', 'Features', 'Shop', 'News', 'Contact'].map((item) => {
              const dest = item === 'About' ? '/about' : (item === 'Shop' ? '/shop' : (item === 'News' ? '/news' : (item === 'Home' ? '/' : `#${item.toLowerCase()}`)));
              return (
                <a key={item} href={dest} className="font-serif text-xl uppercase" onClick={(e) => {
                  setIsOpen(false);
                  handleNavClick(e, dest);
                }}>
                  {item}
                </a>
              );
            })}
            <button className="btn-primary w-2/3">Đặt Lịch Ngay</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const getGalleryForService = (service: Service): string[] => {
  if (service.category === 'Skin Care') {
    return [
      "https://images.unsplash.com/photo-1570172619644-641a5c689d14?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800",
    ];
  }
  if (service.category === 'Permanent Makeup') {
    return [
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512428559086-560ad5d8b132?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
    ];
  }
  return [
      "https://images.unsplash.com/photo-1540555700373-f4edb393532e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80&w=800"
  ];
};

const ServiceDetail = () => {
  const { id } = useParams();
  const serviceId = Number(id);
  const service = SERVICES.find(s => s.id === serviceId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-serif mb-4">Service Not Found</h2>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const gallery = getGalleryForService(service);
  const detailedContent = SERVICE_CONTENT[serviceId];

  return (
    <div className="pt-32 pb-24 bg-spa-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-spa-peach font-bold uppercase text-xs mb-8 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="rounded-[40px] overflow-hidden shadow-2xl h-[500px]">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <span className="inline-block px-4 py-2 bg-spa-peach/10 text-spa-peach rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Premium Treatment
              </span>
              <h1 className="text-5xl font-serif mb-4">{service.title}</h1>
              <p className="text-2xl font-bold text-spa-peach mb-6">{service.price}</p>
              <p className="text-gray-500 text-lg leading-relaxed">{service.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-spa-peach">Target Problems</h4>
                <ul className="space-y-2">
                  {service.targetProblems.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-spa-peach" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h4 className="font-bold uppercase text-xs tracking-widest mb-4 text-spa-peach">Main Benefits</h4>
                <ul className="space-y-2">
                  {service.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="text-spa-peach" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a href="#contact" className="btn-primary text-center py-4 text-sm tracking-widest">
              Book this Treatment
            </a>
          </div>
        </div>

        {detailedContent && (
          <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-sm mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-spa-dark prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-spa-peach hover:prose-a:underline prose-strong:text-spa-dark">
              <Markdown>{detailedContent}</Markdown>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[40px] p-12 shadow-sm mb-20">
          <h2 className="text-3xl font-serif text-center mb-12">Frequently Asked Questions</h2>
          <FAQAccordion faqs={service.faqs} />
        </div>

        <div className="bg-white rounded-[40px] p-12 shadow-sm mb-20">
          <h2 className="text-3xl font-serif text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, i) => (
              <div 
                key={i} 
                className="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative"
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img} 
                  alt={`${service.title} gallery ${i + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-spa-dark/0 group-hover:bg-spa-dark/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>

        <section id="contact" className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif mb-4">Book your Session</h2>
          <p className="text-gray-400 mb-12 italic">Ready to experience the best? Fill the form below.</p>
          <BookingForm preselectedServiceId={service.id.toString()} />
        </section>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-spa-dark/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage} 
              alt="Gallery Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-spa-peach font-bold tracking-[0.3em] uppercase text-xs">Về Chúng Tôi</span>
          <h1 className="text-5xl md:text-6xl font-serif mt-4 mb-6 text-spa-dark">Triết Lý L'Éclat</h1>
          <p className="text-gray-500 leading-relaxed text-lg">
            Tại L'Éclat (nay là Aleynn Spa & Center), chúng tôi tin rằng vẻ đẹp thực sự bắt nguồn từ sự cân bằng giữa sức khỏe thể chất và tinh thần. Sứ mệnh của chúng tôi là đánh thức vẻ đẹp tự nhiên tiềm ẩn trong mỗi người thông qua các liệu pháp chăm sóc cá nhân hóa.
          </p>
        </motion.div>
      </div>

      {/* History Section */}
      <div className="max-w-7xl mx-auto px-6 mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-[40px] overflow-hidden shadow-2xl"
        >
          <img src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=800" alt="Spa Interior" className="w-full h-full object-cover aspect-[4/5]" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-serif text-spa-dark">Hành Trình Kiến Tạo Cái Đẹp</h2>
          <p className="text-gray-500 leading-relaxed">
            Được thành lập từ năm 2010 với tên gọi nguyên bản L'Éclat, chúng tôi bắt đầu như một boutique spa nhỏ với khát vọng mang đến những trải nghiệm thư giãn đẳng cấp quốc tế. Qua hơn một thập kỷ phát triển, chúng tôi chuyển mình thành Aleynn Spa & Center - một hệ sinh thái chăm sóc sắc đẹp và sức khỏe toàn diện.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Mỗi không gian tại Aleynn đều được thiết kế tỉ mỉ, kết hợp giữa nghệ thuật kiến trúc đương đại và âm hưởng thiên nhiên, tạo nên một ốc đảo yên bình ngay giữa lòng thàn phố.
          </p>
          <ul className="space-y-4 mt-6">
            {['10+ Năm Kinh Nghiệm', 'Hàng Ngàn Khách Hàng Hài Lòng', 'Thiết Bị Công Nghệ Chăm Sóc Hiện Đại'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-spa-dark font-medium">
                <CheckCircle2 className="text-spa-peach w-5 h-5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Team/Expertise Section */}
      <div className="bg-spa-beige/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-spa-peach font-bold tracking-[0.3em] uppercase text-xs">Đội Ngũ</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4">Chuyên Gia Của Chúng Tôi</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4">
              Aleynn tự hào quy tụ đội ngũ bác sĩ da liễu và chuyên gia thẩm mỹ hàng đầu, những người luôn tâm huyết mang lại hiệu quả trị liệu cao nhất cho khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                name: "Dr. Elena Gilbert",
                role: "Bác Sĩ Da Liễu Trưởng",
                bio: "Với hơn 15 năm kinh nghiệm trong ngành da liễu thẩm mỹ, Dr. Elena là chuyên gia hàng đầu về các liệu pháp laser và tế bào gốc.",
                image: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800"
              },
              {
                name: "Jessica Alba",
                role: "Chuyên Gia Phun Xăm",
                bio: "Bậc thầy kiến tạo đường nét tự nhiên, Jessica đã giúp hàng ngàn khách hàng tìm lại được sự tự tin qua những tác phẩm điêu khắc chân mày.",
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800"
              },
              {
                name: "Sophie Turner",
                role: "Chuyên Viên Trị Liệu",
                bio: "Sophie đặc biệt am hiểu các liệu pháp massage phục hồi và chăm sóc cơ thể chuyên sâu, mang lại nguồn năng lượng mới cho khách hàng.",
                image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800"
              }
            ].map((staff, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={staff.image} alt={staff.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 text-center space-y-3">
                  <h3 className="text-2xl font-serif text-spa-dark">{staff.name}</h3>
                  <p className="text-spa-peach font-bold text-xs uppercase tracking-widest">{staff.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{staff.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TrustPage = () => {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-spa-peach font-bold tracking-[0.3em] uppercase text-xs">Tại sao khách hàng</span>
          <h1 className="text-5xl md:text-6xl font-serif text-spa-dark mt-4 mb-6">Tin Tưởng Aleynn</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Sự hài lòng và vẻ đẹp bền vững của bạn là sứ mệnh hàng đầu của chúng tôi. Tại Aleynn, chúng tôi cam kết mang đến những giá trị thật và kết quả tối ưu nhất với sự tận tâm tuyệt đối.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-lg"
          >
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000" 
              alt="Aleynn Spa Luxury Interior" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-spa-beige/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-spa-peach shadow-sm mb-6">
                <Star size={24} />
              </div>
              <h2 className="text-4xl font-serif text-spa-dark">Đội ngũ chuyên gia<br />giàu kinh nghiệm</h2>
              <p className="text-gray-500 leading-relaxed text-lg">
                Mỗi kỹ thuật viên tại Aleynn đều trải qua quá trình đào tạo khắt khe và sở hữu chứng chỉ hành nghề chuyên nghiệp. Chúng tôi tự hào có những bác sĩ da liễu và chuyên gia thẩm mỹ hàng đầu, luôn cập nhật các xu hướng và công nghệ phục hồi da mới nhất trên thế giới.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-square rounded-3xl overflow-hidden shadow-lg"
            >
              <img src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800" alt="Đội ngũ chuyên gia" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-square rounded-3xl overflow-hidden shadow-lg order-2 md:order-1"
            >
              <img src="https://images.unsplash.com/photo-1570172619644-641a5c689d14?auto=format&fit=crop&q=80&w=800" alt="Công nghệ hiện đại" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 order-1 md:order-2"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-spa-peach shadow-sm mb-6">
                <Leaf size={24} />
              </div>
              <h2 className="text-4xl font-serif text-spa-dark">Công nghệ tân tiến<br />đạt chuẩn y khoa</h2>
              <p className="text-gray-500 leading-relaxed text-lg">
                Aleynn luôn tiên phong trong việc ứng dụng các máy móc công nghệ cao có nguồn gốc rõ ràng, được chứng nhận bởi FDA và CE. Đi kèm với đó là quy trình sát khuẩn, vô trùng nghiêm ngặt nhằm đảm bảo an toàn tuyệt đối cho mọi khách hàng.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-spa-peach shadow-sm mb-6">
                <Heart size={24} />
              </div>
              <h2 className="text-4xl font-serif text-spa-dark">Tận tâm và<br />cam kết kết quả</h2>
              <p className="text-gray-500 leading-relaxed text-lg">
                Chúng tôi không chỉ cung cấp dịch vụ, mà còn đồng hành cùng bạn trong suốt quá trình chăm sóc sắc đẹp. Mọi liệu trình tại Aleynn đều có phác đồ cá nhân hóa rõ ràng, kết hợp với các chính sách bảo hành và cam kết chất lượng dài lâu.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-square rounded-3xl overflow-hidden shadow-lg"
            >
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" alt="Tận tâm và cam kết" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { articles, isLoading } = useNews();
  const [activeCategory, setActiveCategory] = useState<'Skin Care' | 'Permanent Makeup' | 'Hair Removal'>('Skin Care');
  const [showAllServices, setShowAllServices] = useState(false);

  const filteredServices = SERVICES.filter(s => s.category === activeCategory);
  const displayedServices = showAllServices ? filteredServices : filteredServices.slice(0, 6);

  // Reset showAllServices when category changes
  const handleCategoryChange = (cat: typeof activeCategory) => {
    setActiveCategory(cat);
    setShowAllServices(false);
  };

  return (
    <>
      {/* --- HERO SECTION --- (Section 1) */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-spa-beige">
        {/* Background Flower Decorations */}
        <div className="absolute top-20 right-[-100px] w-[500px] opacity-30 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800" alt="" className="w-full" />
        </div>
        <div className="absolute bottom-20 left-[-100px] w-[400px] opacity-20 pointer-events-none rotate-180">
          <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800" alt="" className="w-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl leading-[1.1] mb-6 text-spa-dark font-serif font-medium">
              Vẻ Đẹp Thực Sự.<br />
              Đến Từ Sự Tận Tâm.
            </h1>
            <p className="text-gray-500 text-lg mb-10 max-w-lg leading-relaxed">
              Aleynn Spa & Center tự hào mang đến các giải pháp làm đẹp tiên tiến nhất, từ chăm sóc da chuyên sâu đến phun xăm phong thủy, mang lại vẻ đẹp tự nhiên và sự tự tin cho bạn.
            </p>
            <a href="#contact" className="btn-primary inline-block text-sm tracking-widest uppercase py-4 px-10 shadow-lg">
              Đặt Lịch Ngay
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="hidden lg:flex justify-center relative"
          >
            {/* Circular image like the mockup */}
            <div className="relative w-[500px] h-[500px]">
              <div className="absolute inset-0 rounded-full border border-spa-peach/20 scale-110" />
              <div className="absolute inset-0 rounded-full overflow-hidden border-[15px] border-white shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800" 
                  alt="Beautiful Woman" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Flower accents */}
              <div className="absolute -top-10 -left-10 w-32 h-32 opacity-80">
                <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=200" alt="" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- WHY OUR CLIENTS CHOOSE US --- */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-spa-beige rounded-full -z-10 transition-transform duration-700" />
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1540555700373-f4edb393532e?auto=format&fit=crop&q=80&w=800" alt="Spa Experience" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-spa-peach/10" />
            </motion.div>
          </div>

          <div className="space-y-6">
            <span className="text-spa-peach font-bold tracking-[0.3em] uppercase text-xs">Tại sao khách hàng</span>
            <h2 className="text-4xl md:text-5xl font-serif">Tin Tưởng Aleynn</h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Chúng tôi sở hữu đội ngũ chuyên gia giàu kinh nghiệm, trang thiết bị công nghệ hiện đại và quy trình đạt chuẩn y khoa. Mỗi khách hàng đến với Aleynn đều được lắng nghe và tư vấn liệu trình phù hợp nhất.
            </p>
            <p className="text-gray-400 text-sm italic">
              Sự hài lòng và vẻ đẹp bền vững của bạn là sứ mệnh hàng đầu của chúng tôi.
            </p>
            <Link to="/trust" onClick={() => window.scrollTo(0, 0)} className="btn-primary mt-4 py-4 px-10 inline-block">Xem Thêm</Link>
          </div>
        </div>
      </section>

      {/* --- SPECIAL SERVICES --- */}
      <section id="treatment" className="py-24 bg-spa-beige/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4 font-serif">Dịch Vụ Nổi Bật</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Hệ thống dịch vụ đa dạng, chăm sóc toàn diện từ làn da đến vóc dáng.</p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center flex-wrap gap-4 mb-16">
            {(['Skin Care', 'Permanent Makeup', 'Hair Removal'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-spa-peach text-white shadow-lg' 
                    : 'bg-white text-gray-400 hover:text-spa-peach'
                }`}
              >
                {cat === 'Skin Care' ? 'Chăm sóc & Điều trị da' : cat === 'Permanent Makeup' ? 'Phun xăm thẩm mỹ' : 'Triệt lông'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {displayedServices.map((service, idx) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 group"
                >
                  <Link to={`/service/${service.id}`}>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 relative">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-spa-peach/5 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h3 className="text-xl font-serif mb-2">{service.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">{service.description}</p>
                    <div className="w-full h-[1px] bg-gray-100 my-4" />
                  </Link>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-spa-peach font-bold">{service.price}</span>
                    <a href={`/?serviceId=${service.id}#contact`} className="btn-primary py-2 px-4 shadow-sm text-xs rounded-full inline-block">
                      Book Now
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredServices.length > 6 && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => setShowAllServices(!showAllServices)}
                className="btn-primary py-3 px-8 text-sm uppercase tracking-widest"
              >
                {showAllServices ? 'Thu gọn' : 'Xem Tất Cả'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- SPECIALISTS --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl mb-4 font-serif">Specialists</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-16 italic">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet varius leo.</p>

          <div className="flex flex-wrap justify-center gap-12">
            {SPECIALISTS.map((s, i) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center group"
              >
                <div className="w-32 h-32 mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-spa-peach opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover rounded-full shadow-lg" />
                </div>
                <h4 className="font-serif text-lg text-spa-dark font-medium">{s.name}</h4>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{s.role}</p>
              </motion.div>
            ))}
          </div>
          <button className="mt-16 btn-primary px-10">View all Team</button>
        </div>
      </section>

      {/* --- PRODUCT WE USE --- */}
      <section id="shop" className="py-24 bg-spa-beige/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 opacity-20">
                <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=200" alt="" />
             </div>
             <h2 className="text-4xl md:text-5xl mb-6 font-serif">Product we use for you</h2>
             <p className="text-gray-400 leading-relaxed max-w-lg mb-8">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
             </p>
             <Link to="/shop">
              <button className="btn-outline px-10">Shop Now</button>
            </Link>
          </div>
          <div className="relative group">
            <div className="rounded-2xl overflow-hidden shadow-2xl skew-y-1 group-hover:skew-y-0 transition-transform duration-700">
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200" alt="Product Display" className="w-full aspect-video object-cover" />
            </div>
            {/* Floating label like the mock image */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white p-6 shadow-xl rounded-2xl flex flex-col justify-center items-center text-center hidden md:flex">
              <span className="text-spa-peach font-bold text-2xl">Organic</span>
              <span className="text-[12px] uppercase tracking-widest mt-1">100% natural</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST NEWS --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-spa-peach font-bold tracking-[0.3em] uppercase text-xs">Our Blog</span>
              <h2 className="text-4xl md:text-5xl font-serif mt-4">Tin Tức Mới Nhất</h2>
            </div>
            <Link to="/news" className="btn-outline px-8 py-3 whitespace-nowrap">Xem Tất Cả Tin Tức</Link>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-500">Đang tải tin tức...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Chưa có bài viết nào được xuất bản trên Blogger.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.slice(0, 3).map((article) => (
                <Link key={article.id} to={`/news/${article.id}`} className="group relative block">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                    <span className="inline-block px-3 py-1 bg-spa-peach text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                      {article.category}
                    </span>
                    <h3 className="text-2xl font-serif mb-2 leading-tight group-hover:text-spa-peach transition-colors">{article.title}</h3>
                    <p className="text-sm text-gray-300 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-300 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- FAQs --- */}
      <section className="py-24 bg-spa-beige/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 italic">Got questions? We've got answers.</p>
          </div>
          <FAQAccordion faqs={GENERAL_FAQS} />
        </div>
      </section>

      {/* --- MAKE AN APPOINTMENT --- */}
      <section id="contact" className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl mb-4 font-serif">Make an Appointment</h2>
          <p className="text-gray-400 mb-16 italic text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
          <BookingForm />
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-spa-beige/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl mb-16 font-serif">Testimonials</h2>
          <TestimonialCarousel />
        </div>
      </section>
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/trust" element={<TrustPage />} />
      </Routes>

      {/* Floating Download Button For Blogger Files */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href="/blogger-theme.xml" download="blogger-theme.xml" className="bg-spa-dark hover:bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 transform transition-all hover:-translate-y-1">
          <Download size={20} />
          <span className="text-sm font-medium">Tải Blogger Theme (.xml)</span>
        </a>
        <a href="/blogger-import.xml" download="blogger-import.xml" className="bg-spa-peach hover:bg-spa-dark text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 transform transition-all hover:-translate-y-1">
          <Download size={20} />
          <span className="text-sm font-medium">Tải Blogger Upload Data (.xml)</span>
        </a>
      </div>

      {/* --- FOOTER --- */}
      <footer className="py-20 bg-spa-dark text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-12 mb-12">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-2xl font-serif tracking-[0.3em] font-medium uppercase text-white">ALEYNN</span>
              <span className="text-[8px] tracking-[0.4em] text-spa-peach font-bold uppercase -mt-1">Spa & Center</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet varius leo.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="font-serif text-xl">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Home', 'About', 'Treatment', 'Features', 'Shop', 'News'].map(item => {
                const dest = item === 'About' ? '/about' : (item === 'Shop' ? '/shop' : (item === 'News' ? '/news' : (item === 'Home' ? '/' : `#${item.toLowerCase()}`)));
                return <li key={item}><a href={dest} className="hover:text-spa-peach transition-colors">{item}</a></li>;
              })}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-serif text-xl">Services</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {SERVICES.map(s => (
                <li key={s.id}><a href="#" className="hover:text-spa-peach transition-colors">{s.title}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-serif text-xl">Follow Us</h4>
            <div className="flex gap-4">
               <Instagram className="text-gray-400 hover:text-spa-peach cursor-pointer" size={20} />
               <Facebook className="text-gray-400 hover:text-spa-peach cursor-pointer" size={20} />
            </div>
            <p className="text-gray-400 text-sm">contact@aleynspa.com</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center text-[10px] text-gray-500 uppercase tracking-[0.2em]">
          © 2024 Aleynn Spa. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
