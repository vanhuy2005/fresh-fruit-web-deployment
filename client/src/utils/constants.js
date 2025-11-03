// Lấy API_URL từ biến môi trường VITE_API_URL, fallback về localhost nếu undefined
let baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
if (baseUrl.endsWith("/")) {
	baseUrl = baseUrl.slice(0, -1);
}
export const API_URL = `${baseUrl}/api/v1`;
