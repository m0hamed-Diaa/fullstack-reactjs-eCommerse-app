import type { IUserInfo } from "@/interfaces";
import Cookies, { type CookieSetOptions } from "universal-cookie";

const defaultOptions: CookieSetOptions = {
    path: "/",
    sameSite: "lax",
};

const cookies = new Cookies();

class CookieServices {
    get(name: string) {
        return cookies.get(name);
    }

    set(name: string, value: IUserInfo, options?: CookieSetOptions) {
        cookies.set(name, value, {
            ...defaultOptions,
            ...options,
        });
    }

    remove(name: string, options?: CookieSetOptions) {
        cookies.remove(name, {
            ...defaultOptions,
            ...options,
        });
    }
}

export default new CookieServices();