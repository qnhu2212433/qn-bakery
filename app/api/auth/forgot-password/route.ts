import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);

  // 1. Đọc dữ liệu Email từ Form do người dùng gõ và nhấn nút gửi lên
  const formData = await request.formData();
  const email = formData.get("email") as string;

  // 2. Khởi tạo cookieStore bất đồng bộ chuẩn Next.js mới
  const cookieStore = await cookies();

  // Khởi tạo Supabase Server Client thế hệ mới đồng bộ 100% với hệ thống
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
            // Có thể bỏ qua trên môi trường Server Route Handler
          }
        },
      },
    },
  );

  // 3. Ra lệnh cho Supabase gửi Email đặt lại mật khẩu về hòm thư người dùng
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${requestUrl.origin}/api/auth/callback`,
  });

  // 4. Nếu Supabase báo lỗi (Email không tồn tại, gửi quá nhanh liên tục...)
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/forgot-password?error=${encodeURIComponent(error.message)}`,
      { status: 303 }, // Ép chuyển hướng phương thức an toàn
    );
  }

  // 5. Nếu gửi Email thành công, điều hướng quay về trang Login kèm thông báo chúc mừng
  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=${encodeURIComponent("Liên kết đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hòm thư Email của bạn.")}`,
    { status: 303 },
  );
}
