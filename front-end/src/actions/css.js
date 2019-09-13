
import {dumpLocalStorage} from "../settings/functions";

export const toggleDarkmode = (mode) => {
    dumpLocalStorage("darkmode-qwikinsights", mode);
    return {
        type: "TOGGLE_DARKMODE",
        darkmode: mode.mode 
    }
};
export const toggleSettingsCls = (cls) => {
    return {
        type: "TOGGLE_SETTINGS",
        settings: cls 
    };
};