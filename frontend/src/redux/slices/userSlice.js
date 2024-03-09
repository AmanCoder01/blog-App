import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  error: null,
  loading: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state, action) => {
      state.error = null;
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    updateFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state, action) => {
      state.error = null;
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutSuccess: (state, action) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
})

// Action creators are generated for each case reducer function
export const {signOutSuccess, signInStart, signInSuccess, signInFailure, updateSuccess, updateFailure, updateStart,deleteUserStart,deleteUserSuccess,deleteUserFailure } = userSlice.actions

export default userSlice.reducer