export declare const authClient: {
    admin: {
        setRole: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                userId: string;
                role: "user" | "admin" | ("user" | "admin")[];
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            userId: string;
            role: "user" | "admin" | ("user" | "admin")[];
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            user: import("better-auth/plugins").UserWithRole;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        createUser: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                email: string;
                password: string;
                name: string;
                role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                data?: Record<string, any>;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            email: string;
            password: string;
            name: string;
            role?: "user" | "admin" | ("user" | "admin")[] | undefined;
            data?: Record<string, any>;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            user: import("better-auth/plugins").UserWithRole;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        listUsers: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: undefined;
            query?: (Partial<{
                searchValue?: string | undefined;
                searchField?: "name" | "email" | undefined;
                searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
                limit?: string | number | undefined;
                offset?: string | number | undefined;
                sortBy?: string | undefined;
                sortDirection?: "asc" | "desc" | undefined;
                filterField?: string | undefined;
                filterValue?: string | number | boolean | undefined;
                filterOperator?: "lt" | "eq" | "ne" | "lte" | "gt" | "gte" | "contains" | undefined;
            }> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            query: {
                searchValue?: string | undefined;
                searchField?: "name" | "email" | undefined;
                searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
                limit?: string | number | undefined;
                offset?: string | number | undefined;
                sortBy?: string | undefined;
                sortDirection?: "asc" | "desc" | undefined;
                filterField?: string | undefined;
                filterValue?: string | number | boolean | undefined;
                filterOperator?: "lt" | "eq" | "ne" | "lte" | "gt" | "gte" | "contains" | undefined;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<NonNullable<{
            users: import("better-auth/plugins").UserWithRole[];
            total: number;
            limit: number | undefined;
            offset: number | undefined;
        } | {
            users: never[];
            total: number;
        }>, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        listUserSessions: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                userId: string;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            userId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            sessions: {
                id: string;
                token: string;
                userId: string;
                expiresAt: Date;
                createdAt: Date;
                updatedAt: Date;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            }[];
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        unbanUser: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                userId: string;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            userId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            user: any;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        banUser: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                userId: string;
                banReason?: string | undefined;
                banExpiresIn?: number | undefined;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            userId: string;
            banReason?: string | undefined;
            banExpiresIn?: number | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            user: any;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        impersonateUser: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                userId: string;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            userId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            session: {
                id: string;
                token: string;
                userId: string;
                expiresAt: Date;
                createdAt: Date;
                updatedAt: Date;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: {
                id: string;
                name: string;
                emailVerified: boolean;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | null | undefined;
            };
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        stopImpersonating: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0?: import("better-auth/*").Prettify<{
            query?: Record<string, any> | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            session: import("better-auth/*").Session & Record<string, any>;
            user: import("better-auth/*").User & Record<string, any>;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        revokeUserSession: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                sessionToken: string;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            sessionToken: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            success: boolean;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        revokeUserSessions: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                userId: string;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            userId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            success: boolean;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        removeUser: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                userId: string;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            userId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            success: boolean;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        setUserPassword: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                userId: string;
                newPassword: string;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            userId: string;
            newPassword: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            status: boolean;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    admin: {
        hasPermission: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<({
                permission: {
                    readonly user?: ("list" | "create" | "set-role" | "ban" | "impersonate" | "delete" | "set-password")[] | undefined;
                    readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                };
                permissions?: never;
            } | {
                permissions: {
                    readonly user?: ("list" | "create" | "set-role" | "ban" | "impersonate" | "delete" | "set-password")[] | undefined;
                    readonly session?: ("list" | "delete" | "revoke")[] | undefined;
                };
                permission?: never;
            }) & {
                userId?: string;
                role?: "user" | "admin" | undefined;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<(({
            permission: {
                readonly user?: ("list" | "create" | "set-role" | "ban" | "impersonate" | "delete" | "set-password")[] | undefined;
                readonly session?: ("list" | "delete" | "revoke")[] | undefined;
            };
            permissions?: never;
        } | {
            permissions: {
                readonly user?: ("list" | "create" | "set-role" | "ban" | "impersonate" | "delete" | "set-password")[] | undefined;
                readonly session?: ("list" | "delete" | "revoke")[] | undefined;
            };
            permission?: never;
        }) & {
            userId?: string;
            role?: "user" | "admin" | undefined;
        }) & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            error: null;
            success: boolean;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    signIn: {
        social: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom" | (string & {});
                callbackURL?: string | undefined;
                newUserCallbackURL?: string | undefined;
                errorCallbackURL?: string | undefined;
                disableRedirect?: boolean | undefined;
                idToken?: {
                    token: string;
                    nonce?: string | undefined;
                    accessToken?: string | undefined;
                    refreshToken?: string | undefined;
                    expiresAt?: number | undefined;
                } | undefined;
                scopes?: string[] | undefined;
                requestSignUp?: boolean | undefined;
                loginHint?: string | undefined;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom" | (string & {});
            callbackURL?: string | undefined;
            newUserCallbackURL?: string | undefined;
            errorCallbackURL?: string | undefined;
            disableRedirect?: boolean | undefined;
            idToken?: {
                token: string;
                nonce?: string | undefined;
                accessToken?: string | undefined;
                refreshToken?: string | undefined;
                expiresAt?: number | undefined;
            } | undefined;
            scopes?: string[] | undefined;
            requestSignUp?: boolean | undefined;
            loginHint?: string | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<NonNullable<{
            redirect: boolean;
            token: string;
            url: undefined;
            user: {
                id: string;
                email: string;
                name: string;
                image: string | null | undefined;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } | {
            url: string;
            redirect: boolean;
        }>, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    getSession: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<{
            disableCookieCache?: string | boolean | undefined;
            disableRefresh?: string | boolean | undefined;
        }> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0?: import("better-auth/*").Prettify<{
        query?: {
            disableCookieCache?: string | boolean | undefined;
            disableRefresh?: string | boolean | undefined;
        } | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        user: {
            id: string;
            name: string;
            emailVerified: boolean;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | null | undefined | undefined;
            banned: boolean | null | undefined;
            role?: string | null | undefined;
            banReason?: string | null | undefined;
            banExpires?: Date | null | undefined;
        };
        session: {
            id: string;
            token: string;
            userId: string;
            expiresAt: Date;
            createdAt: Date;
            updatedAt: Date;
            ipAddress?: string | null | undefined | undefined;
            userAgent?: string | null | undefined | undefined;
            impersonatedBy?: string | null | undefined;
        };
    } | null, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    signOut: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0?: import("better-auth/*").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        success: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    signIn: {
        email: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                email: string;
                password: string;
                callbackURL?: string | undefined;
                rememberMe?: boolean | undefined;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            email: string;
            password: string;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            redirect: boolean;
            token: string;
            url: string | undefined;
            user: {
                id: string;
                email: string;
                name: string;
                image: string | null | undefined;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    forgetPassword: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            email: string;
            redirectTo?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        email: string;
        redirectTo?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    resetPassword: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            newPassword: string;
            token?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<{
            token?: string | undefined;
        }> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        newPassword: string;
        token?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    verifyEmail: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<{
            token: string;
            callbackURL?: string | undefined;
        }> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        query: {
            token: string;
            callbackURL?: string | undefined;
        };
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<NonNullable<void | {
        status: boolean;
        user: {
            id: any;
            email: any;
            name: any;
            image: any;
            emailVerified: any;
            createdAt: any;
            updatedAt: any;
        };
    } | {
        status: boolean;
        user: null;
    }>, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    sendVerificationEmail: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            email: string;
            callbackURL?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        email: string;
        callbackURL?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    changeEmail: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            newEmail: string;
            callbackURL?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        newEmail: string;
        callbackURL?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    changePassword: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            newPassword: string;
            currentPassword: string;
            revokeOtherSessions?: boolean | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        newPassword: string;
        currentPassword: string;
        revokeOtherSessions?: boolean | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        token: string | null;
        user: {
            id: string;
            email: string;
            name: string;
            image: string | null | undefined;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    deleteUser: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            callbackURL?: string | undefined;
            token?: string | undefined;
            password?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0?: import("better-auth/*").Prettify<{
        callbackURL?: string | undefined;
        token?: string | undefined;
        password?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        success: boolean;
        message: string;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    resetPassword: {
        ":token": <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: undefined;
            query?: (Partial<{
                callbackURL: string;
            }> & Record<string, any>) | undefined;
            params?: {
                token: string;
            } | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            query: {
                callbackURL: string;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<never, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    requestPasswordReset: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            email: string;
            redirectTo?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        email: string;
        redirectTo?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    resetPassword: {
        ":token": <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: undefined;
            query?: (Partial<{
                callbackURL: string;
            }> & Record<string, any>) | undefined;
            params?: {
                token: string;
            } | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            query: {
                callbackURL: string;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<never, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    revokeSession: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            token: string;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        token: string;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    revokeSessions: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0?: import("better-auth/*").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    revokeOtherSessions: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0?: import("better-auth/*").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    linkSocial: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom" | (string & {});
            callbackURL?: string | undefined;
            errorCallbackURL?: string | undefined;
            idToken?: {
                token: string;
                nonce?: string | undefined;
                accessToken?: string | undefined;
                refreshToken?: string | undefined;
                scopes?: string[] | undefined;
            } | undefined;
            scopes?: string[] | undefined;
            requestSignUp?: boolean | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom" | (string & {});
        callbackURL?: string | undefined;
        errorCallbackURL?: string | undefined;
        idToken?: {
            token: string;
            nonce?: string | undefined;
            accessToken?: string | undefined;
            refreshToken?: string | undefined;
            scopes?: string[] | undefined;
        } | undefined;
        scopes?: string[] | undefined;
        requestSignUp?: boolean | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        url: string;
        redirect: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    listAccounts: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0?: import("better-auth/*").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        id: string;
        provider: string;
        createdAt: Date;
        updatedAt: Date;
        accountId: string;
        scopes: string[];
    }[], {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    deleteUser: {
        callback: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: undefined;
            query?: (Partial<{
                token: string;
                callbackURL?: string | undefined;
            }> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            query: {
                token: string;
                callbackURL?: string | undefined;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
            success: boolean;
            message: string;
        }, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    unlinkAccount: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            providerId: string;
            accountId?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        providerId: string;
        accountId?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    refreshToken: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            providerId: string;
            accountId?: string | undefined;
            userId?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<import("better-auth/*").OAuth2Tokens, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    getAccessToken: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            providerId: string;
            accountId?: string | undefined;
            userId?: string | undefined;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        accessToken: string | undefined;
        accessTokenExpiresAt: Date | undefined;
        scopes: string[];
        idToken: string | undefined;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    accountInfo: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<{
            accountId: string;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0: import("better-auth/*").Prettify<{
        accountId: string;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        user: {
            id: string;
            name?: string;
            email?: string | null;
            image?: string;
            emailVerified: boolean;
        };
        data: Record<string, any>;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    signUp: {
        email: <FetchOptions extends {
            credentials?: RequestCredentials | undefined;
            method?: string | undefined;
            headers?: (HeadersInit & (HeadersInit | {
                accept: "application/json" | "text/plain" | "application/octet-stream";
                "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
                authorization: "Bearer" | "Basic";
            })) | undefined;
            cache?: RequestCache | undefined;
            integrity?: string | undefined;
            keepalive?: boolean | undefined;
            mode?: RequestMode | undefined;
            priority?: RequestPriority | undefined;
            redirect?: RequestRedirect | undefined;
            referrer?: string | undefined;
            referrerPolicy?: ReferrerPolicy | undefined;
            signal?: (AbortSignal | null) | undefined;
            window?: null | undefined;
            onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
            onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
            onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
            onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
            onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
            hookOptions?: {
                cloneResponse?: boolean;
            } | undefined;
            timeout?: number | undefined;
            customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
            plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
            baseURL?: string | undefined;
            throw?: boolean | undefined;
            auth?: ({
                type: "Bearer";
                token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
            } | {
                type: "Basic";
                username: string | (() => string | undefined) | undefined;
                password: string | (() => string | undefined) | undefined;
            } | {
                type: "Custom";
                prefix: string | (() => string | undefined) | undefined;
                value: string | (() => string | undefined) | undefined;
            }) | undefined;
            body?: (Partial<{
                name: string;
                email: string;
                password: string;
                callbackURL?: string;
            }> & Record<string, any>) | undefined;
            query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
            params?: Record<string, any> | undefined;
            duplex?: "full" | "half" | undefined;
            jsonParser?: ((text: string) => Promise<any> | any) | undefined;
            retry?: import("@better-fetch/fetch").RetryOptions | undefined;
            retryAttempt?: number | undefined;
            output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
            errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
            disableValidation?: boolean | undefined;
        }>(data_0: import("better-auth/*").Prettify<{
            email: string;
            name: string;
            password: string;
            image?: string;
            callbackURL?: string;
            fetchOptions?: FetchOptions | undefined;
        } & {} & {}>, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<NonNullable<{
            token: null;
            user: {
                id: string;
                email: string;
                name: string;
                image: string | null | undefined;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } | {
            token: string;
            user: {
                id: string;
                email: string;
                name: string;
                image: string | null | undefined;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        }>, {
            code?: string;
            message?: string;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    updateUser: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: (Partial<Partial<{}> & {
            name?: string;
            image?: string;
        }> & Record<string, any>) | undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0?: import("better-auth/*").Prettify<{
        image?: string | null;
        name?: string;
        fetchOptions?: FetchOptions | undefined;
    } & Partial<{} & {}>> | undefined, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    listSessions: <FetchOptions extends {
        credentials?: RequestCredentials | undefined;
        method?: string | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        cache?: RequestCache | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        window?: null | undefined;
        onRequest?: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse?: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl?: import("@better-fetch/fetch").FetchEsque | undefined;
        plugins?: import("@better-fetch/fetch").BetterFetchPlugin[] | undefined;
        baseURL?: string | undefined;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: undefined;
        query?: (Partial<Record<string, any>> & Record<string, any>) | undefined;
        params?: Record<string, any> | undefined;
        duplex?: "full" | "half" | undefined;
        jsonParser?: ((text: string) => Promise<any> | any) | undefined;
        retry?: import("@better-fetch/fetch").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
    }>(data_0?: import("better-auth/*").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("@better-fetch/fetch").BetterFetchResponse<import("better-auth/*").Prettify<{
        token: string;
        expiresAt: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        ipAddress?: string | null | undefined | undefined;
        userAgent?: string | null | undefined | undefined;
    }>[], {
        code?: string;
        message?: string;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    admin: {
        checkRolePermission: <R extends "user" | "admin">(data: ({
            permission: {
                readonly user?: ("list" | "create" | "set-role" | "ban" | "impersonate" | "delete" | "set-password")[] | undefined;
                readonly session?: ("list" | "delete" | "revoke")[] | undefined;
            };
            permissions?: never;
        } | {
            permissions: {
                readonly user?: ("list" | "create" | "set-role" | "ban" | "impersonate" | "delete" | "set-password")[] | undefined;
                readonly session?: ("list" | "delete" | "revoke")[] | undefined;
            };
            permission?: never;
        }) & {
            role: R;
        }) => boolean;
    };
} & {
    useSession: import("nanostores/atom").Atom<{
        data: {
            user: {
                id: string;
                name: string;
                emailVerified: boolean;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | null | undefined | undefined;
                banned: boolean | null | undefined;
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            };
            session: {
                id: string;
                token: string;
                userId: string;
                expiresAt: Date;
                createdAt: Date;
                updatedAt: Date;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
                impersonatedBy?: string | null | undefined;
            };
        } | null;
        error: import("@better-fetch/fetch").BetterFetchError | null;
        isPending: boolean;
    }>;
    $fetch: import("@better-fetch/fetch").BetterFetch<{
        plugins: (import("@better-fetch/fetch").BetterFetchPlugin | {
            id: string;
            name: string;
            hooks: {
                onSuccess(context: import("@better-fetch/fetch").SuccessContext<any>): void;
            };
        })[];
        cache?: RequestCache;
        credentials?: RequestCredentials;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        integrity?: string;
        keepalive?: boolean;
        method: string;
        mode?: RequestMode;
        priority?: RequestPriority;
        redirect?: RequestRedirect;
        referrer?: string;
        referrerPolicy?: ReferrerPolicy;
        signal?: AbortSignal | null;
        window?: null;
        onRequest?: <T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void;
        onResponse?: (context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void;
        onSuccess?: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError?: (context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void;
        onRetry?: (response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void;
        hookOptions?: {
            cloneResponse?: boolean;
        };
        timeout?: number;
        customFetchImpl: import("@better-fetch/fetch").FetchEsque;
        baseURL: string;
        throw?: boolean;
        auth?: {
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        };
        body?: any;
        query?: any;
        params?: any;
        duplex?: "full" | "half";
        jsonParser: (text: string) => Promise<any> | any;
        retry?: import("@better-fetch/fetch").RetryOptions;
        retryAttempt?: number;
        output?: import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File;
        errorSchema?: import("@better-fetch/fetch").StandardSchemaV1;
        disableValidation?: boolean;
    }, unknown, unknown, {}>;
    $store: {
        notify: (signal?: Omit<string, "$sessionSignal"> | "$sessionSignal") => void;
        listen: (signal: Omit<string, "$sessionSignal"> | "$sessionSignal", listener: (value: boolean, oldValue?: boolean | undefined) => void) => void;
        atoms: Record<string, import("nanostores/atom").WritableAtom<any>>;
    };
    $Infer: {
        Session: {
            user: {
                id: string;
                name: string;
                emailVerified: boolean;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | null | undefined | undefined;
                banned: boolean | null | undefined;
                role?: string | null | undefined;
                banReason?: string | null | undefined;
                banExpires?: Date | null | undefined;
            };
            session: {
                id: string;
                token: string;
                userId: string;
                expiresAt: Date;
                createdAt: Date;
                updatedAt: Date;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
                impersonatedBy?: string | null | undefined;
            };
        };
    };
    $ERROR_CODES: {
        FAILED_TO_CREATE_USER: "Failed to create user";
        USER_ALREADY_EXISTS: "User already exists";
        readonly YOU_CANNOT_BAN_YOURSELF: "You cannot ban yourself";
        readonly YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "You are not allowed to change users role";
        readonly YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "You are not allowed to create users";
        readonly YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: "You are not allowed to list users";
        readonly YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: "You are not allowed to list users sessions";
        readonly YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: "You are not allowed to ban users";
        readonly YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: "You are not allowed to impersonate users";
        readonly YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: "You are not allowed to revoke users sessions";
        readonly YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "You are not allowed to delete users";
        readonly YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: "You are not allowed to set users password";
        readonly BANNED_USER: "You have been banned from this application";
        USER_NOT_FOUND: string;
        FAILED_TO_CREATE_SESSION: string;
        FAILED_TO_UPDATE_USER: string;
        FAILED_TO_GET_SESSION: string;
        INVALID_PASSWORD: string;
        INVALID_EMAIL: string;
        INVALID_EMAIL_OR_PASSWORD: string;
        SOCIAL_ACCOUNT_ALREADY_LINKED: string;
        PROVIDER_NOT_FOUND: string;
        INVALID_TOKEN: string;
        ID_TOKEN_NOT_SUPPORTED: string;
        FAILED_TO_GET_USER_INFO: string;
        USER_EMAIL_NOT_FOUND: string;
        EMAIL_NOT_VERIFIED: string;
        PASSWORD_TOO_SHORT: string;
        PASSWORD_TOO_LONG: string;
        EMAIL_CAN_NOT_BE_UPDATED: string;
        CREDENTIAL_ACCOUNT_NOT_FOUND: string;
        SESSION_EXPIRED: string;
        FAILED_TO_UNLINK_LAST_ACCOUNT: string;
        ACCOUNT_NOT_FOUND: string;
        USER_ALREADY_HAS_PASSWORD: string;
    };
};
//# sourceMappingURL=auth-client.d.ts.map