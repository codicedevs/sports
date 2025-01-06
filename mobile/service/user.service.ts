
import Petition from "../types/petition.type";
import { UserPreferences } from "../types/preferences.type";
import { User } from "../types/user.type";
import { HttpService } from "./http.service";

class UserService extends HttpService {
  constructor() {
    super("users");
  }

  getAll = async () => {
    const res = await this.get(`/`);
    return res.data;
  };

  getUserById = async (id: string) => {
    return this.get(`/${id}`);
  };

  getUserFriends = (id: string) => {
    return this.get(`${id}/friends`);
  };

  updatePreferences = (profile: UserPreferences) => {
    return this.put("6720ef393a78ebc10564e987", profile);
  }

  getUserPetitions = async (userId: string): Promise<Petition[]> => {
    const response = await this.get(`/${userId}/petitions`);
    return response.data;
  };

  getUsersByName = async (name: string): Promise<User[]> => {
    try {
      const response = await this.get(`/search/find?name=${name}`);
      return response.data; // Devuelve directamente los datos de los usuarios
    } catch (error) {
      console.error("Error buscando usuarios por nombre:", error);
      throw error; // Lanza el error para manejarlo en el frontend
    }
  };

  getUserMatches = async (userId: string) => {
    return this.get(`${userId}/matches`);
  };

  createUser = async (body: User) => {
    return this.post(`/register`, body);
  };

  editUser = async ({ id, ...body }: { id: string; body: User }) => {
    return this.put(`/edit/${id}`, body);
  };

  updatePushToken = async (id: string, pushToken: string) => {
    return this.patch(`/update-push-token/${id}/`, { pushToken });
  };

  changePassword = async ({
    currentPass,
    newPass,
  }: {
    currentPass: string;
    newPass: string;
  }) => {
    return this.post(`/changePass`, {
      currentPass: currentPass,
      newPass: newPass,
    });
  };
}

export default new UserService();
