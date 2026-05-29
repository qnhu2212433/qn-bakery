import React from "react";
import AuthAlert from "./AuthAlert"; // Nhúng component thông báo vừa tạo ở trên

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-emerald-950">
          BakeryLab.
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl shadow-emerald-950/5 sm:rounded-2xl sm:px-10 border border-emerald-100/50">
          {/* Gọi component thông báo lỗi/thành công tự động vào đây */}
          <AuthAlert />

          <form className="space-y-6" method="POST">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email cá nhân
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
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700">
                  Mật khẩu bảo mật
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <input
                name="password"
                type="password"
                required
                className="mt-1.5 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl shadow-sm bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                formAction="/api/auth/login"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
              >
                Đăng nhập hệ thống
              </button>

              <button
                type="submit"
                formAction="/api/auth/signup"
                className="w-full flex justify-center py-2.5 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-emerald-700 bg-white hover:bg-slate-50 transition-all"
              >
                Tạo tài khoản mới
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
