import {csrf_tokens} from "../settings/variables";

const csrfReducer = (state=csrf_tokens, action) => {
    switch(action.type){
        case "UPDATE":
            if(action.csrf){
                return{
                    ...action.csrf
                };
            }else{
                return state;
            }
            
        default:
            return state;
    }
};

export default csrfReducer;