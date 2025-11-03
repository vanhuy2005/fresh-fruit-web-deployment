// Lấy API_URL từ biến môi trường VITE_API_URL, fallback về localhost nếu undefined
let envUrl = import.meta.env.VITE_API_URL;
let baseUrl = (envUrl && envUrl.trim().length > 0) ? envUrl.trim() : "http://localhost:3000";
if (baseUrl.endsWith("/")) {
	baseUrl = baseUrl.slice(0, -1);
}
export const API_URL = `${baseUrl}/api/v1`;
