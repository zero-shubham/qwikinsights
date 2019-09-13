export const loadLocalStorage = (key) => {
    let data = window.localStorage.getItem(key);
    return data;
};

export const dumpLocalStorage = (key, data) => {
    window.localStorage.setItem(key, JSON.stringify(data));
}