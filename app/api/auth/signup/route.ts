import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Gọi hàm đăng ký tài khoản của Supabase Auth
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/api/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`,
      { status: 301 },
    );
  }

  // Đăng ký thành công -> Thông báo kiểm tra Email hoặc điều hướng tùy ý
  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=Check email to confirm registration`,
    { status: 301 },
  );
}
