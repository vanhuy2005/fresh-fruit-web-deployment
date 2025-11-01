// Lấy API_URL từ biến môi trường VITE_API_URL (ưu tiên cho production)
export const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
