import {url} from "../settings/variables";


export const callSigninOrSignup = async (endpoint, body) => {
    return fetch(`${url}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
        });
};

export const get = async (endpoint,csrf) => {
    return fetch(`${url}/${endpoint}`,{
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf
        }
    });
};

export const post = async (endpoint, csrf="", body) => {
    return fetch(`${url}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf
        },
        credentials: "include",
        body: JSON.stringify(body)
        });
};

export const del = async (endpoint, csrf="", body) => {
    return fetch(`${url}/${endpoint}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf
        },
        credentials: "include",
        body: JSON.stringify(body)
        });
};
