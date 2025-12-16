import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pickupLocation: null,
    dropLocation: null,
    pickupDateTime: null,
    dropDateTime: null,
    userDetails: {
        name: "",
        phone: "",
        email: "",
    },
    carDetails: {
        category: "",
        pricePerDay: 0,
    },
    pricing: {
        rentalDays: 0,
        totalAmount: 0,
    },
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        // Locations
        setPickupLocation: (state, action) => {
            state.pickupLocation = action.payload;
        },
        setDropLocation: (state, action) => {
            state.dropLocation = action.payload;
        },

        // Date & time
        setPickupDateTime: (state, action) => {
            state.pickupDateTime = action.payload;
        },
        setDropDateTime: (state, action) => {
            state.dropDateTime = action.payload;
        },

        // Car
        setCarDetails: (state, action) => {
            state.carDetails = action.payload;
        },

        // User
        setUserDetails: (state, action) => {
            state.userDetails = {
                ...state.userDetails,
                ...action.payload,
            };
        },

        setPricing: (state, action) => {
            state.pricing = action.payload;
        },

        resetBooking: () => initialState,
    },
});

export const {
    setPickupLocation,
    setDropLocation,
    setPickupDateTime,
    setDropDateTime,
    setCarDetails,
    setUserDetails,
    setPricing,
    resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
