declare global {
    enum Role {
        Admin = "admin",
        User = "user",
    }

    interface User {
        name: string;
        email: string;
        friends?: ObjectId[];
        id: ObjectId;
        matches?: ObjectId[];
        roles?: Role[];
        pushToken: string;
    }
}