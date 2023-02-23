/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetStatusResponse } from '../models/GetStatusResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StatusService {

    /**
     * Checks the status of the server and additionally checks if you are authenticated. Security is optional.
     * @returns GetStatusResponse Ok
     * @throws ApiError
     */
    public static get(): CancelablePromise<GetStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/status',
        });
    }

}
