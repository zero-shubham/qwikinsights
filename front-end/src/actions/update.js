export const update = (_type,payload) => {
    return {
        type:  `UPDATE_${_type}`,
        payload 
    }
}