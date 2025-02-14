export interface User {
    _id: string
    name: string
    email: string
    password: string
    friends: User[]
    roles: string[]
    matches: []
    __v: number
}

export interface Match {
    _id: string
    name: string
    date: string
    dayOfWeek: number
    hour: number
    location: Location
    playersLimit: number
    userId: string
    users: User[]
    sportMode: string
    open: boolean
    __v: number
}

export interface Location {
    location: {
        type: string
        coordinates: number[]
    }
    _id: string
    name: string
    address: string
    matches: Match[]
    __v: number
}

export interface UserLogged {
    user: User
    access_token: string
    refreshToken: string
}