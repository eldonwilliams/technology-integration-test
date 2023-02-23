/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AccountService } from './services/AccountService';
import { AuthenticationService } from './services/AuthenticationService';
import { SpecService } from './services/SpecService';
import { StatusService } from './services/StatusService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class FarmIdleBackend {

    public readonly account: AccountService;
    public readonly authentication: AuthenticationService;
    public readonly spec: SpecService;
    public readonly status: StatusService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.account = new AccountService(this.request);
        this.authentication = new AuthenticationService(this.request);
        this.spec = new SpecService(this.request);
        this.status = new StatusService(this.request);
    }
}

