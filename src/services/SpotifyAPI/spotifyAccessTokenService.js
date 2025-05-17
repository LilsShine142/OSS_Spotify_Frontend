import axios from 'axios';
import { spotifyAuthService } from '../../lib/constaints/constants'; // Đảm bảo bạn đã cấu hình CLIENT_ID và CLIENT_SECRET trong file config

// Hàm chính để lấy Access Token
export const getSpotifyAccessToken = async () => {
    try {
        // Tạo body dạng x-www-form-urlencoded
        const body = new URLSearchParams();
        body.append('grant_type', 'client_credentials');
        body.append('client_id', spotifyAuthService.CLIENT_ID);
        body.append('client_secret', spotifyAuthService.CLIENT_SECRET);
        console.log('body', body.toString());
        // Gọi API với Content-Type là x-www-form-urlencoded
        const response = await axios.post(
            spotifyAuthService.SPOTIFY_AUTH_URL,
            body.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        if (!response.data?.access_token) {
            throw new Error('Không nhận được access token từ Spotify');
        }

        return response.data.access_token;

    } catch (error) {
        console.error('Lỗi khi lấy Access Token từ Spotify:', error);
        throw error;
    }
};
