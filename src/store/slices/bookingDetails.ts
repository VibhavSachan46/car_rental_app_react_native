import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Locations
    pickupLocation: null,
    dropLocation: null,

    pickupDateTime: null,
    dropDateTime: null,

    // Selected car
    carDetails: {
        carId: null,
    },

    // User details
    userDetails: {
        name: "",
        phone: "",
        email: "",
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

        // Date + Time (TIMESTAMPS ONLY)
        setPickupDateTime: (state, action) => {
            state.pickupDateTime = action.payload;
        },
        setDropDateTime: (state, action) => {
            state.dropDateTime = action.payload;
        },

        // Car
        setCarId: (state, action) => {
            state.carDetails.carId = action.payload;
        },

        // User
        setUserDetails: (state, action) => {
            state.userDetails = {
                ...state.userDetails,
                ...action.payload,
            };
        },

        // Pricing
        setPricing: (state, action) => {
            state.pricing = action.payload;
        },

        // Reset
        resetBooking: () => initialState,
    },
});

export const {
    setPickupLocation,
    setDropLocation,
    setPickupDateTime,
    setDropDateTime,
    setCarId,
    setUserDetails,
    setPricing,
    resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
