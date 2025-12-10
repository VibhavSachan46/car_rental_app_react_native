import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pickupDate: null,
    dropDate: null,
    location: null,
    userDetails: {
        name: "",
        phone: "",
        email: "",
    },
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setPickupDate: (state, action) => {
            state.pickupDate = action.payload;
        },
        setDropDate: (state, action) => {
            state.dropDate = action.payload;
        },
        setLocation: (state, action) => {
            state.location = action.payload;
        },
        setUserDetails: (state, action) => {
            state.userDetails = { ...state.userDetails, ...action.payload };
        },
    },
});

export const {
    setPickupDate,
    setDropDate,
    setLocation,
    setUserDetails,
} = bookingSlice.actions;

export default bookingSlice.reducer;
