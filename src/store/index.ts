import {configureStore, createSlice} from "@reduxjs/toolkit";
import {WeightEntry} from "../models/weight-entry";

const initialState: {weightEntries: WeightEntry[]} = {weightEntries: []};

const state = createSlice({
    name: "state",
    initialState: initialState,
    reducers: {
        addWeightEntry(state, action) {
            state.weightEntries.push(action.payload);
        },
        setWeightEntries(state, action) {
            state.weightEntries = action.payload;
        }
    }
});

const store = configureStore({
    reducer: state.reducer
});
export const stateActions = state.actions;
export default store;