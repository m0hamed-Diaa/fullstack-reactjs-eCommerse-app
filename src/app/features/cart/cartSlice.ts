import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IProducts } from '@/interfaces';
import type { RootState } from '@/app/store';
import { addItemToShoppingCart } from '@/utils';

interface CounterState {
  cartProducts: IProducts[];
}

const initialState: CounterState = {
  cartProducts: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCartAction: (state, action: PayloadAction<IProducts>) => {
      state.cartProducts = addItemToShoppingCart(action.payload, state.cartProducts)
    },

    updateCartAction: (state, action: PayloadAction<IProducts[]>) => {
      state.cartProducts = action.payload;
    },

    clearCartAction: (state) => {
      state.cartProducts = [];
    }
  },
})

export const { addItemToCartAction, updateCartAction, clearCartAction } = cartSlice.actions;
export const cartSelector = (state: RootState) => state.cart;

export default cartSlice.reducer;

