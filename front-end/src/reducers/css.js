import {darkmode} from "../settings/variables";

const defaultState = {
    darkmode: darkmode.mode,
    settings: false
}
const darkmodeReducer = (state=defaultState, action) => {
    switch(action.type){
        case "TOGGLE_DARKMODE":
            return {
                ...state,
                darkmode: action.darkmode
            }
        case "TOGGLE_SETTINGS":
            return {
                ...state,
                settings: action.settings
            }
        default:
            return state;
    }
};

export default darkmodeReducer;