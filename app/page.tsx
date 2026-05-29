import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  addCakeRecipe,
  deleteCakeRecipe,
  updateCakeRecipe,
  signOut,
} from "./actions";

export default async function HomePage() {
  // 1. Khởi tạo Supabase Server Client tương thích 100% với Vercel Production
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
            // Bỏ qua trên môi trường Server Component
          }
        },
      },
    },
  );

  // 2. Kiểm tra trạng thái phiên đăng nhập của người dùng
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  // 3. Fetch danh sách dữ liệu công thức bánh thời gian thực
  const { data: baiHocs, error } = await supabase.from("bai_hoc").select("*");

  if (error)
    return (
      <div className="text-zinc-500 text-center py-20 font-medium">
        Lỗi kết nối hệ thống, vui lòng thử lại sau.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-800 font-sans antialiased">
      {/* Header trắng tinh tế kết hợp tên thương hiệu BakeryLab */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-zinc-900 uppercase">
              Bakery<span className="text-amber-500 font-light">Lab.</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              /* 🔥 ĐÃ SỬA: Thay thế action API cũ bằng hàm Server Action signOut nhận trực tiếp từ file ./actions */
              <form action={signOut} className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-zinc-500">
                  Chào, {session.user.email?.split("@")[0]}
                </span>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                >
                  Đăng xuất
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition"
              >
                🔒 Thành viên đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner khối màu tối sâu lắng */}
      <section className="bg-[#0f172a] text-white py-16 px-4 text-center relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl uppercase">
            Khoá Học Làm Bánh Chuẩn Vị
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed normal-case">
            Bí kíp làm bánh nở cao, mặt mịn bóng, ruột tơi xốp tan ngay trong
            miệng. Khám phá ngay các công thức chuẩn vị được chia sẻ từ tiệm
            bánh BakeryLab.
          </p>
        </div>
      </section>

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* FORM ĐÓNG GÓP CÔNG THỨC */}
        {isLoggedIn ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm mb-16 max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-zinc-900 mb-1 flex items-center gap-2">
              ✨ Đóng góp công thức bánh của bạn
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Hệ thống sử dụng Server Actions cập nhật dữ liệu thời gian thực.
            </p>
            <form
              action={addCakeRecipe}
              encType="multipart/form-data"
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                    Tên món bánh *
                  </label>
                  <input
                    name="tieu_de"
                    type="text"
                    required
                    placeholder="Ví dụ: Bánh Kem Castella Đài Loan"
                    className="w-full p-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                    Mô tả hương vị
                  </label>
                  <input
                    name="mo_ta"
                    type="text"
                    placeholder="Ví dụ: Thơm ngon đậm đà, không nồng mùi trứng..."
                    className="w-full p-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Hình ảnh thực tế món bánh
                </label>
                <input
                  name="hinh_anh"
                  type="file"
                  accept="image/*"
                  className="w-full p-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-xl cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Công thức & Quy trình chi tiết *
                </label>
                <textarea
                  name="noi_dung"
                  rows={4}
                  required
                  placeholder="Bước 1: Đánh lòng trắng trứng... Bước 2: Nướng cách thủy ở 150°C..."
                  className="w-full p-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm"
                >
                  Đăng công thức
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Thông báo đăng nhập nếu chưa có phiên */}
        {!isLoggedIn ? (
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl max-w-2xl mx-auto mb-16 text-center shadow-sm">
            <p className="text-amber-900 text-xs font-medium">
              💡 Vui lòng{" "}
              <Link
                href="/login"
                className="text-zinc-900 underline font-bold hover:text-amber-900"
              >
                Đăng nhập tài khoản
              </Link>{" "}
              để đóng góp công thức hoặc chỉnh sửa dữ liệu bánh.
            </p>
          </div>
        ) : null}

        {/* Khu vực danh sách sản phẩm */}
        <div className="border-b border-zinc-200 pb-3 mb-8 flex justify-between items-end">
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight uppercase">
            Khoá học{" "}
            <span className="text-amber-500 normal-case font-bold">
              nổi bật
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {baiHocs?.map((baiHoc) => (
            <div
              key={baiHoc.id}
              className="group bg-white border border-zinc-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-52 bg-zinc-100 relative overflow-hidden">
                  <img
                    src={
                      baiHoc.hinh_anh ||
                      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
                    }
                    alt={baiHoc.tieu_de}
                    className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-zinc-900 tracking-tight capitalize">
                    <Link
                      href={`/bai-hoc/${baiHoc.id}`}
                      className="hover:text-amber-500 transition-colors"
                    >
                      {baiHoc.tieu_de}
                    </Link>
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {baiHoc.mo_ta}
                  </p>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                      Mix Vị Cao Cấp
                    </span>
                    <Link
                      href={`/bai-hoc/${baiHoc.id}`}
                      className="text-xs text-zinc-900 font-bold hover:text-amber-500 transition-colors"
                    >
                      Xem công thức →
                    </Link>
                  </div>
                </div>
              </div>

              {/* KHỐI SỬA / XÓA CHO THÀNH VIÊN */}
              {isLoggedIn && (
                <div className="p-5 pt-0 mt-auto bg-zinc-50/50 border-t border-zinc-100 space-y-2">
                  <form
                    action={updateCakeRecipe}
                    className="flex gap-2 items-center mt-3"
                  >
                    <input type="hidden" name="id" value={baiHoc.id} />
                    <input
                      type="text"
                      name="tieu_de"
                      required
                      placeholder="Đổi tên..."
                      className="px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:border-zinc-400 flex-1 placeholder-zinc-400"
                    />
                    <button
                      type="submit"
                      className="text-xs bg-zinc-800 hover:bg-zinc-900 text-white px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
                    >
                      Sửa
                    </button>
                  </form>

                  <form action={deleteCakeRecipe} className="w-full text-right">
                    <input type="hidden" name="id" value={baiHoc.id} />
                    <button
                      type="submit"
                      className="w-full text-center text-xs text-red-500 bg-white border border-red-100 hover:bg-red-50 py-2 rounded-lg font-semibold transition cursor-pointer"
                    >
                      Xóa khỏi danh sách
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
