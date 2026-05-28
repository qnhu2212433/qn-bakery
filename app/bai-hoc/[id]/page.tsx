import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import CommentSection from "@/app/components/CommentSection"; // Chúng ta sẽ tạo component này ở dưới

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface Props {
  params: { id: string };
}

export default async function BaiHocDetailPage({ params }: Props) {
  const { id } = params;

  // Lấy chi tiết bài học
  const { data: baiHoc } = await supabase
    .from("bai_hoc")
    .select("*")
    .eq("id", id)
    .single();

  if (!baiHoc) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-amber-950 mb-4">
        {baiHoc.tieu_de}
      </h1>
      <p className="text-gray-600 italic mb-6">{baiHoc.mo_ta}</p>

      <img
        src={
          baiHoc.hinh_anh ||
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800"
        }
        alt={baiHoc.tieu_de}
        className="w-full h-96 object-cover rounded-xl mb-8"
      />

      <div className="prose max-w-none mb-12 bg-white p-6 border rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-orange-800 mb-4">
          Hướng dẫn thực hiện:
        </h2>
        <div className="whitespace-pre-line text-gray-700">
          {baiHoc.noi_dung}
        </div>
      </div>

      <hr className="my-8" />

      {/* Khu vực bình luận sử dụng Client Component + Realtime */}
      <CommentSection baiHocId={id} />
    </div>
  );
}
