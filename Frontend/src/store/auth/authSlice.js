import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "not-authenticated", //'checking' 'authenticated' 'not-authenticated' 'verification-code'
    userId: null,
    errorMessage: null,
  },
  reducers: {
    // increment: (state /* action */) => {
    //   state.counter += 1;
    // }`,
    logIn: (state, { payload }) => {
      state.status = "authenticated";
      state.userId = payload?.username;
      state.errorMessage = null;
      state.userEmail = payload?.userEmail;
      state.userPassword = payload?.userPassword;
    },
    logOut: (state, { payload }) => {
      state.status = "not-authenticated";
      state.userId = null;
      state.errorMessage = payload?.errorMessage;
    },
    chekingCredentials: (state) => {
      state.status = "checking";
    },
    confirmCode: (state, { payload }) => {
      state.status = "confirm-code";
      state.userEmail = payload?.userEmail;
      state.userPassword = payload?.userPassword;
      state.errorMessage = payload?.errorMessage;
    },
    confirmCodeReset: (state, { payload }) => {
      state.status = "confirm-code-reset";
      state.userEmail = payload?.userEmail;
      state.userPassword = payload?.userPassword;
      state.errorMessage = payload?.errorMessage;
    },
  },
});

// Action creators are generated for each case reducer function
export const { logIn, logOut, chekingCredentials, confirmCode, confirmCodeReset } = authSlice.actions;
