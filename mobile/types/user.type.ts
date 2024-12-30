export interface UserInfo {
    password: string;
    email: string;
  }
  
  export interface IUser {
    _id: number;
    name: string;
    email: string;
    password: string;
    friends: User[];
    resetKey: string;
    resetKeyTimeStamp: string;
  }
  
  export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    friends: User[];
  }

  // Interfaz principal para los datos de autenticación
export interface AuthSSOData {
  idToken: string | null;
  scopes: string[];
  serverAuthCode: string | null;
  user: UserData;
  type: 'success' | 'error';
}

// Interfaz para los datos del usuario
interface UserData {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photo: string | null;
}
