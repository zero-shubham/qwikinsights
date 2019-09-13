const defaultTableData = {
    data: {},
    columns: []
}

const tableDataReducer = (state=defaultTableData, action) => {
    switch(action.type){
        case "UPDATE_TABLEDATA":
            return{
                data: action.payload.data,
                columns: action.payload.columns
            }
        case "SET_DEFAULT":
            return defaultTableData;
        default:
            return state;
    }
};

export default tableDataReducer;