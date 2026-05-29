import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  // 1. Lấy mã code xác thực từ URL do Supabase gửi về
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      // Đọc ghi Cookie bất đồng bộ chuẩn Next.js mới
      const cookieStore = await cookies();

      // Khởi tạo Supabase Server Client thế hệ mới (Sửa triệt để lỗi gạch đỏ)
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
                // Có thể bỏ qua nếu Route Handler được gọi từ Server Component
              }
            },
          },
        },
      );

      // 2. Đổi mã code lấy session và nạp Cookie bảo mật vào trình duyệt
      await supabase.auth.exchangeCodeForSession(code);

      // Nếu đổi mã thành công, dắt người dùng sang trang nhập mật khẩu mới
      return NextResponse.redirect(`${requestUrl.origin}/update-password`);
    } catch (err: unknown) {
      console.error("Lỗi xác thực Callback:", err);
      // Nếu mã hết hạn hoặc lỗi, đưa về trang login kèm thông báo
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent("Liên kết xác thực đã hết hạn hoặc đã được sử dụng. Vui lòng thử lại!")}`,
      );
    }
  }

  // Nếu không tìm thấy mã code trên URL, đưa người dùng về trang login
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
