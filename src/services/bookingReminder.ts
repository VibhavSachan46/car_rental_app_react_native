import Toast from "react-native-toast-message";
import { getItem, setItem } from "../storage/mmkv";
import { Booking } from "../types/booking";

const SNOOZE_DURATION = 1 * 60 * 1000;

export const showUpcomingBookingReminder = () => {
    const json = getItem("bookings");
    if (!json) return;

    const bookings: Booking[] = JSON.parse(json);
    const now = new Date();

    const upcoming = bookings
        .filter(b => {
            if (!b.pickupDate || !b.pickupTime) return false;

            try {
                const [hours, minutes] = b.pickupTime.split(':').map(Number);
                const pickup = new Date(b.pickupDate);
                pickup.setHours(hours, minutes, 0, 0);

                return pickup > now;
            } catch {
                return false;
            }
        })
        .sort((a, b) => {
            const [aHours, aMinutes] = a.pickupTime.split(':').map(Number);
            const [bHours, bMinutes] = b.pickupTime.split(':').map(Number);

            const aTime = new Date(a.pickupDate);
            aTime.setHours(aHours, aMinutes, 0, 0);

            const bTime = new Date(b.pickupDate);
            bTime.setHours(bHours, bMinutes, 0, 0);

            return aTime.getTime() - bTime.getTime();
        });

    if (upcoming.length === 0) return;

    const booking = upcoming[0];
    const [hours, minutes] = booking.pickupTime.split(':').map(Number);
    const pickupTime = new Date(booking.pickupDate);
    pickupTime.setHours(hours, minutes, 0, 0);

    const diffMinutes = (pickupTime.getTime() - now.getTime()) / 60000;

    if (diffMinutes > 0) {
        const reminderKey = `reminder_${booking.id}_${booking.pickupDate}_${booking.pickupTime}`;
        const lastShown = getItem(reminderKey);

        const snoozedUntil = lastShown ? parseInt(lastShown) : 0;
        if (now.getTime() < snoozedUntil) {
            return;
        }

        const dismissKey = `dismissed_${booking.id}_${booking.pickupDate}_${booking.pickupTime}`;
        if (getItem(dismissKey) === "true") {
            return;
        }

        let timeText = "";
        if (diffMinutes < 60) {
            timeText = `Pickup in ${Math.floor(diffMinutes)} minutes`;
        } else if (diffMinutes < 1440) {

            const hours = Math.floor(diffMinutes / 60);
            timeText = `Pickup in ${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            const days = Math.floor(diffMinutes / 1440);
            timeText = `Pickup in ${days} day${days > 1 ? 's' : ''}`;
        }

        const pickupLocation = booking.pickupLocation?.address || "Unknown location";

        Toast.show({
            type: "info",
            text1: "Upcoming Trip",
            text2: timeText,
            position: "top",
            visibilityTime: 0,
            autoHide: false,
            props: {
                bookingId: booking.id,
                bookingDate: booking.pickupDate,
                bookingTime: booking.pickupTime,
                pickupLocation: pickupLocation,
                onSnooze: () => handleSnooze(booking),
                onDismiss: () => handleDismiss(booking),
            }
        });
    }
};

const handleSnooze = (booking: Booking) => {
    const reminderKey = `reminder_${booking.id}_${booking.pickupDate}_${booking.pickupTime}`;
    const snoozeUntil = Date.now() + SNOOZE_DURATION;
    setItem(reminderKey, snoozeUntil.toString());
    Toast.hide();
};

const handleDismiss = (booking: Booking) => {
    const dismissKey = `dismissed_${booking.id}_${booking.pickupDate}_${booking.pickupTime}`;
    setItem(dismissKey, "true");
    Toast.hide();
};

export const cleanupOldReminders = () => {
    const json = getItem("bookings");
    if (!json) return;

    const bookings: Booking[] = JSON.parse(json);
    const now = new Date();

    bookings.forEach(b => {
        if (!b.pickupDate || !b.pickupTime) return;

        try {
            const [hours, minutes] = b.pickupTime.split(':').map(Number);
            const pickup = new Date(b.pickupDate);
            pickup.setHours(hours, minutes, 0, 0);


            if (pickup.getTime() < now.getTime()) {
                const dismissKey = `dismissed_${b.id}_${b.pickupDate}_${b.pickupTime}`;
                const reminderKey = `reminder_${b.id}_${b.pickupDate}_${b.pickupTime}`;

                setItem(dismissKey, "false");
                setItem(reminderKey, "0");
            }
        } catch { }
    });
};