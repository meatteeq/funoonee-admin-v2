import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../__fake-api__/chat-api";
import { objFromArray } from "../utils/obj-from-array";
const authAsyncThunk = createAsyncThunk("auth/authSlice");
const initialState = {
  user: {},
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("action.payload", action?.payload);
      state.user = action.payload;
    },
  },
});
export const { login } = userSlice.actions;
export const { reducer } = userSlice;
