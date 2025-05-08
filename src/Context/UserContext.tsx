
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { LoginInput, UpdatePasswordInput, AddImageInput, logout, showProfile,  addImage, deleteImage, resetPassword, LoginResponse, login, UserProfile } from '../apiMAG/user';
import { setAuthToken } from '../apiMAG/api';


// ----- Context Types -----
interface UserContextState {
    token: string | null;
    usertype: string | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    loginUser: (credentials: LoginInput) => Promise<void>;
    logoutUser: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updatePassword: (input: UpdatePasswordInput) => Promise<string>;
    uploadImage: (input: AddImageInput) => Promise<string>;
    removeImage: () => Promise<string>;
}

const UserContext = createContext<UserContextState | undefined>(undefined);

// ----- Provider Props -----
interface UserProviderProps {
    children: ReactNode;
}

// ----- Provider Component -----
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [usertype, setUsertype] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Perform login and load profile
    const loginUser = async (credentials: LoginInput) => {
       
        setLoading(true);
        setError(null);
        try {
            const data: LoginResponse = await login(credentials);
            setAuthToken(data.token);
       
            setToken(data.token);
            setUsertype(data.usertype);
            // store token in api.setAuthHeader if needed
            await refreshProfile();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout and clear state
    const logoutUser = async () => {
        setLoading(true);
        setError(null);
        try {
            await logout();
            setAuthToken(null);
            setToken(null);
            setProfile(null);
           
            setUsertype(null);
           
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Fetch profile
    const refreshProfile = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data: UserProfile = await showProfile();
            setProfile(data);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const updatePassword = async (input: UpdatePasswordInput): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const res = await resetPassword(input);
            return res ?? 'Error';
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Add profile image
    const uploadImage = async (input: AddImageInput): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const res = await addImage(input);
            await refreshProfile();
            return res ?? 'Error';
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete profile image
    const removeImage = async (): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const res = await deleteImage();
            await refreshProfile();
            return res ?? 'Error';
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Effect: Optionally, load token from localStorage on mount and fetch profile
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUsertype = localStorage.getItem('authUsertype');
        if (storedToken) {
            setAuthToken(storedToken);
            setToken(storedToken);
            setUsertype(storedUsertype);
            refreshProfile().catch(() => { });
        }
    }, []);

    // Persist token to storage when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
            if (usertype) localStorage.setItem('authUsertype', usertype);
            // api.setAuthHeader(token);
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUsertype');
        }
    }, [token, usertype]);

    return (
        <UserContext.Provider
            value={{
                token,
                usertype,
                profile,
                loading,
                error,
                loginUser,
                logoutUser,
                refreshProfile,
                updatePassword,
                uploadImage,
                removeImage,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// ----- Custom Hook -----
export const useUser = (): UserContextState => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
