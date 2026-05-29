import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import CommentSection from "@/app/components/CommentSection";

// 1. Sửa kiểu dữ liệu Params thành Promise theo đúng chuẩn Next.js khắt khe
interface Props {
  params: Promise<{ id: string }>;
}

export default async function BaiHocDetailPage({ params }: Props) {
  // 2. Phải dùng await để giải nén id từ params
  const { id } = await params;

  // 3. Khởi tạo Supabase Client SSR đồng bộ Cookie hoàn chỉnh để phục vụ build Production
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chạy ngầm phía Server có thể bỏ qua bước set cookie
          }
        },
      },
    },
  );

  // 4. Lấy chi tiết bài học từ Database
  const { data: baiHoc } = await supabase
    .from("bai_hoc")
    .select("*")
    .eq("id", id)
    .single();

  if (!baiHoc) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-amber-950 mb-4">
        {baiHoc.tieu_de}
      </h1>
      <p className="text-gray-600 italic mb-6">{baiHoc.mo_ta}</p>

      <img
        src={
          baiHoc.hinh_anh ||
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800"
        }
        alt={baiHoc.tieu_de}
        className="w-full h-96 object-cover rounded-xl mb-8"
      />

      <div className="prose max-w-none mb-12 bg-white p-6 border rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-orange-800 mb-4">
          Hướng dẫn thực hiện:
        </h2>
        <div className="whitespace-pre-line text-gray-700">
          {baiHoc.noi_dung}
        </div>
      </div>

      <hr className="my-8" />

      {/* Khu vực bình luận sử dụng Client Component + Realtime */}
      <CommentSection baiHocId={id} />
    </div>
  );
}
