export default function LoginPage() {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-amber-900">
          Đăng nhập hệ thống Bánh 🥐
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-orange-100">
          {/* Form gọi trực tiếp lên các endpoint xử lý Auth */}
          <form className="space-y-6" method="POST">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                formAction="/api/auth/login"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Đăng nhập
              </button>
              <button
                type="submit"
                formAction="/api/auth/signup"
                className="w-full flex justify-center py-2.5 px-4 border border-amber-700 rounded-lg shadow-sm text-sm font-medium text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Đăng ký mới
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
