export interface TutorialPetRestAuthenticateRequestBody {
    username: string;
    password: string;
}

export interface TutorialPetRestAuthenticateResponse {
    // accessToken?: string;
    // refreshToken?: string;
    token?: string;
    expiresOn?: string;
    expiresIn?: number;
    id?: string;
    user?: any;
}
