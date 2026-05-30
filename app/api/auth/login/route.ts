import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const cookieStore = await cookies();

  // 1. Khởi tạo Server Client ĐÚNG CHUẨN để tự động đọc/ghi Cookie vào trình duyệt
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
            // Có thể bỏ qua nếu gọi từ Server Component
          }
        },
      },
    },
  );

  // 2. Thực hiện đăng nhập
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 3. Nếu lỗi -> Trả về trang login kèm thông báo lỗi (Dùng mã 303)
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`,
      { status: 303 },
    );
  }

  // 4. THÀNH CÔNG -> Chuyển hướng về trang chủ và gửi kèm Cookie đăng nhập (Dùng mã 303)
  return NextResponse.redirect(requestUrl.origin, { status: 303 });
}
