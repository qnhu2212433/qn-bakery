"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Khởi tạo Supabase Client đồng bộ Cookie chuẩn SSR
async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
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
          } catch {}
        },
      },
    },
  );
}

// Sửa hàm này trả về void (không return object) để khớp kiểu dữ liệu HTML Form
export async function addCakeRecipe(formData: FormData) {
  const supabase = await getSupabaseClient();
  const tieu_de = formData.get("tieu_de") as string;
  const mo_ta = formData.get("mo_ta") as string;
  const noi_dung = formData.get("noi_dung") as string;

  if (!tieu_de || !noi_dung) {
    console.error("Vui lòng điền tiêu đề và hướng dẫn chi tiết món bánh!");
    return;
  }

  // --- 📸 ĐOẠN XỬ LÝ UPLOAD ẢNH THẬT LÊN BUCKET BAKERY-IMAGES ---
  const fileAnh = formData.get("hinh_anh"); // Lấy file từ ô input name="hinh_anh"

  // Link ảnh mặc định phòng khi người dùng không chọn ảnh
  let link_hinh_anh =
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800";

  if (fileAnh && fileAnh instanceof File && fileAnh.size > 0) {
    try {
      // Đổi tên file sang tiếng Việt không dấu hoặc dùng timestamp để không lỗi URL
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // 1. Đẩy file ảnh xịn lên bucket "bakery-images"
      const { data: storageData, error: storageError } = await supabase.storage
        .from("bakery-images")
        .upload(uniqueFileName, fileAnh, {
          contentType: fileAnh.type, // Đảm bảo đúng định dạng file ảnh png/jpg
        });

      if (storageError) {
        console.error("Lỗi Storage Supabase:", storageError.message);
      } else if (storageData) {
        // 2. Lấy link URL công khai của ảnh vừa tải lên thành công
        const { data: publicUrlData } = supabase.storage
          .from("bakery-images")
          .getPublicUrl(uniqueFileName);

        link_hinh_anh = publicUrlData.publicUrl;
      }
    } catch (err) {
      console.error("Lỗi trong quá trình xử lý file ảnh:", err);
    }
  }
  // -------------------------------------------------------------

  // Chèn dữ liệu chữ kèm link ảnh xịn vào bảng
  const { error } = await supabase.from("bai_hoc").insert([
    {
      tieu_de,
      mo_ta,
      noi_dung,
      hinh_anh: link_hinh_anh, // Đảm bảo cột lưu ảnh trong bảng của bạn tên là "hinh_anh"
    },
  ]);

  if (error) {
    console.error(`Lỗi Database: ${error.message}`);
    return;
  }

  revalidatePath("/");
}

export async function deleteCakeRecipe(formData: FormData) {
  const supabase = await getSupabaseClient();
  const id = formData.get("id") as string;
  if (!id) return;

  const { error } = await supabase.from("bai_hoc").delete().eq("id", id);
  if (error) console.error("Lỗi xóa bánh:", error.message);

  revalidatePath("/");
}

export async function updateCakeRecipe(formData: FormData) {
  const supabase = await getSupabaseClient();
  const id = formData.get("id") as string;
  const tieu_de = formData.get("tieu_de") as string;

  if (!id || !tieu_de) return;

  const { error } = await supabase
    .from("bai_hoc")
    .update({ tieu_de })
    .eq("id", id);

  if (error) console.error("Lỗi cập nhật bánh:", error.message);

  revalidatePath("/");
}
