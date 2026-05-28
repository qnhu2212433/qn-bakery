"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Định nghĩa kiểu dữ liệu chuẩn TypeScript theo yêu cầu đề cương
interface BinhLuan {
  id: number;
  id_baihoc: number;
  noi_dung: string;
  created_at: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function CommentSection({ baiHocId }: { baiHocId: string }) {
  const [comments, setComments] = useState<BinhLuan[]>([]);
  const [newComment, setNewComment] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(0); // Dùng để kích hoạt tải lại bình luận an toàn

  // Luồng xử lý dữ liệu tập trung - Đảm bảo không bị lặp render
  useEffect(() => {
    // 1. Hàm lấy danh sách bình luận cũ từ Database
    const fetchComments = async () => {
      const { data } = await supabase
        .from("binh_luan")
        .select("*")
        .eq("id_baihoc", baiHocId)
        .order("created_at", { ascending: false });

      if (data) {
        setComments(data as BinhLuan[]);
      }
    };

    fetchComments();

    // 2. Lắng nghe sự kiện Realtime cập nhật tự động (Tính năng bổ sung của Supabase)
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "binh_luan",
          filter: `id_baihoc=eq.${baiHocId}`,
        },
        (payload) => {
          const newCommentData = payload.new as BinhLuan;
          setComments((prev) => [newCommentData, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [baiHocId, triggerFetch]);

  // 3. Xử lý khi nhấn nút gửi bình luận mới
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from("binh_luan")
      .insert([{ id_baihoc: Number(baiHocId), noi_dung: newComment }]);

    if (!error) {
      setNewComment("");
      setTriggerFetch((prev) => prev + 1); // Kích hoạt useEffect tải lại dữ liệu an toàn
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl border mt-8">
      <h3 className="text-lg font-bold text-amber-950 mb-4">
        Hỏi đáp & Bình luận công thức
      </h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          rows={3}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
          placeholder="Bạn có thắc mắc gì về công thức làm bánh này không?..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-lg transition"
        >
          Gửi bình luận
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white p-4 rounded-lg border shadow-sm"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-amber-800">
                Học viên ẩn danh
              </span>
              <span className="text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <p className="text-sm text-gray-700">{comment.noi_dung}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
