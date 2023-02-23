/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetStatusResponse } from '../models/GetStatusResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class StatusService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Checks the status of the server and additionally checks if you are authenticated. Security is optional.
     * @returns GetStatusResponse Ok
     * @throws ApiError
     */
    public get(): CancelablePromise<GetStatusResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status',
        });
    }

}
