import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  // Lấy mã code xác thực do Supabase gửi về qua thanh địa chỉ URL
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Đổi mã code lấy phiên đăng nhập (session) chính thức cho người dùng
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Sau khi xác thực và kích hoạt tài khoản thành công, điều hướng về trang chủ
  return NextResponse.redirect(requestUrl.origin);
}
