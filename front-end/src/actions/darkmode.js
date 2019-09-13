
import {dumpLocalStorage} from "../settings/functions";

export const toggleDarkmode = (mode) => {
    dumpLocalStorage("darkmode-qwikinsights", mode);
    return {
        type: "TOGGLE",
        darkmode: mode 
    }
};