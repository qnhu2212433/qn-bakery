import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);

  // 1. Đọc mật khẩu mới từ Form gửi lên
  const formData = await request.formData();
  const password = formData.get("password") as string;

  // 2. Khởi tạo cookieStore bất đồng bộ chuẩn Next.js mới
  const cookieStore = await cookies();

  // Khởi tạo Supabase Server Client thế hệ mới (Không bao giờ bốc lỗi Exported Member)
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

  // 3. Gọi hàm cập nhật mật khẩu gốc của Supabase
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  // 4. Nếu phát hiện lỗi (Ví dụ: Mật khẩu quá ngắn, link hết hạn)
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/update-password?error=${encodeURIComponent(error.message)}`,
      { status: 303 },
    );
  }

  // 5. Thành công: Chuyển hướng về trang Login kèm banner chúc mừng mượt mà
  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=${encodeURIComponent("Đổi mật khẩu thành công! Vui lòng đăng nhập lại bằng mật khẩu mới.")}`,
    { status: 303 },
  );
}
