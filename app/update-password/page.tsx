import React from "react";
import AuthAlert from "../login/AuthAlert"; // Dùng chung component thông báo sạch

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-emerald-950">
          Khôi phục mật khẩu
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Nhập email tài khoản của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl shadow-emerald-950/5 sm:rounded-2xl sm:px-10 border border-emerald-100/50">
          {/* Nhúng component thông báo lỗi/thành công vào đây */}
          <AuthAlert />

          <form
            className="space-y-6"
            action="/api/auth/forgot-password"
            method="POST"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email đã đăng ký
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-1.5 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl shadow-sm bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
              >
                Gửi liên kết xác nhận
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-all"
            >
              ← Quay lại đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
