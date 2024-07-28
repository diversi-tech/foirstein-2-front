import {produce} from 'immer'

export const InitialState={
    //רשימה שתמולא מהשרת
    userList:[
       
    ],
    currentUser:{

    }
     
}


export const userReducer = produce((state, action) => {
  switch (action.type) {
      case 'FILL_DATA':
          state.userList = action.payload;
          break;
      case 'FILL_DATA_CURRENT_USER':
          state.currentUser = action.payload;
          break;
      case 'GET_DATA_CURRENT_USER':
          return state.currentUser;
      default:
          return state;
  }
}, InitialState);

