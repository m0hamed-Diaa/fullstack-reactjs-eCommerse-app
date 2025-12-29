export interface ICategory {
    documentId: string;
    title: string;
    id: number;
}
interface IThumbnail {
    id: number;
    name?: string;
    formats?: {
        thumbnail?: {
            url: string;
        };
        small?: {
            url: string;
        };
        medium?: {
            url: string;
        };
        large?: {
            url: string;
        };
    };
    url?: string;
}

export interface IProducts {
    id: number;
    title: string;
    documentId: string;
    description: string;
    price: number;
    stock: number;
    categories: ICategory[];
    thumbnail: IThumbnail;
    quantity: number;
    createdAt: string;
    category?: string;
}

export interface IEditProducts {
    price: number;
    stock: number;
    title: string;
    categories?: string[];
    description: string;
    thumbnail?: IThumbnail | null;
}

export interface IRegisterInput {
    name: "email" | "username" | "password";
    placeholder: string;
    type: string;
    validation: {
        required?: boolean;
        minLength?: number;
        pattern?: RegExp;
    };
}

export interface ILoginInput {
    name: "identifier" | "password";
    placeholder: string;
    type: string;
    validation: {
        required?: boolean;
        minLength?: number;
        pattern?: RegExp;
    };
}

export interface IErrorResponse {
    error: {
        details?: {
            errors: {
                message: string;
            }[];
        };
        message?: string;
    };
}

export interface IUserInfo {
    jwt: string;
    createdAt: string;
    userName: string;
    email: string;
    provider?: string;
}