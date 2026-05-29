"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// 1. Khởi tạo Supabase Client đồng bộ Cookie chuẩn SSR
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
          } catch {
            // Thao tác cookie có thể bị chặn ngầm trên Server Component, dùng try-catch để tránh crash
          }
        },
      },
    },
  );
}

// 2. Hàm dùng chung: Xử lý upload ảnh lên Supabase Storage và trả về Public URL
async function uploadImageToStorage(
  supabase: any,
  fileAnh: unknown,
): Promise<string | null> {
  if (!fileAnh || !(fileAnh instanceof File) || fileAnh.size === 0) {
    return null;
  }

  try {
    // Tránh trùng tên file bằng cách kết hợp thời gian thực + chuỗi ngẫu nhiên
    const fileExtension = fileAnh.name.split(".").pop() || "jpg";
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Đẩy file nhị phân lên bucket "bakery-images"
    const { data: storageData, error: storageError } = await supabase.storage
      .from("bakery-images")
      .upload(uniqueFileName, fileAnh, {
        contentType: fileAnh.type,
      });

    if (storageError) {
      console.error("Lỗi Storage Supabase:", storageError.message);
      return null;
    }

    if (storageData) {
      // Lấy link URL công khai truy cập ảnh
      const { data: publicUrlData } = supabase.storage
        .from("bakery-images")
        .getPublicUrl(uniqueFileName);

      return publicUrlData.publicUrl;
    }
  } catch (err) {
    console.error("Lỗi hệ thống khi xử lý file ảnh:", err);
  }

  return null;
}

// 3. HÀM THÊM CÔNG THỨC BÁNH MỚI
export async function addCakeRecipe(formData: FormData) {
  const supabase = await getSupabaseClient();
  const tieu_de = formData.get("tieu_de") as string;
  const mo_ta = formData.get("mo_ta") as string;
  const noi_dung = formData.get("noi_dung") as string;
  const fileAnh = formData.get("hinh_anh");

  if (!tieu_de || !noi_dung) {
    console.error("Vui lòng điền tiêu đề và hướng dẫn chi tiết món bánh!");
    return;
  }

  // Mặc định sử dụng ảnh demo nếu user không up ảnh
  let link_hinh_anh =
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800";

  // Tiến hành upload nếu có file
  const uploadedUrl = await uploadImageToStorage(supabase, fileAnh);
  if (uploadedUrl) {
    link_hinh_anh = uploadedUrl;
  }

  // Chèn dữ liệu chữ kèm link ảnh sạch vào bảng
  const { error } = await supabase.from("bai_hoc").insert([
    {
      tieu_de,
      mo_ta: mo_ta || "",
      noi_dung,
      hinh_anh: link_hinh_anh,
    },
  ]);

  if (error) {
    console.error(`Lỗi Database khi thêm bài học: ${error.message}`);
    return;
  }

  revalidatePath("/");
}

// 4. HÀM XÓA CÔNG THỨC BÁNH
export async function deleteCakeRecipe(formData: FormData) {
  const supabase = await getSupabaseClient();
  const id = formData.get("id") as string;

  if (!id) return;

  const { error } = await supabase.from("bai_hoc").delete().eq("id", id);
  if (error) {
    console.error("Lỗi xóa bài học khỏi Database:", error.message);
    return;
  }

  revalidatePath("/");
}

// 5. HÀM CẬP NHẬT/SỬA CÔNG THỨC BÁNH
export async function updateCakeRecipe(formData: FormData) {
  const supabase = await getSupabaseClient();
  const id = formData.get("id") as string;
  const tieu_de = formData.get("tieu_de") as string;
  const fileAnh = formData.get("hinh_anh"); // Đón đầu nếu sau này form sửa có thêm ô chọn ảnh

  if (!id || !tieu_de) return;

  // Tạo object chứa các trường cần update chữ trước
  const updateData: Record<string, any> = { tieu_de };

  // Nếu trong form sửa người dùng có chọn lại ảnh mới, tiến hành up đè link
  const uploadedUrl = await uploadImageToStorage(supabase, fileAnh);
  if (uploadedUrl) {
    updateData.hinh_anh = uploadedUrl;
  }

  const { error } = await supabase
    .from("bai_hoc")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Lỗi cập nhật bài học:", error.message);
    return;
  }

  revalidatePath("/");
}
