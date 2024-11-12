import {User} from '../models/user';

let users: User[] = [];
export const getAllUsers = async (): Promise<User[]> => {
    return users;
};


export const addUser = async (user: User): Promise<User> => {
    user.id = users.length + 1;
    users.push(user);
    return user;
};
