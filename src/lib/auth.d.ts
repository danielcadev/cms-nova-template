export declare const auth: {
    handler: (request: Request) => Promise<Response>;
    api: import("better-auth").InferAPI<{
        ok: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    ok: boolean;
                };
            } : {
                ok: boolean;
            }>;
            options: {
                method: "GET";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                ok: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                    isAction: false;
                };
            } & {
                use: any[];
            };
            path: "/ok";
        };
        error: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: Response;
            } : Response>;
            options: {
                method: "GET";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "text/html": {
                                        schema: {
                                            type: "string";
                                            description: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    isAction: false;
                };
            } & {
                use: any[];
            };
            path: "/error";
        };
        signInSocial: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    provider: "apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom";
                    scopes?: string[] | undefined;
                    loginHint?: string | undefined;
                    callbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                    idToken?: {
                        token: string;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    } | undefined;
                    requestSignUp?: boolean | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
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
                };
            } : {
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
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    callbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    newUserCallbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    errorCallbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    provider: import("better-auth").ZodType<"apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom", import("better-auth").ZodTypeDef, "apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom">;
                    disableRedirect: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                    idToken: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                        token: import("better-auth").ZodString;
                        nonce: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                        accessToken: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                        refreshToken: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                        expiresAt: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                    }, "strip", import("better-auth").ZodTypeAny, {
                        token: string;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    }, {
                        token: string;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    }>>;
                    scopes: import("better-auth").ZodOptional<import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                    requestSignUp: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                    loginHint: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    provider: "apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom";
                    scopes?: string[] | undefined;
                    loginHint?: string | undefined;
                    callbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                    idToken?: {
                        token: string;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    } | undefined;
                    requestSignUp?: boolean | undefined;
                }, {
                    provider: "apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom";
                    scopes?: string[] | undefined;
                    loginHint?: string | undefined;
                    callbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                    idToken?: {
                        token: string;
                        expiresAt?: number | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    } | undefined;
                    requestSignUp?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        operationId: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            description: string;
                                            properties: {
                                                redirect: {
                                                    type: string;
                                                    enum: boolean[];
                                                };
                                                token: {
                                                    type: string;
                                                    description: string;
                                                    url: {
                                                        type: string;
                                                        nullable: boolean;
                                                    };
                                                    user: {
                                                        type: string;
                                                        properties: {
                                                            id: {
                                                                type: string;
                                                            };
                                                            email: {
                                                                type: string;
                                                            };
                                                            name: {
                                                                type: string;
                                                                nullable: boolean;
                                                            };
                                                            image: {
                                                                type: string;
                                                                nullable: boolean;
                                                            };
                                                            emailVerified: {
                                                                type: string;
                                                            };
                                                            createdAt: {
                                                                type: string;
                                                                format: string;
                                                            };
                                                            updatedAt: {
                                                                type: string;
                                                                format: string;
                                                            };
                                                        };
                                                        required: string[];
                                                    };
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-in/social";
        };
        callbackOAuth: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: {
                    state?: string | undefined;
                    code?: string | undefined;
                    error?: string | undefined;
                    user?: string | undefined;
                    device_id?: string | undefined;
                    error_description?: string | undefined;
                } | undefined;
            } & {
                method: "GET" | "POST";
            } & {
                query?: {
                    state?: string | undefined;
                    code?: string | undefined;
                    error?: string | undefined;
                    user?: string | undefined;
                    device_id?: string | undefined;
                    error_description?: string | undefined;
                } | undefined;
            } & {
                params: {
                    id: string;
                };
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: void;
            } : void>;
            options: {
                method: ("GET" | "POST")[];
                body: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                    code: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    error: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    device_id: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    error_description: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    state: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    user: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    state?: string | undefined;
                    code?: string | undefined;
                    error?: string | undefined;
                    user?: string | undefined;
                    device_id?: string | undefined;
                    error_description?: string | undefined;
                }, {
                    state?: string | undefined;
                    code?: string | undefined;
                    error?: string | undefined;
                    user?: string | undefined;
                    device_id?: string | undefined;
                    error_description?: string | undefined;
                }>>;
                query: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                    code: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    error: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    device_id: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    error_description: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    state: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    user: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    state?: string | undefined;
                    code?: string | undefined;
                    error?: string | undefined;
                    user?: string | undefined;
                    device_id?: string | undefined;
                    error_description?: string | undefined;
                }, {
                    state?: string | undefined;
                    code?: string | undefined;
                    error?: string | undefined;
                    user?: string | undefined;
                    device_id?: string | undefined;
                    error_description?: string | undefined;
                }>>;
                metadata: {
                    isAction: false;
                };
            } & {
                use: any[];
            };
            path: "/callback/:id";
        };
        getSession: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: {
                    disableCookieCache?: string | boolean | undefined;
                    disableRefresh?: string | boolean | undefined;
                } | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
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
                } | null;
            } : {
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
            } | null>;
            options: {
                method: "GET";
                query: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                    disableCookieCache: import("better-auth").ZodOptional<import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodBoolean, import("better-auth").ZodEffects<import("better-auth").ZodString, boolean, string>]>>>;
                    disableRefresh: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodBoolean, import("better-auth").ZodEffects<import("better-auth").ZodString, boolean, string>]>>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    disableCookieCache?: boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }, {
                    disableCookieCache?: string | boolean | undefined;
                    disableRefresh?: string | boolean | undefined;
                }>>;
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    $ref: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/get-session";
        };
        signOut: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                };
            } : {
                success: boolean;
            }>;
            options: {
                method: "POST";
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-out";
        };
        signUpEmail: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    name: string;
                    email: string;
                    password: string;
                    callbackURL?: string;
                } & {} & {};
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
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
                };
            } : {
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
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodAny>;
                metadata: {
                    $Infer: {
                        body: {
                            name: string;
                            email: string;
                            password: string;
                            callbackURL?: string;
                        } & {} & {};
                    };
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            name: {
                                                type: string;
                                                description: string;
                                            };
                                            email: {
                                                type: string;
                                                description: string;
                                            };
                                            password: {
                                                type: string;
                                                description: string;
                                            };
                                            callbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        image: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        emailVerified: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        createdAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        updatedAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-up/email";
        };
        signInEmail: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    password: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
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
                };
            } : {
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
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    email: import("better-auth").ZodString;
                    password: import("better-auth").ZodString;
                    callbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    rememberMe: import("better-auth").ZodOptional<import("better-auth").ZodDefault<import("better-auth").ZodBoolean>>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    email: string;
                    password: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                }, {
                    email: string;
                    password: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            description: string;
                                            properties: {
                                                redirect: {
                                                    type: string;
                                                    enum: boolean[];
                                                };
                                                token: {
                                                    type: string;
                                                    description: string;
                                                };
                                                url: {
                                                    type: string;
                                                    nullable: boolean;
                                                };
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            nullable: boolean;
                                                        };
                                                        image: {
                                                            type: string;
                                                            nullable: boolean;
                                                        };
                                                        emailVerified: {
                                                            type: string;
                                                        };
                                                        createdAt: {
                                                            type: string;
                                                            format: string;
                                                        };
                                                        updatedAt: {
                                                            type: string;
                                                            format: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/sign-in/email";
        };
        forgetPassword: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    redirectTo?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    email: import("better-auth").ZodString;
                    redirectTo: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    email: string;
                    redirectTo?: string | undefined;
                }, {
                    email: string;
                    redirectTo?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                                message: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/forget-password";
        };
        resetPassword: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    newPassword: string;
                    token?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: {
                    token?: string | undefined;
                } | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                query: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                    token: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    token?: string | undefined;
                }, {
                    token?: string | undefined;
                }>>;
                body: import("better-auth").ZodObject<{
                    newPassword: import("better-auth").ZodString;
                    token: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    newPassword: string;
                    token?: string | undefined;
                }, {
                    newPassword: string;
                    token?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/reset-password";
        };
        verifyEmail: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    token: string;
                    callbackURL?: string | undefined;
                };
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: void | {
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
                };
            } : void | {
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
            }>;
            options: {
                method: "GET";
                query: import("better-auth").ZodObject<{
                    token: import("better-auth").ZodString;
                    callbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>)[];
                metadata: {
                    openapi: {
                        description: string;
                        parameters: ({
                            name: string;
                            in: "query";
                            description: string;
                            required: true;
                            schema: {
                                type: "string";
                            };
                        } | {
                            name: string;
                            in: "query";
                            description: string;
                            required: false;
                            schema: {
                                type: "string";
                            };
                        })[];
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        image: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        emailVerified: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        createdAt: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        updatedAt: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                                status: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/verify-email";
        };
        sendVerificationEmail: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    callbackURL?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    email: import("better-auth").ZodString;
                    callbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            email: {
                                                type: string;
                                                description: string;
                                                example: string;
                                            };
                                            callbackURL: {
                                                type: string;
                                                description: string;
                                                example: string;
                                                nullable: boolean;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                    description: string;
                                                    example: boolean;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            "400": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                message: {
                                                    type: string;
                                                    description: string;
                                                    example: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/send-verification-email";
        };
        changeEmail: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    newEmail: string;
                    callbackURL?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    newEmail: import("better-auth").ZodString;
                    callbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                    description: string;
                                                };
                                                message: {
                                                    type: string;
                                                    enum: string[];
                                                    description: string;
                                                    nullable: boolean;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/change-email";
        };
        changePassword: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
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
                };
            } : {
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
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    newPassword: import("better-auth").ZodString;
                    currentPassword: import("better-auth").ZodString;
                    revokeOtherSessions: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        image: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        emailVerified: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        createdAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        updatedAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/change-password";
        };
        setPassword: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    newPassword: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    newPassword: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                metadata: {
                    SERVER_ONLY: true;
                };
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
            } & {
                use: any[];
            };
            path: "/set-password";
        };
        updateUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: Partial<import("better-auth").AdditionalUserFieldsInput<{
                    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").Adapter;
                    secret: string | undefined;
                    baseURL: string;
                    emailAndPassword: {
                        enabled: true;
                    };
                    plugins: {
                        id: "admin";
                        init(): {
                            options: {
                                databaseHooks: {
                                    user: {
                                        create: {
                                            before(user: {
                                                id: string;
                                                name: string;
                                                emailVerified: boolean;
                                                email: string;
                                                createdAt: Date;
                                                updatedAt: Date;
                                                image?: string | null | undefined;
                                            }): Promise<{
                                                data: {
                                                    id: string;
                                                    name: string;
                                                    emailVerified: boolean;
                                                    email: string;
                                                    createdAt: Date;
                                                    updatedAt: Date;
                                                    image?: string | null | undefined;
                                                    role: string;
                                                };
                                            }>;
                                        };
                                    };
                                    session: {
                                        create: {
                                            before(session: {
                                                id: string;
                                                token: string;
                                                userId: string;
                                                expiresAt: Date;
                                                createdAt: Date;
                                                updatedAt: Date;
                                                ipAddress?: string | null | undefined;
                                                userAgent?: string | null | undefined;
                                            }, ctx: import("better-auth").GenericEndpointContext | undefined): Promise<void>;
                                        };
                                    };
                                };
                            };
                        };
                        hooks: {
                            after: {
                                matcher(context: import("better-auth").HookEndpointContext): boolean;
                                handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<import("better-auth/plugins").SessionWithImpersonatedBy[] | undefined>;
                            }[];
                        };
                        endpoints: {
                            setRole: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_1 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        userId: string;
                                        role: "user" | "admin" | ("user" | "admin")[];
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_1 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_1] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        user: import("better-auth/plugins").UserWithRole;
                                    };
                                } : {
                                    user: import("better-auth/plugins").UserWithRole;
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodObject<{
                                        userId: import("better-auth").ZodString;
                                        role: import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">]>;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        userId: string;
                                        role: string | string[];
                                    }, {
                                        userId: string;
                                        role: string | string[];
                                    }>;
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    user: {
                                                                        $ref: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                        $Infer: {
                                            body: {
                                                userId: string;
                                                role: "user" | "admin" | ("user" | "admin")[];
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/set-role";
                            };
                            createUser: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_2 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        email: string;
                                        password: string;
                                        name: string;
                                        role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                                        data?: Record<string, any>;
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_2 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_2] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        user: import("better-auth/plugins").UserWithRole;
                                    };
                                } : {
                                    user: import("better-auth/plugins").UserWithRole;
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodObject<{
                                        email: import("better-auth").ZodString;
                                        password: import("better-auth").ZodString;
                                        name: import("better-auth").ZodString;
                                        role: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">]>>;
                                        data: import("better-auth").ZodOptional<import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodAny>>;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        name: string;
                                        email: string;
                                        password: string;
                                        data?: Record<string, any> | undefined;
                                        role?: string | string[] | undefined;
                                    }, {
                                        name: string;
                                        email: string;
                                        password: string;
                                        data?: Record<string, any> | undefined;
                                        role?: string | string[] | undefined;
                                    }>;
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    user: {
                                                                        $ref: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                        $Infer: {
                                            body: {
                                                email: string;
                                                password: string;
                                                name: string;
                                                role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                                                data?: Record<string, any>;
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/create-user";
                            };
                            listUsers: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_3 extends boolean = false>(inputCtx_0: {
                                    body?: undefined;
                                } & {
                                    method?: "GET" | undefined;
                                } & {
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
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_3 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_3] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        users: import("better-auth/plugins").UserWithRole[];
                                        total: number;
                                        limit: number | undefined;
                                        offset: number | undefined;
                                    } | {
                                        users: never[];
                                        total: number;
                                    };
                                } : {
                                    users: import("better-auth/plugins").UserWithRole[];
                                    total: number;
                                    limit: number | undefined;
                                    offset: number | undefined;
                                } | {
                                    users: never[];
                                    total: number;
                                }>;
                                options: {
                                    method: "GET";
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    query: import("better-auth").ZodObject<{
                                        searchValue: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                        searchField: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["email", "name"]>>;
                                        searchOperator: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["contains", "starts_with", "ends_with"]>>;
                                        limit: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>>;
                                        offset: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>>;
                                        sortBy: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                        sortDirection: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["asc", "desc"]>>;
                                        filterField: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                        filterValue: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>, import("better-auth").ZodBoolean]>>;
                                        filterOperator: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["eq", "ne", "lt", "lte", "gt", "gte", "contains"]>>;
                                    }, "strip", import("better-auth").ZodTypeAny, {
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
                                    }, {
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
                                    }>;
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    users: {
                                                                        type: string;
                                                                        items: {
                                                                            $ref: string;
                                                                        };
                                                                    };
                                                                    total: {
                                                                        type: string;
                                                                    };
                                                                    limit: {
                                                                        type: string;
                                                                    };
                                                                    offset: {
                                                                        type: string;
                                                                    };
                                                                };
                                                                required: string[];
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/list-users";
                            };
                            listUserSessions: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_4 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        userId: string;
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_4 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_4] extends [true] ? {
                                    headers: Headers;
                                    response: {
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
                                    };
                                } : {
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
                                }>;
                                options: {
                                    method: "POST";
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    body: import("better-auth").ZodObject<{
                                        userId: import("better-auth").ZodString;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        userId: string;
                                    }, {
                                        userId: string;
                                    }>;
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    sessions: {
                                                                        type: string;
                                                                        items: {
                                                                            $ref: string;
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/list-user-sessions";
                            };
                            unbanUser: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_5 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        userId: string;
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_5 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_5] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        user: any;
                                    };
                                } : {
                                    user: any;
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodObject<{
                                        userId: import("better-auth").ZodString;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        userId: string;
                                    }, {
                                        userId: string;
                                    }>;
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    user: {
                                                                        $ref: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/unban-user";
                            };
                            banUser: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_6 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        userId: string;
                                        banReason?: string | undefined;
                                        banExpiresIn?: number | undefined;
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_6 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_6] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        user: any;
                                    };
                                } : {
                                    user: any;
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodObject<{
                                        userId: import("better-auth").ZodString;
                                        banReason: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                        banExpiresIn: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        userId: string;
                                        banReason?: string | undefined;
                                        banExpiresIn?: number | undefined;
                                    }, {
                                        userId: string;
                                        banReason?: string | undefined;
                                        banExpiresIn?: number | undefined;
                                    }>;
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    user: {
                                                                        $ref: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/ban-user";
                            };
                            impersonateUser: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_7 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        userId: string;
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_7 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_7] extends [true] ? {
                                    headers: Headers;
                                    response: {
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
                                    };
                                } : {
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
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodObject<{
                                        userId: import("better-auth").ZodString;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        userId: string;
                                    }, {
                                        userId: string;
                                    }>;
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    session: {
                                                                        $ref: string;
                                                                    };
                                                                    user: {
                                                                        $ref: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/impersonate-user";
                            };
                            stopImpersonating: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_8 extends boolean = false>(inputCtx_0?: ({
                                    body?: undefined;
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_8 | undefined;
                                }) | undefined): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_8] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        session: import("better-auth").Session & Record<string, any>;
                                        user: import("better-auth").User & Record<string, any>;
                                    };
                                } : {
                                    session: import("better-auth").Session & Record<string, any>;
                                    user: import("better-auth").User & Record<string, any>;
                                }>;
                                options: {
                                    method: "POST";
                                } & {
                                    use: any[];
                                };
                                path: "/admin/stop-impersonating";
                            };
                            revokeUserSession: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_9 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        sessionToken: string;
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_9 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_9] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        success: boolean;
                                    };
                                } : {
                                    success: boolean;
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodObject<{
                                        sessionToken: import("better-auth").ZodString;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        sessionToken: string;
                                    }, {
                                        sessionToken: string;
                                    }>;
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    success: {
                                                                        type: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/revoke-user-session";
                            };
                            revokeUserSessions: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_10 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        userId: string;
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_10 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_10] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        success: boolean;
                                    };
                                } : {
                                    success: boolean;
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodObject<{
                                        userId: import("better-auth").ZodString;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        userId: string;
                                    }, {
                                        userId: string;
                                    }>;
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    success: {
                                                                        type: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/revoke-user-sessions";
                            };
                            removeUser: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_11 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        userId: string;
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_11 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_11] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        success: boolean;
                                    };
                                } : {
                                    success: boolean;
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodObject<{
                                        userId: import("better-auth").ZodString;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        userId: string;
                                    }, {
                                        userId: string;
                                    }>;
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    success: {
                                                                        type: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/remove-user";
                            };
                            setUserPassword: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_12 extends boolean = false>(inputCtx_0: {
                                    body: {
                                        userId: string;
                                        newPassword: string;
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_12 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_12] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        status: boolean;
                                    };
                                } : {
                                    status: boolean;
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodObject<{
                                        newPassword: import("better-auth").ZodString;
                                        userId: import("better-auth").ZodString;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        userId: string;
                                        newPassword: string;
                                    }, {
                                        userId: string;
                                        newPassword: string;
                                    }>;
                                    use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                        session: {
                                            user: import("better-auth/plugins").UserWithRole;
                                            session: import("better-auth").Session;
                                        };
                                    }>)[];
                                    metadata: {
                                        openapi: {
                                            operationId: string;
                                            summary: string;
                                            description: string;
                                            responses: {
                                                200: {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    status: {
                                                                        type: string;
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/set-user-password";
                            };
                            userHasPermission: {
                                <AsResponse_1 extends boolean = false, ReturnHeaders_13 extends boolean = false>(inputCtx_0: {
                                    body: ({
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
                                    };
                                } & {
                                    method?: "POST" | undefined;
                                } & {
                                    query?: Record<string, any> | undefined;
                                } & {
                                    params?: Record<string, any>;
                                } & {
                                    request?: Request;
                                } & {
                                    headers?: HeadersInit;
                                } & {
                                    asResponse?: boolean;
                                    returnHeaders?: boolean;
                                    use?: import("better-auth").Middleware[];
                                    path?: string;
                                } & {
                                    asResponse?: AsResponse_1 | undefined;
                                    returnHeaders?: ReturnHeaders_13 | undefined;
                                }): Promise<[AsResponse_1] extends [true] ? Response : [ReturnHeaders_13] extends [true] ? {
                                    headers: Headers;
                                    response: {
                                        error: null;
                                        success: boolean;
                                    };
                                } : {
                                    error: null;
                                    success: boolean;
                                }>;
                                options: {
                                    method: "POST";
                                    body: import("better-auth").ZodIntersection<import("better-auth").ZodObject<{
                                        userId: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                        role: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        userId?: string | undefined;
                                        role?: string | undefined;
                                    }, {
                                        userId?: string | undefined;
                                        role?: string | undefined;
                                    }>, import("better-auth").ZodUnion<[import("better-auth").ZodObject<{
                                        permission: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                                        permissions: import("better-auth").ZodUndefined;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        permission: Record<string, string[]>;
                                        permissions?: undefined;
                                    }, {
                                        permission: Record<string, string[]>;
                                        permissions?: undefined;
                                    }>, import("better-auth").ZodObject<{
                                        permission: import("better-auth").ZodUndefined;
                                        permissions: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                                    }, "strip", import("better-auth").ZodTypeAny, {
                                        permissions: Record<string, string[]>;
                                        permission?: undefined;
                                    }, {
                                        permissions: Record<string, string[]>;
                                        permission?: undefined;
                                    }>]>>;
                                    metadata: {
                                        openapi: {
                                            description: string;
                                            requestBody: {
                                                content: {
                                                    "application/json": {
                                                        schema: {
                                                            type: "object";
                                                            properties: {
                                                                permission: {
                                                                    type: string;
                                                                    description: string;
                                                                    deprecated: boolean;
                                                                };
                                                                permissions: {
                                                                    type: string;
                                                                    description: string;
                                                                };
                                                            };
                                                            required: string[];
                                                        };
                                                    };
                                                };
                                            };
                                            responses: {
                                                "200": {
                                                    description: string;
                                                    content: {
                                                        "application/json": {
                                                            schema: {
                                                                type: "object";
                                                                properties: {
                                                                    error: {
                                                                        type: string;
                                                                    };
                                                                    success: {
                                                                        type: string;
                                                                    };
                                                                };
                                                                required: string[];
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                        $Infer: {
                                            body: ({
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
                                            };
                                        };
                                    };
                                } & {
                                    use: any[];
                                };
                                path: "/admin/has-permission";
                            };
                        };
                        $ERROR_CODES: {
                            readonly FAILED_TO_CREATE_USER: "Failed to create user";
                            readonly USER_ALREADY_EXISTS: "User already exists";
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
                        };
                        schema: {
                            user: {
                                fields: {
                                    role: {
                                        type: "string";
                                        required: false;
                                        input: false;
                                    };
                                    banned: {
                                        type: "boolean";
                                        defaultValue: false;
                                        required: false;
                                        input: false;
                                    };
                                    banReason: {
                                        type: "string";
                                        required: false;
                                        input: false;
                                    };
                                    banExpires: {
                                        type: "date";
                                        required: false;
                                        input: false;
                                    };
                                };
                            };
                            session: {
                                fields: {
                                    impersonatedBy: {
                                        type: "string";
                                        required: false;
                                    };
                                };
                            };
                        };
                    }[];
                    databaseHooks: {
                        user: {
                            create: {
                                before: (userData: {
                                    id: string;
                                    name: string;
                                    emailVerified: boolean;
                                    email: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                }) => Promise<{
                                    data: {
                                        role: string;
                                        id: string;
                                        name: string;
                                        emailVerified: boolean;
                                        email: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        image?: string | null | undefined;
                                    };
                                } | {
                                    data: {
                                        id: string;
                                        name: string;
                                        emailVerified: boolean;
                                        email: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        image?: string | null | undefined;
                                    };
                                }>;
                            };
                        };
                    };
                }>> & {
                    name?: string;
                    image?: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodAny>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    $Infer: {
                        body: Partial<import("better-auth").AdditionalUserFieldsInput<{
                            database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").Adapter;
                            secret: string | undefined;
                            baseURL: string;
                            emailAndPassword: {
                                enabled: true;
                            };
                            plugins: {
                                id: "admin";
                                init(): {
                                    options: {
                                        databaseHooks: {
                                            user: {
                                                create: {
                                                    before(user: {
                                                        id: string;
                                                        name: string;
                                                        emailVerified: boolean;
                                                        email: string;
                                                        createdAt: Date;
                                                        updatedAt: Date;
                                                        image?: string | null | undefined;
                                                    }): Promise<{
                                                        data: {
                                                            id: string;
                                                            name: string;
                                                            emailVerified: boolean;
                                                            email: string;
                                                            createdAt: Date;
                                                            updatedAt: Date;
                                                            image?: string | null | undefined;
                                                            role: string;
                                                        };
                                                    }>;
                                                };
                                            };
                                            session: {
                                                create: {
                                                    before(session: {
                                                        id: string;
                                                        token: string;
                                                        userId: string;
                                                        expiresAt: Date;
                                                        createdAt: Date;
                                                        updatedAt: Date;
                                                        ipAddress?: string | null | undefined;
                                                        userAgent?: string | null | undefined;
                                                    }, ctx: import("better-auth").GenericEndpointContext | undefined): Promise<void>;
                                                };
                                            };
                                        };
                                    };
                                };
                                hooks: {
                                    after: {
                                        matcher(context: import("better-auth").HookEndpointContext): boolean;
                                        handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<import("better-auth/plugins").SessionWithImpersonatedBy[] | undefined>;
                                    }[];
                                };
                                endpoints: {
                                    setRole: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                userId: string;
                                                role: "user" | "admin" | ("user" | "admin")[];
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                user: import("better-auth/plugins").UserWithRole;
                                            };
                                        } : {
                                            user: import("better-auth/plugins").UserWithRole;
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodObject<{
                                                userId: import("better-auth").ZodString;
                                                role: import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">]>;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                userId: string;
                                                role: string | string[];
                                            }, {
                                                userId: string;
                                                role: string | string[];
                                            }>;
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            user: {
                                                                                $ref: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                                $Infer: {
                                                    body: {
                                                        userId: string;
                                                        role: "user" | "admin" | ("user" | "admin")[];
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/set-role";
                                    };
                                    createUser: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                email: string;
                                                password: string;
                                                name: string;
                                                role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                                                data?: Record<string, any>;
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                user: import("better-auth/plugins").UserWithRole;
                                            };
                                        } : {
                                            user: import("better-auth/plugins").UserWithRole;
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodObject<{
                                                email: import("better-auth").ZodString;
                                                password: import("better-auth").ZodString;
                                                name: import("better-auth").ZodString;
                                                role: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">]>>;
                                                data: import("better-auth").ZodOptional<import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodAny>>;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                name: string;
                                                email: string;
                                                password: string;
                                                data?: Record<string, any> | undefined;
                                                role?: string | string[] | undefined;
                                            }, {
                                                name: string;
                                                email: string;
                                                password: string;
                                                data?: Record<string, any> | undefined;
                                                role?: string | string[] | undefined;
                                            }>;
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            user: {
                                                                                $ref: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                                $Infer: {
                                                    body: {
                                                        email: string;
                                                        password: string;
                                                        name: string;
                                                        role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                                                        data?: Record<string, any>;
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/create-user";
                                    };
                                    listUsers: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body?: undefined;
                                        } & {
                                            method?: "GET" | undefined;
                                        } & {
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
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                users: import("better-auth/plugins").UserWithRole[];
                                                total: number;
                                                limit: number | undefined;
                                                offset: number | undefined;
                                            } | {
                                                users: never[];
                                                total: number;
                                            };
                                        } : {
                                            users: import("better-auth/plugins").UserWithRole[];
                                            total: number;
                                            limit: number | undefined;
                                            offset: number | undefined;
                                        } | {
                                            users: never[];
                                            total: number;
                                        }>;
                                        options: {
                                            method: "GET";
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            query: import("better-auth").ZodObject<{
                                                searchValue: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                                searchField: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["email", "name"]>>;
                                                searchOperator: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["contains", "starts_with", "ends_with"]>>;
                                                limit: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>>;
                                                offset: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>>;
                                                sortBy: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                                sortDirection: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["asc", "desc"]>>;
                                                filterField: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                                filterValue: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>, import("better-auth").ZodBoolean]>>;
                                                filterOperator: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["eq", "ne", "lt", "lte", "gt", "gte", "contains"]>>;
                                            }, "strip", import("better-auth").ZodTypeAny, {
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
                                            }, {
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
                                            }>;
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            users: {
                                                                                type: string;
                                                                                items: {
                                                                                    $ref: string;
                                                                                };
                                                                            };
                                                                            total: {
                                                                                type: string;
                                                                            };
                                                                            limit: {
                                                                                type: string;
                                                                            };
                                                                            offset: {
                                                                                type: string;
                                                                            };
                                                                        };
                                                                        required: string[];
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/list-users";
                                    };
                                    listUserSessions: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                userId: string;
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
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
                                            };
                                        } : {
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
                                        }>;
                                        options: {
                                            method: "POST";
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            body: import("better-auth").ZodObject<{
                                                userId: import("better-auth").ZodString;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                userId: string;
                                            }, {
                                                userId: string;
                                            }>;
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            sessions: {
                                                                                type: string;
                                                                                items: {
                                                                                    $ref: string;
                                                                                };
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/list-user-sessions";
                                    };
                                    unbanUser: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                userId: string;
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                user: any;
                                            };
                                        } : {
                                            user: any;
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodObject<{
                                                userId: import("better-auth").ZodString;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                userId: string;
                                            }, {
                                                userId: string;
                                            }>;
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            user: {
                                                                                $ref: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/unban-user";
                                    };
                                    banUser: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                userId: string;
                                                banReason?: string | undefined;
                                                banExpiresIn?: number | undefined;
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                user: any;
                                            };
                                        } : {
                                            user: any;
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodObject<{
                                                userId: import("better-auth").ZodString;
                                                banReason: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                                banExpiresIn: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                userId: string;
                                                banReason?: string | undefined;
                                                banExpiresIn?: number | undefined;
                                            }, {
                                                userId: string;
                                                banReason?: string | undefined;
                                                banExpiresIn?: number | undefined;
                                            }>;
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            user: {
                                                                                $ref: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/ban-user";
                                    };
                                    impersonateUser: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                userId: string;
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
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
                                            };
                                        } : {
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
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodObject<{
                                                userId: import("better-auth").ZodString;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                userId: string;
                                            }, {
                                                userId: string;
                                            }>;
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            session: {
                                                                                $ref: string;
                                                                            };
                                                                            user: {
                                                                                $ref: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/impersonate-user";
                                    };
                                    stopImpersonating: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                                            body?: undefined;
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                session: import("better-auth").Session & Record<string, any>;
                                                user: import("better-auth").User & Record<string, any>;
                                            };
                                        } : {
                                            session: import("better-auth").Session & Record<string, any>;
                                            user: import("better-auth").User & Record<string, any>;
                                        }>;
                                        options: {
                                            method: "POST";
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/stop-impersonating";
                                    };
                                    revokeUserSession: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                sessionToken: string;
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                success: boolean;
                                            };
                                        } : {
                                            success: boolean;
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodObject<{
                                                sessionToken: import("better-auth").ZodString;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                sessionToken: string;
                                            }, {
                                                sessionToken: string;
                                            }>;
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            success: {
                                                                                type: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/revoke-user-session";
                                    };
                                    revokeUserSessions: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                userId: string;
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                success: boolean;
                                            };
                                        } : {
                                            success: boolean;
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodObject<{
                                                userId: import("better-auth").ZodString;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                userId: string;
                                            }, {
                                                userId: string;
                                            }>;
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            success: {
                                                                                type: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/revoke-user-sessions";
                                    };
                                    removeUser: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                userId: string;
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                success: boolean;
                                            };
                                        } : {
                                            success: boolean;
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodObject<{
                                                userId: import("better-auth").ZodString;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                userId: string;
                                            }, {
                                                userId: string;
                                            }>;
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            success: {
                                                                                type: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/remove-user";
                                    };
                                    setUserPassword: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: {
                                                userId: string;
                                                newPassword: string;
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                status: boolean;
                                            };
                                        } : {
                                            status: boolean;
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodObject<{
                                                newPassword: import("better-auth").ZodString;
                                                userId: import("better-auth").ZodString;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                userId: string;
                                                newPassword: string;
                                            }, {
                                                userId: string;
                                                newPassword: string;
                                            }>;
                                            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                                                session: {
                                                    user: import("better-auth/plugins").UserWithRole;
                                                    session: import("better-auth").Session;
                                                };
                                            }>)[];
                                            metadata: {
                                                openapi: {
                                                    operationId: string;
                                                    summary: string;
                                                    description: string;
                                                    responses: {
                                                        200: {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            status: {
                                                                                type: string;
                                                                            };
                                                                        };
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/set-user-password";
                                    };
                                    userHasPermission: {
                                        <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                                            body: ({
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
                                            };
                                        } & {
                                            method?: "POST" | undefined;
                                        } & {
                                            query?: Record<string, any> | undefined;
                                        } & {
                                            params?: Record<string, any>;
                                        } & {
                                            request?: Request;
                                        } & {
                                            headers?: HeadersInit;
                                        } & {
                                            asResponse?: boolean;
                                            returnHeaders?: boolean;
                                            use?: import("better-auth").Middleware[];
                                            path?: string;
                                        } & {
                                            asResponse?: AsResponse | undefined;
                                            returnHeaders?: ReturnHeaders | undefined;
                                        }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                                            headers: Headers;
                                            response: {
                                                error: null;
                                                success: boolean;
                                            };
                                        } : {
                                            error: null;
                                            success: boolean;
                                        }>;
                                        options: {
                                            method: "POST";
                                            body: import("better-auth").ZodIntersection<import("better-auth").ZodObject<{
                                                userId: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                                role: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                userId?: string | undefined;
                                                role?: string | undefined;
                                            }, {
                                                userId?: string | undefined;
                                                role?: string | undefined;
                                            }>, import("better-auth").ZodUnion<[import("better-auth").ZodObject<{
                                                permission: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                                                permissions: import("better-auth").ZodUndefined;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                permission: Record<string, string[]>;
                                                permissions?: undefined;
                                            }, {
                                                permission: Record<string, string[]>;
                                                permissions?: undefined;
                                            }>, import("better-auth").ZodObject<{
                                                permission: import("better-auth").ZodUndefined;
                                                permissions: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                                            }, "strip", import("better-auth").ZodTypeAny, {
                                                permissions: Record<string, string[]>;
                                                permission?: undefined;
                                            }, {
                                                permissions: Record<string, string[]>;
                                                permission?: undefined;
                                            }>]>>;
                                            metadata: {
                                                openapi: {
                                                    description: string;
                                                    requestBody: {
                                                        content: {
                                                            "application/json": {
                                                                schema: {
                                                                    type: "object";
                                                                    properties: {
                                                                        permission: {
                                                                            type: string;
                                                                            description: string;
                                                                            deprecated: boolean;
                                                                        };
                                                                        permissions: {
                                                                            type: string;
                                                                            description: string;
                                                                        };
                                                                    };
                                                                    required: string[];
                                                                };
                                                            };
                                                        };
                                                    };
                                                    responses: {
                                                        "200": {
                                                            description: string;
                                                            content: {
                                                                "application/json": {
                                                                    schema: {
                                                                        type: "object";
                                                                        properties: {
                                                                            error: {
                                                                                type: string;
                                                                            };
                                                                            success: {
                                                                                type: string;
                                                                            };
                                                                        };
                                                                        required: string[];
                                                                    };
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                                $Infer: {
                                                    body: ({
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
                                                    };
                                                };
                                            };
                                        } & {
                                            use: any[];
                                        };
                                        path: "/admin/has-permission";
                                    };
                                };
                                $ERROR_CODES: {
                                    readonly FAILED_TO_CREATE_USER: "Failed to create user";
                                    readonly USER_ALREADY_EXISTS: "User already exists";
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
                                };
                                schema: {
                                    user: {
                                        fields: {
                                            role: {
                                                type: "string";
                                                required: false;
                                                input: false;
                                            };
                                            banned: {
                                                type: "boolean";
                                                defaultValue: false;
                                                required: false;
                                                input: false;
                                            };
                                            banReason: {
                                                type: "string";
                                                required: false;
                                                input: false;
                                            };
                                            banExpires: {
                                                type: "date";
                                                required: false;
                                                input: false;
                                            };
                                        };
                                    };
                                    session: {
                                        fields: {
                                            impersonatedBy: {
                                                type: "string";
                                                required: false;
                                            };
                                        };
                                    };
                                };
                            }[];
                            databaseHooks: {
                                user: {
                                    create: {
                                        before: (userData: {
                                            id: string;
                                            name: string;
                                            emailVerified: boolean;
                                            email: string;
                                            createdAt: Date;
                                            updatedAt: Date;
                                            image?: string | null | undefined;
                                        }) => Promise<{
                                            data: {
                                                role: string;
                                                id: string;
                                                name: string;
                                                emailVerified: boolean;
                                                email: string;
                                                createdAt: Date;
                                                updatedAt: Date;
                                                image?: string | null | undefined;
                                            };
                                        } | {
                                            data: {
                                                id: string;
                                                name: string;
                                                emailVerified: boolean;
                                                email: string;
                                                createdAt: Date;
                                                updatedAt: Date;
                                                image?: string | null | undefined;
                                            };
                                        }>;
                                    };
                                };
                            };
                        }>> & {
                            name?: string;
                            image?: string;
                        };
                    };
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            name: {
                                                type: string;
                                                description: string;
                                            };
                                            image: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/update-user";
        };
        deleteUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                    password?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                    message: string;
                };
            } : {
                success: boolean;
                message: string;
            }>;
            options: {
                method: "POST";
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                body: import("better-auth").ZodObject<{
                    callbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    password: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    token: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                    password?: string | undefined;
                }, {
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                    password?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                    description: string;
                                                };
                                                message: {
                                                    type: string;
                                                    enum: string[];
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/delete-user";
        };
        forgetPasswordCallback: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    callbackURL: string;
                };
            } & {
                params: {
                    token: string;
                };
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: never;
            } : never>;
            options: {
                method: "GET";
                query: import("better-auth").ZodObject<{
                    callbackURL: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    callbackURL: string;
                }, {
                    callbackURL: string;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/reset-password/:token";
        };
        requestPasswordReset: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    redirectTo?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    email: import("better-auth").ZodString;
                    redirectTo: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    email: string;
                    redirectTo?: string | undefined;
                }, {
                    email: string;
                    redirectTo?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                                message: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/request-password-reset";
        };
        requestPasswordResetCallback: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    callbackURL: string;
                };
            } & {
                params: {
                    token: string;
                };
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: never;
            } : never>;
            options: {
                method: "GET";
                query: import("better-auth").ZodObject<{
                    callbackURL: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    callbackURL: string;
                }, {
                    callbackURL: string;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/reset-password/:token";
        };
        listSessions: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: import("better-auth").Prettify<{
                    id: string;
                    token: string;
                    userId: string;
                    expiresAt: Date;
                    createdAt: Date;
                    updatedAt: Date;
                    ipAddress?: string | null | undefined | undefined;
                    userAgent?: string | null | undefined | undefined;
                    impersonatedBy?: string | null | undefined;
                }>[];
            } : import("better-auth").Prettify<{
                id: string;
                token: string;
                userId: string;
                expiresAt: Date;
                createdAt: Date;
                updatedAt: Date;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
                impersonatedBy?: string | null | undefined;
            }>[]>;
            options: {
                method: "GET";
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/list-sessions";
        };
        revokeSession: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    token: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    token: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    token: string;
                }, {
                    token: string;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            token: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/revoke-session";
        };
        revokeSessions: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/revoke-sessions";
        };
        revokeOtherSessions: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                requireHeaders: true;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/revoke-other-sessions";
        };
        linkSocialAccount: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    provider: "apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom";
                    scopes?: string[] | undefined;
                    callbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    idToken?: {
                        token: string;
                        scopes?: string[] | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    } | undefined;
                    requestSignUp?: boolean | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    url: string;
                    redirect: boolean;
                };
            } : {
                url: string;
                redirect: boolean;
            }>;
            options: {
                method: "POST";
                requireHeaders: true;
                body: import("better-auth").ZodObject<{
                    callbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    provider: import("better-auth").ZodType<"apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom", import("better-auth").ZodTypeDef, "apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom">;
                    idToken: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                        token: import("better-auth").ZodString;
                        nonce: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                        accessToken: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                        refreshToken: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                        scopes: import("better-auth").ZodOptional<import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                    }, "strip", import("better-auth").ZodTypeAny, {
                        token: string;
                        scopes?: string[] | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    }, {
                        token: string;
                        scopes?: string[] | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    }>>;
                    requestSignUp: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                    scopes: import("better-auth").ZodOptional<import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                    errorCallbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    provider: "apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom";
                    scopes?: string[] | undefined;
                    callbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    idToken?: {
                        token: string;
                        scopes?: string[] | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    } | undefined;
                    requestSignUp?: boolean | undefined;
                }, {
                    provider: "apple" | (string & {}) | "discord" | "facebook" | "github" | "microsoft" | "google" | "huggingface" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "vk" | "zoom";
                    scopes?: string[] | undefined;
                    callbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    idToken?: {
                        token: string;
                        scopes?: string[] | undefined;
                        nonce?: string | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                    } | undefined;
                    requestSignUp?: boolean | undefined;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                url: {
                                                    type: string;
                                                    description: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                    description: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/link-social";
        };
        listUserAccounts: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    id: string;
                    provider: string;
                    createdAt: Date;
                    updatedAt: Date;
                    accountId: string;
                    scopes: string[];
                }[];
            } : {
                id: string;
                provider: string;
                createdAt: Date;
                updatedAt: Date;
                accountId: string;
                scopes: string[];
            }[]>;
            options: {
                method: "GET";
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            items: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                    };
                                                    provider: {
                                                        type: string;
                                                    };
                                                    createdAt: {
                                                        type: string;
                                                        format: string;
                                                    };
                                                    updatedAt: {
                                                        type: string;
                                                        format: string;
                                                    };
                                                };
                                                accountId: {
                                                    type: string;
                                                };
                                                scopes: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/list-accounts";
        };
        deleteUserCallback: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
                query: {
                    token: string;
                    callbackURL?: string | undefined;
                };
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                    message: string;
                };
            } : {
                success: boolean;
                message: string;
            }>;
            options: {
                method: "GET";
                query: import("better-auth").ZodObject<{
                    token: import("better-auth").ZodString;
                    callbackURL: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<void>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                    description: string;
                                                };
                                                message: {
                                                    type: string;
                                                    enum: string[];
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/delete-user/callback";
        };
        unlinkAccount: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    providerId: string;
                    accountId?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    providerId: import("better-auth").ZodString;
                    accountId: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    providerId: string;
                    accountId?: string | undefined;
                }, {
                    providerId: string;
                    accountId?: string | undefined;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/unlink-account";
        };
        refreshToken: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    providerId: string;
                    userId?: string | undefined;
                    accountId?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: import("better-auth").OAuth2Tokens;
            } : import("better-auth").OAuth2Tokens>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    providerId: import("better-auth").ZodString;
                    accountId: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    userId: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    providerId: string;
                    userId?: string | undefined;
                    accountId?: string | undefined;
                }, {
                    providerId: string;
                    userId?: string | undefined;
                    accountId?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                tokenType: {
                                                    type: string;
                                                };
                                                idToken: {
                                                    type: string;
                                                };
                                                accessToken: {
                                                    type: string;
                                                };
                                                refreshToken: {
                                                    type: string;
                                                };
                                                accessTokenExpiresAt: {
                                                    type: string;
                                                    format: string;
                                                };
                                                refreshTokenExpiresAt: {
                                                    type: string;
                                                    format: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            400: {
                                description: string;
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/refresh-token";
        };
        getAccessToken: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    providerId: string;
                    userId?: string | undefined;
                    accountId?: string | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    accessToken: string | undefined;
                    accessTokenExpiresAt: Date | undefined;
                    scopes: string[];
                    idToken: string | undefined;
                };
            } : {
                accessToken: string | undefined;
                accessTokenExpiresAt: Date | undefined;
                scopes: string[];
                idToken: string | undefined;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    providerId: import("better-auth").ZodString;
                    accountId: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    userId: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    providerId: string;
                    userId?: string | undefined;
                    accountId?: string | undefined;
                }, {
                    providerId: string;
                    userId?: string | undefined;
                    accountId?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                tokenType: {
                                                    type: string;
                                                };
                                                idToken: {
                                                    type: string;
                                                };
                                                accessToken: {
                                                    type: string;
                                                };
                                                refreshToken: {
                                                    type: string;
                                                };
                                                accessTokenExpiresAt: {
                                                    type: string;
                                                    format: string;
                                                };
                                                refreshTokenExpiresAt: {
                                                    type: string;
                                                    format: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            400: {
                                description: string;
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/get-access-token";
        };
        accountInfo: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    accountId: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    user: {
                        id: string;
                        name?: string;
                        email?: string | null;
                        image?: string;
                        emailVerified: boolean;
                    };
                    data: Record<string, any>;
                } | null;
            } : {
                user: {
                    id: string;
                    name?: string;
                    email?: string | null;
                    image?: string;
                    emailVerified: boolean;
                };
                data: Record<string, any>;
            } | null>;
            options: {
                method: "POST";
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            token: string;
                            userId: string;
                            expiresAt: Date;
                            createdAt: Date;
                            updatedAt: Date;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>)[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                        };
                                                        image: {
                                                            type: string;
                                                        };
                                                        emailVerified: {
                                                            type: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                                data: {
                                                    type: string;
                                                    properties: {};
                                                    additionalProperties: boolean;
                                                };
                                            };
                                            required: string[];
                                            additionalProperties: boolean;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                body: import("better-auth").ZodObject<{
                    accountId: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    accountId: string;
                }, {
                    accountId: string;
                }>;
            } & {
                use: any[];
            };
            path: "/account-info";
        };
    } & {
        setRole: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                    role: "user" | "admin" | ("user" | "admin")[];
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    user: import("better-auth/plugins").UserWithRole;
                };
            } : {
                user: import("better-auth/plugins").UserWithRole;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    userId: import("better-auth").ZodString;
                    role: import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">]>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    userId: string;
                    role: string | string[];
                }, {
                    userId: string;
                    role: string | string[];
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            userId: string;
                            role: "user" | "admin" | ("user" | "admin")[];
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/set-role";
        };
        createUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    email: string;
                    password: string;
                    name: string;
                    role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                    data?: Record<string, any>;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    user: import("better-auth/plugins").UserWithRole;
                };
            } : {
                user: import("better-auth/plugins").UserWithRole;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    email: import("better-auth").ZodString;
                    password: import("better-auth").ZodString;
                    name: import("better-auth").ZodString;
                    role: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">]>>;
                    data: import("better-auth").ZodOptional<import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodAny>>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    name: string;
                    email: string;
                    password: string;
                    data?: Record<string, any> | undefined;
                    role?: string | string[] | undefined;
                }, {
                    name: string;
                    email: string;
                    password: string;
                    data?: Record<string, any> | undefined;
                    role?: string | string[] | undefined;
                }>;
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            email: string;
                            password: string;
                            name: string;
                            role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                            data?: Record<string, any>;
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/create-user";
        };
        listUsers: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body?: undefined;
            } & {
                method?: "GET" | undefined;
            } & {
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
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    users: import("better-auth/plugins").UserWithRole[];
                    total: number;
                    limit: number | undefined;
                    offset: number | undefined;
                } | {
                    users: never[];
                    total: number;
                };
            } : {
                users: import("better-auth/plugins").UserWithRole[];
                total: number;
                limit: number | undefined;
                offset: number | undefined;
            } | {
                users: never[];
                total: number;
            }>;
            options: {
                method: "GET";
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                query: import("better-auth").ZodObject<{
                    searchValue: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    searchField: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["email", "name"]>>;
                    searchOperator: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["contains", "starts_with", "ends_with"]>>;
                    limit: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>>;
                    offset: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>>;
                    sortBy: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    sortDirection: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["asc", "desc"]>>;
                    filterField: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    filterValue: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>, import("better-auth").ZodBoolean]>>;
                    filterOperator: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["eq", "ne", "lt", "lte", "gt", "gte", "contains"]>>;
                }, "strip", import("better-auth").ZodTypeAny, {
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
                }, {
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
                }>;
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                users: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                                total: {
                                                    type: string;
                                                };
                                                limit: {
                                                    type: string;
                                                };
                                                offset: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/list-users";
        };
        listUserSessions: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
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
                };
            } : {
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
            }>;
            options: {
                method: "POST";
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                body: import("better-auth").ZodObject<{
                    userId: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                sessions: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/list-user-sessions";
        };
        unbanUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    user: any;
                };
            } : {
                user: any;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    userId: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/unban-user";
        };
        banUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                    banReason?: string | undefined;
                    banExpiresIn?: number | undefined;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    user: any;
                };
            } : {
                user: any;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    userId: import("better-auth").ZodString;
                    banReason: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    banExpiresIn: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    userId: string;
                    banReason?: string | undefined;
                    banExpiresIn?: number | undefined;
                }, {
                    userId: string;
                    banReason?: string | undefined;
                    banExpiresIn?: number | undefined;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/ban-user";
        };
        impersonateUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
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
                };
            } : {
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
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    userId: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    $ref: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/impersonate-user";
        };
        stopImpersonating: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                body?: undefined;
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    session: import("better-auth").Session & Record<string, any>;
                    user: import("better-auth").User & Record<string, any>;
                };
            } : {
                session: import("better-auth").Session & Record<string, any>;
                user: import("better-auth").User & Record<string, any>;
            }>;
            options: {
                method: "POST";
            } & {
                use: any[];
            };
            path: "/admin/stop-impersonating";
        };
        revokeUserSession: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    sessionToken: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                };
            } : {
                success: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    sessionToken: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    sessionToken: string;
                }, {
                    sessionToken: string;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/revoke-user-session";
        };
        revokeUserSessions: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                };
            } : {
                success: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    userId: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/revoke-user-sessions";
        };
        removeUser: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    success: boolean;
                };
            } : {
                success: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    userId: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/remove-user";
        };
        setUserPassword: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: {
                    userId: string;
                    newPassword: string;
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    status: boolean;
                };
            } : {
                status: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    newPassword: import("better-auth").ZodString;
                    userId: import("better-auth").ZodString;
                }, "strip", import("better-auth").ZodTypeAny, {
                    userId: string;
                    newPassword: string;
                }, {
                    userId: string;
                    newPassword: string;
                }>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/set-user-password";
        };
        userHasPermission: {
            <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                body: ({
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
                };
            } & {
                method?: "POST" | undefined;
            } & {
                query?: Record<string, any> | undefined;
            } & {
                params?: Record<string, any>;
            } & {
                request?: Request;
            } & {
                headers?: HeadersInit;
            } & {
                asResponse?: boolean;
                returnHeaders?: boolean;
                use?: import("better-auth").Middleware[];
                path?: string;
            } & {
                asResponse?: AsResponse | undefined;
                returnHeaders?: ReturnHeaders | undefined;
            }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                headers: Headers;
                response: {
                    error: null;
                    success: boolean;
                };
            } : {
                error: null;
                success: boolean;
            }>;
            options: {
                method: "POST";
                body: import("better-auth").ZodIntersection<import("better-auth").ZodObject<{
                    userId: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                    role: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    userId?: string | undefined;
                    role?: string | undefined;
                }, {
                    userId?: string | undefined;
                    role?: string | undefined;
                }>, import("better-auth").ZodUnion<[import("better-auth").ZodObject<{
                    permission: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                    permissions: import("better-auth").ZodUndefined;
                }, "strip", import("better-auth").ZodTypeAny, {
                    permission: Record<string, string[]>;
                    permissions?: undefined;
                }, {
                    permission: Record<string, string[]>;
                    permissions?: undefined;
                }>, import("better-auth").ZodObject<{
                    permission: import("better-auth").ZodUndefined;
                    permissions: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                }, "strip", import("better-auth").ZodTypeAny, {
                    permissions: Record<string, string[]>;
                    permission?: undefined;
                }, {
                    permissions: Record<string, string[]>;
                    permission?: undefined;
                }>]>>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            permission: {
                                                type: string;
                                                description: string;
                                                deprecated: boolean;
                                            };
                                            permissions: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                error: {
                                                    type: string;
                                                };
                                                success: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: ({
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
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/admin/has-permission";
        };
    }>;
    options: {
        database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").Adapter;
        secret: string | undefined;
        baseURL: string;
        emailAndPassword: {
            enabled: true;
        };
        plugins: {
            id: "admin";
            init(): {
                options: {
                    databaseHooks: {
                        user: {
                            create: {
                                before(user: {
                                    id: string;
                                    name: string;
                                    emailVerified: boolean;
                                    email: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                }): Promise<{
                                    data: {
                                        id: string;
                                        name: string;
                                        emailVerified: boolean;
                                        email: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        image?: string | null | undefined;
                                        role: string;
                                    };
                                }>;
                            };
                        };
                        session: {
                            create: {
                                before(session: {
                                    id: string;
                                    token: string;
                                    userId: string;
                                    expiresAt: Date;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                }, ctx: import("better-auth").GenericEndpointContext | undefined): Promise<void>;
                            };
                        };
                    };
                };
            };
            hooks: {
                after: {
                    matcher(context: import("better-auth").HookEndpointContext): boolean;
                    handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<import("better-auth/plugins").SessionWithImpersonatedBy[] | undefined>;
                }[];
            };
            endpoints: {
                setRole: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            userId: string;
                            role: "user" | "admin" | ("user" | "admin")[];
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            user: import("better-auth/plugins").UserWithRole;
                        };
                    } : {
                        user: import("better-auth/plugins").UserWithRole;
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodObject<{
                            userId: import("better-auth").ZodString;
                            role: import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">]>;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            userId: string;
                            role: string | string[];
                        }, {
                            userId: string;
                            role: string | string[];
                        }>;
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            $Infer: {
                                body: {
                                    userId: string;
                                    role: "user" | "admin" | ("user" | "admin")[];
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/set-role";
                };
                createUser: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            email: string;
                            password: string;
                            name: string;
                            role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                            data?: Record<string, any>;
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            user: import("better-auth/plugins").UserWithRole;
                        };
                    } : {
                        user: import("better-auth/plugins").UserWithRole;
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodObject<{
                            email: import("better-auth").ZodString;
                            password: import("better-auth").ZodString;
                            name: import("better-auth").ZodString;
                            role: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">]>>;
                            data: import("better-auth").ZodOptional<import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodAny>>;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            name: string;
                            email: string;
                            password: string;
                            data?: Record<string, any> | undefined;
                            role?: string | string[] | undefined;
                        }, {
                            name: string;
                            email: string;
                            password: string;
                            data?: Record<string, any> | undefined;
                            role?: string | string[] | undefined;
                        }>;
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            $Infer: {
                                body: {
                                    email: string;
                                    password: string;
                                    name: string;
                                    role?: "user" | "admin" | ("user" | "admin")[] | undefined;
                                    data?: Record<string, any>;
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/create-user";
                };
                listUsers: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body?: undefined;
                    } & {
                        method?: "GET" | undefined;
                    } & {
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
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            users: import("better-auth/plugins").UserWithRole[];
                            total: number;
                            limit: number | undefined;
                            offset: number | undefined;
                        } | {
                            users: never[];
                            total: number;
                        };
                    } : {
                        users: import("better-auth/plugins").UserWithRole[];
                        total: number;
                        limit: number | undefined;
                        offset: number | undefined;
                    } | {
                        users: never[];
                        total: number;
                    }>;
                    options: {
                        method: "GET";
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        query: import("better-auth").ZodObject<{
                            searchValue: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                            searchField: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["email", "name"]>>;
                            searchOperator: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["contains", "starts_with", "ends_with"]>>;
                            limit: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>>;
                            offset: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>>;
                            sortBy: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                            sortDirection: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["asc", "desc"]>>;
                            filterField: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                            filterValue: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodUnion<[import("better-auth").ZodString, import("better-auth").ZodNumber]>, import("better-auth").ZodBoolean]>>;
                            filterOperator: import("better-auth").ZodOptional<import("better-auth").ZodEnum<["eq", "ne", "lt", "lte", "gt", "gte", "contains"]>>;
                        }, "strip", import("better-auth").ZodTypeAny, {
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
                        }, {
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
                        }>;
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        users: {
                                                            type: string;
                                                            items: {
                                                                $ref: string;
                                                            };
                                                        };
                                                        total: {
                                                            type: string;
                                                        };
                                                        limit: {
                                                            type: string;
                                                        };
                                                        offset: {
                                                            type: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/list-users";
                };
                listUserSessions: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            userId: string;
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
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
                        };
                    } : {
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
                    }>;
                    options: {
                        method: "POST";
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        body: import("better-auth").ZodObject<{
                            userId: import("better-auth").ZodString;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            userId: string;
                        }, {
                            userId: string;
                        }>;
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        sessions: {
                                                            type: string;
                                                            items: {
                                                                $ref: string;
                                                            };
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/list-user-sessions";
                };
                unbanUser: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            userId: string;
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            user: any;
                        };
                    } : {
                        user: any;
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodObject<{
                            userId: import("better-auth").ZodString;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            userId: string;
                        }, {
                            userId: string;
                        }>;
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/unban-user";
                };
                banUser: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            userId: string;
                            banReason?: string | undefined;
                            banExpiresIn?: number | undefined;
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            user: any;
                        };
                    } : {
                        user: any;
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodObject<{
                            userId: import("better-auth").ZodString;
                            banReason: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                            banExpiresIn: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            userId: string;
                            banReason?: string | undefined;
                            banExpiresIn?: number | undefined;
                        }, {
                            userId: string;
                            banReason?: string | undefined;
                            banExpiresIn?: number | undefined;
                        }>;
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/ban-user";
                };
                impersonateUser: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            userId: string;
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
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
                        };
                    } : {
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
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodObject<{
                            userId: import("better-auth").ZodString;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            userId: string;
                        }, {
                            userId: string;
                        }>;
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        session: {
                                                            $ref: string;
                                                        };
                                                        user: {
                                                            $ref: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/impersonate-user";
                };
                stopImpersonating: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0?: ({
                        body?: undefined;
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }) | undefined): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            session: import("better-auth").Session & Record<string, any>;
                            user: import("better-auth").User & Record<string, any>;
                        };
                    } : {
                        session: import("better-auth").Session & Record<string, any>;
                        user: import("better-auth").User & Record<string, any>;
                    }>;
                    options: {
                        method: "POST";
                    } & {
                        use: any[];
                    };
                    path: "/admin/stop-impersonating";
                };
                revokeUserSession: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            sessionToken: string;
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            success: boolean;
                        };
                    } : {
                        success: boolean;
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodObject<{
                            sessionToken: import("better-auth").ZodString;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            sessionToken: string;
                        }, {
                            sessionToken: string;
                        }>;
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        success: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/revoke-user-session";
                };
                revokeUserSessions: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            userId: string;
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            success: boolean;
                        };
                    } : {
                        success: boolean;
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodObject<{
                            userId: import("better-auth").ZodString;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            userId: string;
                        }, {
                            userId: string;
                        }>;
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        success: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/revoke-user-sessions";
                };
                removeUser: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            userId: string;
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            success: boolean;
                        };
                    } : {
                        success: boolean;
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodObject<{
                            userId: import("better-auth").ZodString;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            userId: string;
                        }, {
                            userId: string;
                        }>;
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        success: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/remove-user";
                };
                setUserPassword: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: {
                            userId: string;
                            newPassword: string;
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            status: boolean;
                        };
                    } : {
                        status: boolean;
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodObject<{
                            newPassword: import("better-auth").ZodString;
                            userId: import("better-auth").ZodString;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            userId: string;
                            newPassword: string;
                        }, {
                            userId: string;
                            newPassword: string;
                        }>;
                        use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                            session: {
                                user: import("better-auth/plugins").UserWithRole;
                                session: import("better-auth").Session;
                            };
                        }>)[];
                        metadata: {
                            openapi: {
                                operationId: string;
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/set-user-password";
                };
                userHasPermission: {
                    <AsResponse extends boolean = false, ReturnHeaders extends boolean = false>(inputCtx_0: {
                        body: ({
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
                        };
                    } & {
                        method?: "POST" | undefined;
                    } & {
                        query?: Record<string, any> | undefined;
                    } & {
                        params?: Record<string, any>;
                    } & {
                        request?: Request;
                    } & {
                        headers?: HeadersInit;
                    } & {
                        asResponse?: boolean;
                        returnHeaders?: boolean;
                        use?: import("better-auth").Middleware[];
                        path?: string;
                    } & {
                        asResponse?: AsResponse | undefined;
                        returnHeaders?: ReturnHeaders | undefined;
                    }): Promise<[AsResponse] extends [true] ? Response : [ReturnHeaders] extends [true] ? {
                        headers: Headers;
                        response: {
                            error: null;
                            success: boolean;
                        };
                    } : {
                        error: null;
                        success: boolean;
                    }>;
                    options: {
                        method: "POST";
                        body: import("better-auth").ZodIntersection<import("better-auth").ZodObject<{
                            userId: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                            role: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            userId?: string | undefined;
                            role?: string | undefined;
                        }, {
                            userId?: string | undefined;
                            role?: string | undefined;
                        }>, import("better-auth").ZodUnion<[import("better-auth").ZodObject<{
                            permission: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                            permissions: import("better-auth").ZodUndefined;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            permission: Record<string, string[]>;
                            permissions?: undefined;
                        }, {
                            permission: Record<string, string[]>;
                            permissions?: undefined;
                        }>, import("better-auth").ZodObject<{
                            permission: import("better-auth").ZodUndefined;
                            permissions: import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString, "many">>;
                        }, "strip", import("better-auth").ZodTypeAny, {
                            permissions: Record<string, string[]>;
                            permission?: undefined;
                        }, {
                            permissions: Record<string, string[]>;
                            permission?: undefined;
                        }>]>>;
                        metadata: {
                            openapi: {
                                description: string;
                                requestBody: {
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object";
                                                properties: {
                                                    permission: {
                                                        type: string;
                                                        description: string;
                                                        deprecated: boolean;
                                                    };
                                                    permissions: {
                                                        type: string;
                                                        description: string;
                                                    };
                                                };
                                                required: string[];
                                            };
                                        };
                                    };
                                };
                                responses: {
                                    "200": {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        error: {
                                                            type: string;
                                                        };
                                                        success: {
                                                            type: string;
                                                        };
                                                    };
                                                    required: string[];
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            $Infer: {
                                body: ({
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
                                };
                            };
                        };
                    } & {
                        use: any[];
                    };
                    path: "/admin/has-permission";
                };
            };
            $ERROR_CODES: {
                readonly FAILED_TO_CREATE_USER: "Failed to create user";
                readonly USER_ALREADY_EXISTS: "User already exists";
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
            };
            schema: {
                user: {
                    fields: {
                        role: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                        banned: {
                            type: "boolean";
                            defaultValue: false;
                            required: false;
                            input: false;
                        };
                        banReason: {
                            type: "string";
                            required: false;
                            input: false;
                        };
                        banExpires: {
                            type: "date";
                            required: false;
                            input: false;
                        };
                    };
                };
                session: {
                    fields: {
                        impersonatedBy: {
                            type: "string";
                            required: false;
                        };
                    };
                };
            };
        }[];
        databaseHooks: {
            user: {
                create: {
                    before: (userData: {
                        id: string;
                        name: string;
                        emailVerified: boolean;
                        email: string;
                        createdAt: Date;
                        updatedAt: Date;
                        image?: string | null | undefined;
                    }) => Promise<{
                        data: {
                            role: string;
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    } | {
                        data: {
                            id: string;
                            name: string;
                            emailVerified: boolean;
                            email: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    }>;
                };
            };
        };
    };
    $context: Promise<import("better-auth").AuthContext>;
    $Infer: {
        Session: {
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
        };
    };
    $ERROR_CODES: {
        readonly FAILED_TO_CREATE_USER: "Failed to create user";
        readonly USER_ALREADY_EXISTS: "User already exists";
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
    } & {
        USER_NOT_FOUND: string;
        FAILED_TO_CREATE_USER: string;
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
        USER_ALREADY_EXISTS: string;
        EMAIL_CAN_NOT_BE_UPDATED: string;
        CREDENTIAL_ACCOUNT_NOT_FOUND: string;
        SESSION_EXPIRED: string;
        FAILED_TO_UNLINK_LAST_ACCOUNT: string;
        ACCOUNT_NOT_FOUND: string;
        USER_ALREADY_HAS_PASSWORD: string;
    };
};
//# sourceMappingURL=auth.d.ts.map