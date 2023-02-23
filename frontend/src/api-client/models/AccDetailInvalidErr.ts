/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ValidationDetails } from './ValidationDetails';

/**
 * AccDetailInvalidErr and give status code 400
 */
export type AccDetailInvalidErr = {
    err: AccDetailInvalidErr.err;
    details: {
        username: ValidationDetails;
        password: ValidationDetails;
    };
};

export namespace AccDetailInvalidErr {

    export enum err {
        VALIDATION_ERR = 'Validation Err',
    }


}

