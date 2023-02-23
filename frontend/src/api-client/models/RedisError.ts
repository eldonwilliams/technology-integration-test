/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A Error that occurs because of Redis, should have status of 500.
 * Also see the RedisError constant.
 */
export type RedisError = {
    err: RedisError.err;
};

export namespace RedisError {

    export enum err {
        REDIS_FAILURE = 'Redis Failure',
    }


}

