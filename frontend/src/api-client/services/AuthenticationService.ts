/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginReqBody } from '../models/LoginReqBody';
import type { SessionInfoResponse } from '../models/SessionInfoResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthenticationService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Allows a client to login provided a username and password, required they are not currently logged in
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public login(
        requestBody: LoginReqBody,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/authentication/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The Password Is Wrong`,
                404: `Account Doesn't Exist`,
            },
        });
    }

    /**
     * Logs the client out using clear cookie, returning an error if no sessionToken exists.
     * @returns any Ok
     * @throws ApiError
     */
    public logout(): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/authentication/logout',
        });
    }

    /**
     * Gets information about the current session, returning a unauthorized response if no session exists.
     * @returns SessionInfoResponse Ok
     * @throws ApiError
     */
    public getSessionInfo(): CancelablePromise<SessionInfoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/authentication/session',
        });
    }

}
