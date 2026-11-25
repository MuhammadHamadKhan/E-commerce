// Redux stores the current bakery owner; the token stays in an HttpOnly cookie.
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, Bakery } from "@/lib/api/types";

interface AuthState {
  user: AuthUser | null;
  bakery: Bakery | null;
  status: "loading" | "loggedIn" | "loggedOut";
}

const initialState: AuthState = {
  user: null,
  bakery: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn(state, action: PayloadAction<{ user: AuthUser; bakery: Bakery | null }>) {
      state.user = action.payload.user;
      state.bakery = action.payload.bakery;
      state.status = "loggedIn";
    },
    logout(state) {
      state.user = null;
      state.bakery = null;
      state.status = "loggedOut";
    },
  },
});

export const { setLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;
