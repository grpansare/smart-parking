// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from '../Store/UserSlice/UserSlice'
// const store=configureStore({
//     reducer:{
//           user:userReducer
//     }
// })

// export default store



import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice/UserSlice'
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";


const rootReducer=combineReducers({user:userReducer})
const persistConfig={
    key:'root',
    version:1,
    storage
}
const persistedReducer=persistReducer(persistConfig,rootReducer);
export const store=configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck:false})
});

export const persister=persistStore(store)
