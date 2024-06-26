export const FillData=(value)=>{
    return {type:'FILL_DATA',payload:value}
}

export const FillDataCurrentUser=(value)=>{
    return {type:'FILL_DATA_CURRENT_USER', payload: value}
}

export const getDataCurrentUser=()=>{
    return {type:'GET_DATA_CURRENT_USER'}
}
