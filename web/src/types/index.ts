export interface User {
    _id: string
    name: string
    email: string
    password: string
    friends: string[]
    roles: string[]
    matches: string[]
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
    matches: string[]
    __v: number
}

export interface UserLogged {
    user: User
    access_token: string
    refreshToken: string
}

export interface Match {
    _id: string
    name: string
    dayOfWeek: number
    hour: number
    playersLimit: number
    userId: string
    users: string[]
    sportMode: SportMode
    open: boolean
    createdAt: string
    updatedAt: string
    __v: number
    date: string
    location: Location
    formations: Formations
    user: User
    sport: Sport
}

export interface SportMode {
    _id: string
    name: string
    sport: string
    __v: number
    label: string
}

export interface Location {
    location: Location2
    _id: string
    name: string
    address: string
    matches: string[]
    __v: number
}

export interface Location2 {
    type: string
    coordinates: number[]
}

export interface Formations {
    team1: any[]
    team2: Team2[]
}

export interface Team2 {
    position: number
    userId: string
}

export interface User {
    _id: string
    name: string
    email: string
    friends: string[]
    bloquedUsers: any[]
    roles: string[]
    matches: string[]
    groups: any[]
    __v: number
    profile: Profile
}

export interface Profile {
    availability: Availability[]
    preferredZones: any
    preferredSports: string[]
    preferredSportModes: any
}

export interface Availability {
    day: string
    intervals: Interval[]
}

export interface Interval {
    startHour: number
    endHour: number
}

export interface Sport {
    _id: string
    name: string
    __v: number
}
  