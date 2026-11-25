// Redux slice for small interface state (NOT server data):
// which menus/drawers are open.
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isMobileMenuOpen: boolean; // hamburger menu on small screens
  isCartDrawerOpen: boolean; // slide-over cart preview
}

const initialState: UiState = {
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false;
    },
    toggleCartDrawer(state) {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    closeCartDrawer(state) {
      state.isCartDrawerOpen = false;
    },
    setCartDrawer(state, action: PayloadAction<boolean>) {
      state.isCartDrawerOpen = action.payload;
    },
  },
});

export const { toggleMobileMenu, closeMobileMenu, toggleCartDrawer, closeCartDrawer, setCartDrawer } =
  uiSlice.actions;
export default uiSlice.reducer;
