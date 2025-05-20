import axios from 'axios';

export const getSpotifyAccessToken = async () => {
    try {
        // 1. Tạo Basic Auth token từ biến môi trường (dùng import.meta.env thay vì process.env)
        const authString = `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`;
        const base64Auth = btoa(authString); // Sử dụng btoa vì chạy ở client-side

        // 2. Gọi API Spotify
        const response = await axios.post(
            import.meta.env.VITE_SPOTIFY_AUTH_URL,
            new URLSearchParams({ grant_type: 'client_credentials' }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${base64Auth}`
                }
            }
        );

        if (!response.data?.access_token) {
            throw new Error('Không nhận được access token từ Spotify');
        }

        return response.data.access_token;

    } catch (error) {
        console.error('[Spotify Auth Error]', {
            status: error.response?.status,
            error: error.response?.data ?? error.message
        });
        throw new Error('Xác thực Spotify thất bại: ' + (error.response?.data?.error_description || error.message));
    }
};