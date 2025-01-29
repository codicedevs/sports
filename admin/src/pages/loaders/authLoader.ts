// src/loaders/authLoader.ts
import { redirect } from "react-router-dom";
import store from "../../store";
import { authApi } from "../../store/features/auth/authApi";

export const authLoader = async () => {
  const token = store.getState().auth.token;

  if (!token) {
    return redirect("/login");
  }

  //   try {
  //     const result = await store.dispatch(
  //       authApi.endpoints.validateAuth.initiate()
  //     );
  //     if (!result.data) {
  //       throw new Error("Invalid token");
  //     }
  //   } catch {
  //     return redirect("/login");
  //   }

  return null; // Return any needed data if validation is successful
};
