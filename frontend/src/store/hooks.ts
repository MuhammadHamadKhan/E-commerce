// Typed versions of useDispatch / useSelector, so TypeScript knows the
// exact shape of our state and actions.
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
