import userModel from '../models/user_model';

export const createUser = async (email: string, hashedPassword: string) => {
    return userModel.create({ email, password: hashedPassword });
};

export const findUserByEmail = async (email: string) => {
    return userModel.findOne({ email });
};

export const findUserById = async (id: string) => {
    return userModel.findById(id);
};

export const saveUser = async (user: any) => {
    return user.save();
};