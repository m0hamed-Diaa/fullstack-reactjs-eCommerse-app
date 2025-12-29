import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store';

interface IProps {
    isOnline: boolean;
}

const initialState: IProps = {
    isOnline: true,
}

const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        networkMode: (state, action: PayloadAction<boolean>) => {
            state.isOnline = action.payload
        }
    },
})

export const { networkMode } = networkSlice.actions;
export const networkSelector = (state: RootState) => state.network;

export default networkSlice.reducer;

