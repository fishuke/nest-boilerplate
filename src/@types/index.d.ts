export {};

declare global {
    interface JwtPayload {
        iss: string;
        iat: number;
        exp: number;
    }
}
