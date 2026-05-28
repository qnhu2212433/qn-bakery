"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Khởi tạo Supabase Client phía Server
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Interface định nghĩa dữ liệu bài học bánh mới theo chuẩn TypeScript
interface BaiHocInput {
  tieu_de: string;
  mo_ta: string;
  noi_dung: string;
}

export async function addCakeRecipe(formData: FormData) {
  // Lấy dữ liệu từ các ô nhập liệu trong Form
  const tieu_de = formData.get("tieu_de") as string;
  const mo_ta = formData.get("mo_ta") as string;
  const noi_dung = formData.get("noi_dung") as string;

  // Kiểm tra hợp lệ dữ liệu cơ bản
  if (!tieu_de || !noi_dung) {
    return { error: "Vui lòng điền tiêu đề và hướng dẫn chi tiết món bánh!" };
  }

  // Thực hiện thêm mới món bánh vào bảng 'bai_hoc' trên Supabase Database
  const { error } = await supabase
    .from("bai_hoc")
    .insert([{ tieu_de, mo_ta, noi_dung }]);

  if (error) {
    return { error: `Lỗi Database: ${error.message}` };
  }

  // Làm mới luồng dữ liệu trang chủ (bảng hiển thị danh sách bánh) ngay lập tức
  revalidatePath("/");
  return { success: true };
}
