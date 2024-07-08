import { produce } from 'immer'

export const InitialState = {

    itemList: [

    ]
    
     
}


export const itemReducer = produce((state, action) => {
    switch (action.type) {
        case 'FILL_DATA':
            state.itemList = action.payload;
            break;
        case 'GET_DATA_CURRENT_USER':
            return state.itemList;
        default:
            return state;
    }
}, InitialState);