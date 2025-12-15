export type Booking = {
    id: number;
    name: string;
    phone: string;
    email: string;
    pickupDate: string;
    pickupTime: string;
    dropDate: string;
    pickupLocation: {
        latitude: number;
        longitude: number;
        address: string;
    };
    dropLocation: {
        latitude: number;
        longitude: number;
        address: string;
    };
};
