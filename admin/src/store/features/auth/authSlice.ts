import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

interface AuthState {
  user: { id: string; name: string } | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("jwt") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: { id: string; name: string };
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { user, access_token } = action.payload;
        state.user = user;
        state.token = access_token;
      }
    );
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
