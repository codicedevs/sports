export interface UserInfo {
    username: string;
    pass: string;
}

export interface IUser {
    _id: number,
    documento: string,
    nombre: string,
    username: string,
    pass: string,
    accountId: string,
    email: string,
    telefono: string,
    resetKey: string,
    resetKeyTimeStamp: string
}

export interface User {
    documento: string,
    nombre: string,
    username: string,
    pass: string,
    accountId: string,
    email: string,
    telefono: string,
    isActive: boolean
}