/**
 * API Configuration
 * Sử dụng environment variables để cấu hình API base URL
 */

// Lấy API base URL từ environment variable
// Nếu không có, mặc định là localhost:3333 (development)
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Nếu envUrl rỗng hoặc chỉ có '/', sử dụng relative path (qua Nginx proxy)
  if (!envUrl || envUrl === '/') {
    return '/api';
  }
  
  // Nếu envUrl không có protocol, thêm http://
  if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
    return `http://${envUrl}/api`;
  }
  
  // Nếu đã có protocol, thêm /api nếu chưa có
  if (envUrl.endsWith('/api')) {
    return envUrl;
  }
  
  return `${envUrl}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function để tạo full API URL
export const getApiUrl = (endpoint: string): string => {
  // Nếu endpoint đã là full URL, trả về luôn
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // Loại bỏ dấu / ở đầu endpoint nếu có
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Nếu API_BASE_URL đã có /api ở cuối, không cần thêm lại
  if (API_BASE_URL.endsWith('/api')) {
    return `${API_BASE_URL}/${cleanEndpoint}`;
  }
  
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Export các endpoint thường dùng
export const API_ENDPOINTS = {
  USERS: '/users',
  STATS: '/stats',
  HEALTH: '/health',
} as const;

