import {LoginResponse} from "../models/LoginResponse.ts";
import {config} from "../config.ts";

export const getUserAuth = ():LoginResponse => {
    return JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string) as LoginResponse;
}

export const setUserAuth = (userAuth: LoginResponse): void => {
    localStorage.setItem(config.localStorageKeys.userAuth, JSON.stringify(userAuth))
}

export const removeUserAuth = (): void => {
    localStorage.removeItem(config.localStorageKeys.userAuth);

}