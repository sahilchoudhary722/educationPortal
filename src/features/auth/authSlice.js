import { createSlice } from "@reduxjs/toolkit";
import userData from "../../data/userData";

const savedUser = JSON.parse(
  localStorage.getItem(
    "currentUser",
  ),
);

const savedUsers = JSON.parse(
  localStorage.getItem("users"),
);

const initialState = {
  currentUser:
    savedUser || null,

  isAuthenticated:
    !!savedUser,

  users:
    savedUsers || userData,

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginUser: (
      state,
      action,
    ) => {
      const {
        email,
        password,
        role,
      } = action.payload;

      const user =
        state.users.find(
          (item) =>
            item.email ===
              email &&
            item.password ===
              password &&
            item.role === role,
        );

      if (user) {
        state.currentUser =
          user;

        state.isAuthenticated =
          true;

        state.error = null;

        localStorage.setItem(
          "currentUser",
          JSON.stringify(user),
        );
      } else {
        state.error =
          "Invalid email or password";
      }
    },

    signupUser: (
      state,
      action,
    ) => {
      const userExists =
        state.users.find(
          (user) =>
            user.email ===
            action.payload.email,
        );

      if (userExists) {
        state.error =
          "Email already exists";

        return;
      }

    const newUser = action.payload;

      state.users.push(
        newUser,
      );

      localStorage.setItem(
        "users",
        JSON.stringify(
          state.users,
        ),
      );

      state.error = null;
    },

    logoutUser: (state) => {
      state.currentUser =
        null;

      state.isAuthenticated =
        false;

      state.error = null;

      localStorage.removeItem(
        "currentUser",
      );
    },

    updateProfile: (
      state,
      action,
    ) => {
      const updatedUser =
        action.payload;

      state.users =
        state.users.map(
          (user) =>
            user.id ===
            updatedUser.id
              ? updatedUser
              : user,
        );

      state.currentUser =
        updatedUser;

      localStorage.setItem(
        "users",
        JSON.stringify(
          state.users,
        ),
      );

      localStorage.setItem(
        "currentUser",
        JSON.stringify(
          updatedUser,
        ),
      );
    },

    forgotPassword: (
      state,
      action,
    ) => {
      const {
        email,
        newPassword,
      } = action.payload;

      const user =
        state.users.find(
          (u) =>
            u.email === email,
        );

      if (user) {
        user.password =
          newPassword;

        localStorage.setItem(
          "users",
          JSON.stringify(
            state.users,
          ),
        );

        state.error = null;
      } else {
        state.error =
          "Email not found";
      }
    },
  },
});

export const {
  loginUser,
  signupUser,
  logoutUser,
  updateProfile,
  forgotPassword,
} = authSlice.actions;

export default authSlice.reducer;