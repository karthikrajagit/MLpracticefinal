import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    problem: null,
    loading: false,
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        uploadStart: (state) => {
            state.loading = true;
        },
        uploadSuccess: (state, action) => {
            state.admin = action.payload;
            state.loading = false;
        },
        uploadFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
    
})

export const { uploadStart, uploadSuccess, uploadFailure  } = adminSlice.actions;
export default adminSlice.reducer;