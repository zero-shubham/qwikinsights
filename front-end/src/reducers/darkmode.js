import {darkmode} from "../settings/variables";

const darkmodeReducer = (state=darkmode, action) => {
    switch(action.type){
        case "TOGGLE":
            return {
                ...action.darkmode
            }
        default:
            return state;
    }
};

export default darkmodeReducer;