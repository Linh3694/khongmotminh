import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  currentPosition: string | null;
  termsAgreed: boolean;
  createdAt: string;
  updatedAt: string;
}

const Summary = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Kiểm tra authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated || isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3333/api/users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.data || []);
        setTotalCount(data.count || 0);
      } else {
        setError(data.message || 'Không thể tải danh sách người dùng');
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách users:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateForCSV = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const downloadCSV = () => {
    if (users.length === 0) {
      alert('Không có dữ liệu để tải xuống');
      return;
    }

    // Tạo header CSV với BOM để hỗ trợ tiếng Việt trong Excel
    const headers = ['STT', 'Họ và tên', 'Email', 'Số điện thoại', 'Đang học/Công tác tại', 'Thời gian đăng ký'];
    
    // Tạo dữ liệu CSV
    const csvRows = [
      '\uFEFF' + headers.join(','), // BOM để Excel nhận diện UTF-8
      ...users.map((user, index) => {
        const row = [
          index + 1,
          `"${user.fullName.replace(/"/g, '""')}"`, // Escape quotes
          `"${user.email.replace(/"/g, '""')}"`,
          `"${user.phone.replace(/"/g, '""')}"`,
          `"${(user.currentPosition || '').replace(/"/g, '""')}"`,
          `"${formatDateForCSV(user.createdAt)}"`,
        ];
        return row.join(',');
      }),
    ];

    const csvContent = csvRows.join('\n');

    // Tạo blob và download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `danh-sach-ky-cam-ket-${dateStr}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-sans-bold text-gray-900 mb-2 uppercase">
                Tổng hợp người đã ký cam kết
              </h1>
              <p className="text-xl font-sans-normal text-gray-600">
                Tổng số: <span className="font-sans-bold text-[#3500E0]">{totalCount}</span> người
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {!isLoading && users.length > 0 && (
                <button
                  onClick={downloadCSV}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-sans-medium transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Tải xuống CSV
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-sans-medium transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-2xl font-sans-normal text-gray-600">Đang tải dữ liệu...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-red-600">✕</span>
              <span className="text-lg font-sans-normal text-red-800">{error}</span>
            </div>
            <button
              onClick={fetchUsers}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-sans-medium"
            >
              Thử lại
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl font-sans-normal text-gray-600">Chưa có người nào đăng ký.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#3500E0] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-sans-bold uppercase text-sm">STT</th>
                    <th className="px-6 py-4 text-left font-sans-bold uppercase text-sm">Họ và tên</th>
                    <th className="px-6 py-4 text-left font-sans-bold uppercase text-sm">Email</th>
                    <th className="px-6 py-4 text-left font-sans-bold uppercase text-sm">Số điện thoại</th>
                    <th className="px-6 py-4 text-left font-sans-bold uppercase text-sm">Đang học/Công tác tại</th>
                    <th className="px-6 py-4 text-left font-sans-bold uppercase text-sm">Thời gian đăng ký</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-sans-normal text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 font-sans-medium text-gray-900">{user.fullName}</td>
                      <td className="px-6 py-4 font-sans-normal text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 font-sans-normal text-gray-700">{user.phone}</td>
                      <td className="px-6 py-4 font-sans-normal text-gray-700">
                        {user.currentPosition || '-'}
                      </td>
                      <td className="px-6 py-4 font-sans-normal text-gray-600 text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-[#3500E0] text-white rounded-lg hover:bg-[#2a00b3] font-sans-medium transition-colors"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Summary;

