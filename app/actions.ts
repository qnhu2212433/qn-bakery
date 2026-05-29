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

export async function addCakeRecipe(formData: FormData) {
  const supabase = await getSupabaseClient();
  const tieu_de = formData.get("tieu_de") as string;
  const mo_ta = formData.get("mo_ta") as string;
  const noi_dung = formData.get("noi_dung") as string;

  if (!tieu_de || !noi_dung) {
    return { error: "Vui lòng điền tiêu đề và hướng dẫn chi tiết món bánh!" };
  }

  const { error } = await supabase
    .from("bai_hoc")
    .insert([{ tieu_de, mo_ta, noi_dung }]);

  if (error) return { error: `Lỗi Database: ${error.message}` };

  revalidatePath("/");
  return { success: true };
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
