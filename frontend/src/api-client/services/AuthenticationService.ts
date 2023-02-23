/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GenericSuccessResponse } from '../models/GenericSuccessResponse';
import type { LoginBody } from '../models/LoginBody';
import type { RedisError } from '../models/RedisError';
import type { SessionInfo } from '../models/SessionInfo';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthenticationService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Allows a client to login provided a username and password, required they are not currently logged in
     * @param requestBody
     * @returns any You have been logged in
     * @throws ApiError
     */
    public login(
        requestBody: LoginBody,
    ): CancelablePromise<GenericSuccessResponse> {
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
     * @returns any You have been logged out
     * @throws ApiError
     */
    public logout(): CancelablePromise<GenericSuccessResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/authentication/logout',
            errors: {
                401: `You can't log out without being logged in!`,
            },
        });
    }

    /**
     * Gets information about the current session, returning a unauthorized response if no session exists.
     * @returns any Session info has been returned
     * @throws ApiError
     */
    public getSessionInfo(): CancelablePromise<(SessionInfo | RedisError)> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/authentication/session',
        });
    }

}
