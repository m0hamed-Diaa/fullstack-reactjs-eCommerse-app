import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartSlice from './features/cart/cartSlice'
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import { adminApiSlice } from './services/products';
import networkSlice from './features/networkSlice';

// LocalStorage
const persistCartConfig = {
    key: "cart",
    storage
}

const persistCart = persistReducer(persistCartConfig, cartSlice)

const store = configureStore({
    reducer: {
        cart: persistCart,
        network: networkSlice,
        [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(adminApiSlice.middleware),
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
// LocalStorage
export const persistor = persistStore(store);

export default store;
