import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pickupDate: null,
    dropDate: null,
    pickupLocation: null,
    dropLocation: null,
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
        setPickupLocation: (state, action) => {
            state.pickupLocation = action.payload;
        },
        setDropLocation: (state, action) => {
            state.dropLocation = action.payload;
        },
        setUserDetails: (state, action) => {
            state.userDetails = { ...state.userDetails, ...action.payload };
        },
        resetBooking: (state) => {
            state.pickupDate = null;
            state.dropDate = null;
            state.pickupLocation = null;
            state.dropLocation = null;
            state.userDetails = {
                name: "",
                phone: "",
                email: "",
            };
        },
    },
});

export const {
    setPickupDate,
    setDropDate,
    setPickupLocation,
    setDropLocation,
    setUserDetails, resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;
