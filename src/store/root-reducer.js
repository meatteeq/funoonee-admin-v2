import { combineReducers } from "@reduxjs/toolkit";
import { reducer as calendarReducer } from "../slices/calendar";
import { reducer as userReducer } from "../slices/chat";
import { reducer as kanbanReducer } from "../slices/kanban";
import { reducer as mailReducer } from "../slices/mail";

export const rootReducer = combineReducers({
  calendar: calendarReducer,
  auth: userReducer,
  kanban: kanbanReducer,
  mail: mailReducer,
});
