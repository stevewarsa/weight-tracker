import {configureStore, createSlice} from "@reduxjs/toolkit";

const initialState = {weightEntries: []};

const state = createSlice({
    name: "state",
    initialState: initialState,
    reducers: {
        addWeightEntry(state, action) {
            state.weightEntries.push(action.payload);
        }
    }
});

const store = configureStore({
    reducer: state.reducer
});
export const stateActions = state.actions;
export default store;