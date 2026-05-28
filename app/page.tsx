import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { addCakeRecipe } from "./actions"; // Thêm dòng này để import Server Action

// Khởi tạo Supabase client cho Server
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function HomePage() {
  // Data Fetching ngay trên Server Component theo yêu cầu đề bài
  const { data: baiHocs, error } = await supabase.from("bai_hoc").select("*");

  if (error)
    return (
      <div className="text-red-500 text-center py-10">
        Lỗi tải dữ liệu bánh!
      </div>
    );

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section với Tailwind CSS */}
      <header className="bg-orange-100 py-16 text-center border-b border-orange-200">
        <div className="absolute top-4 right-4 sm:right-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-900 bg-orange-200/80 hover:bg-orange-300/90 rounded-xl border border-orange-300/50 shadow-sm transition-all duration-200"
          >
            🔒 Thành viên đăng nhập
          </Link>
        </div>
        <h1 className="text-4xl font-extrabold text-amber-900 tracking-tight sm:text-5xl">
          Học Làm Bánh Mỗi Ngày 🥐
        </h1>
        <p className="mt-4 text-lg text-amber-800 max-w-2xl mx-auto">
          Khám phá các công thức làm bánh ngọt, bánh mì, bánh kem từ cơ bản đến
          chuyên nghiệp.
        </p>
      </header>

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* ==================== ĐÃ THÊM FORM SERVER ACTION Ở ĐÂY ==================== */}
        <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm mb-12 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-amber-950 mb-2 flex items-center gap-2">
            🍞 Đóng góp công thức bánh của bạn
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            (Tính năng sử dụng Next.js Server Actions - Thêm dữ liệu không
            reload trang)
          </p>
          <form
            action={async (formData) => {
              "use server";
              await addCakeRecipe(formData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tên món bánh *
              </label>
              <input
                name="tieu_de"
                type="text"
                required
                placeholder="Ví dụ: Bánh Mousse Dâu Tây Pháp"
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mô tả ngắn
              </label>
              <input
                name="mo_ta"
                type="text"
                placeholder="Ví dụ: Vị chua nhẹ của dâu kết hợp với kem béo ngậy..."
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hướng dẫn / Công thức chi tiết *
              </label>
              <textarea
                name="noi_dung"
                rows={4}
                required
                placeholder="Bước 1: Làm đế bánh bánh quy... Bước 2: Đánh bông kem tươi..."
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium rounded-lg transition shadow-sm"
            >
              Chia sẻ lên hệ thống
            </button>
          </form>
        </div>
        {/* ========================================================================= */}

        {/* Danh sách bài học */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Danh sách công thức hot
        </h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {baiHocs?.map((baiHoc) => (
            <div
              key={baiHoc.id}
              className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="w-full h-48 bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
                <img
                  src={
                    baiHoc.hinh_anh ||
                    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
                  }
                  alt={baiHoc.tieu_de}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  <Link href={`/bai-hoc/${baiHoc.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {baiHoc.tieu_de}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {baiHoc.mo_ta}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-orange-100 text-orange-800">
                    Miễn phí
                  </span>
                  <span className="text-sm text-amber-600 font-medium">
                    Xem công thức →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
