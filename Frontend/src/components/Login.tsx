import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Kiểm tra thông tin đăng nhập
    if (username === 'breakpoint' && password === 'QWER1234!@#$') {
      // Lưu trạng thái đăng nhập vào localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTime', new Date().toISOString());
      
      // Chuyển hướng đến trang summary
      navigate('/summary');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3500E0] to-[#2a00b3] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-sans-bold text-gray-900 mb-2 uppercase">
            Đăng nhập
          </h1>
          <p className="text-gray-600 font-sans-normal">
            Vui lòng đăng nhập để xem dữ liệu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-red-600">✕</span>
                <span className="text-sm font-sans-normal text-red-800">{error}</span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-sans-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3500E0] focus:border-transparent font-sans-normal"
              placeholder="Nhập tên đăng nhập"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-sans-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3500E0] focus:border-transparent font-sans-normal"
              placeholder="Nhập mật khẩu"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3500E0] text-white py-3 rounded-lg hover:bg-[#2a00b3] font-sans-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-[#3500E0] font-sans-normal"
          >
            ← Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;


