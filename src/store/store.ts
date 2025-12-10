import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./slices/bookingDetails";

const store = configureStore({
    reducer: {
        booking: bookingReducer,
    },
});


export default store