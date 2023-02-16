import { LoggedInErrResponse } from "../util/authMiddleware";

interface SuccessfulSignupResponse {
    success: true,
}

export type SignupResponse = SuccessfulSignupResponse | LoggedInErrResponse;

export interface SignupBody {
    username: string,
    password: string,
}