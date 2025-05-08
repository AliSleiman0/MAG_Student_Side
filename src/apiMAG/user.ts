import api from './api';

// Interfaces
export interface Advisor {
    userid: number;
    fullname: string;
    email: string;
    image: string;
}

export interface LoginInput {
    userid: number;
    password: string;
}

export interface LoginResponse {
    token: string;
    usertype: string;
}

export interface UserProfile {
    userid: number;
    fullname: string;
    email: string;
    campusname: string;
    department: string;
    schoolname: string;
    image: string;
}

export interface UpdatePasswordInput {
    password: string;
    password_confirmation: string;
}

export interface AddImageInput {
    imagepath: string;
}

// API Functions
export const login = async (credentials: LoginInput): Promise<LoginResponse> => {
    try {
        const response = await api.post('/login', credentials);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        throw new Error(errorMessage);
    }
};

export const logout = async (): Promise<string> => {
    try {
        const response = await api.post('/logout');
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Logout failed';
        throw new Error(errorMessage);
    }
};

export const showProfile = async (): Promise<UserProfile> => {
    try {
        const response = await api.get('/profile');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
        throw new Error(errorMessage);
    }
};

export const deleteImage = async (): Promise<string> => {
    try {
        const response = await api.put('/profile/deleteimage');
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to delete image';
        throw new Error(errorMessage);
    }
};

export const addImage = async (data: AddImageInput): Promise<string> => {
    try {
        const response = await api.put('/profile/addimage/', data);
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to add image';
        throw new Error(errorMessage);
    }
};

export const resetPassword = async (data: UpdatePasswordInput): Promise<string> => {
    try {
        const response = await api.put('/profile/updatepassword/', data);
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Password reset failed';
        throw new Error(errorMessage);
    }
};

export const getRespectiveAdvisors = async (): Promise<Advisor[]> => {
    try {
        const response = await api.get('/getadvisors');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch advisors';
        throw new Error(errorMessage);
    }
};