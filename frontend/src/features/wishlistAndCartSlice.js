import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  wishlist: [],
  cart: [],
}
export const wishlistAndCartSlice = createSlice({
  name: "wishlistAndCartSlice",
  initialState,
  reducers: {
    setWishlist: (state, { payload }) => {
      payload = payload ? payload : []
      state.wishlist = payload
    },
    setCart: (state, { payload }) => {
      state.cart = payload
    },
    clearCart: (state) => {
      state.cart = []
      state.wishlist = []
    },
  },
})

export const { setWishlist, setCart, clearCart } = wishlistAndCartSlice.actions

export default wishlistAndCartSlice.reducer
