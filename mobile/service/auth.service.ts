import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { HttpService } from "./http.service";

interface LoginProps {
    token: string;
    refreshToken: string;
    user: any;
}

export class AuthService extends HttpService {
    constructor() {
        super("auth");
    }

    login = async (username: string, password: string) => {
        let loginProps: LoginProps | null = null;
        try {
            const res = await axios.post<LoginProps>(`${BASE_URL}/auth/login`, { username, pass: password });
            this.saveAccessToken(res.data.token);
            this.saveRefreshToken(res.data.refreshToken);
            loginProps = res.data;
        } catch (err) {
            console.error(err);
        } finally {
            return loginProps;
        }
    };

    signOut = async () => {
        await AsyncStorage.removeItem('access');
        await AsyncStorage.removeItem('refresh');
    };

    whoami = async () => {
        return this.get("whoami");
    };
}

export default new AuthService();
