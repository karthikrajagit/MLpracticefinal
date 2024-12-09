import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInstart: (state) => {
            state.loading = true;
        },
        signInsuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInfailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.user = null;
        }
    },
    
})

export const { signInsuccess, signInfailure, signInstart } = userSlice.actions;
export default userSlice.reducer;