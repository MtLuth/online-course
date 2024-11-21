"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProfileData {
    email: string;
    fullName: string;
    phoneNumber: string;
    avt: string;
}

interface ProfileContextProps {
    profileData: ProfileData;
    setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profileData, setProfileData] = useState<ProfileData>({
        email: "",
        fullName: "Người dùng",
        phoneNumber: "",
        avt: "https://via.placeholder.com/100",
    });

    return (
        <ProfileContext.Provider value={{ profileData, setProfileData }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfileContext must be used within a ProfileProvider");
    }
    return context;
};
