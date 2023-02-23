/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccDetailInvalidErr } from './AccDetailInvalidErr';
import type { LoggedInErrResponse } from './LoggedInErrResponse';
import type { RedisError } from './RedisError';
import type { SignupAlreadyExistsErr } from './SignupAlreadyExistsErr';
import type { SuccessfulSignupResponse } from './SuccessfulSignupResponse';

export type SignupResponse = (SuccessfulSignupResponse | SignupAlreadyExistsErr | AccDetailInvalidErr | LoggedInErrResponse | RedisError);

