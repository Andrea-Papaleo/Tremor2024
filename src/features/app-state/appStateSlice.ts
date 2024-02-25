import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { dataLoaded: boolean } = {
  dataLoaded: false,
};

export const appStateSlice = createSlice({
  name: "appState",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset(state) {
      state.dataLoaded = false;
    },

    setDataLoaded(state, action: PayloadAction<{ dataLoaded: boolean }>) {
      state.dataLoaded = action.payload.dataLoaded;
    },
  },
});
