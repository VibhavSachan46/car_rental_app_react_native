import Toast from "react-native-toast-message";
import { getItem, setItem } from "../storage/mmkv";

const SNOOZE_DURATION = 1 * 60 * 1000;

type Booking = {
    id: string;
    pickupDateTime: number; // timestamp
    dropDateTime: number;

    pickupLocation?: {
        address?: string;
    } | null;

    status?: "UPCOMING" | "COMPLETED";
};

export const showUpcomingBookingReminder = () => {
    const json = getItem("bookings");
    if (!json) return;

    const bookings: Booking[] = JSON.parse(json);
    const now = Date.now();

    const upcoming = bookings
        .filter((b) => typeof b.pickupDateTime === "number")
        .filter((b) => b.pickupDateTime > now)
        .sort((a, b) => a.pickupDateTime - b.pickupDateTime);

    if (upcoming.length === 0) return;

    const booking = upcoming[0];

    const diffMinutes =
        (booking.pickupDateTime - now) / (1000 * 60);

    if (diffMinutes <= 0) return;

    const reminderKey = `reminder_${booking.id}_${booking.pickupDateTime}`;
    const dismissKey = `dismissed_${booking.id}_${booking.pickupDateTime}`;

    const snoozedUntil = Number(getItem(reminderKey) || 0);
    if (now < snoozedUntil) return;

    if (getItem(dismissKey) === "true") return;


    let timeText = "";
    if (diffMinutes < 60) {
        timeText = `Pickup in ${Math.floor(diffMinutes)} minutes`;
    } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        timeText = `Pickup in ${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
        const days = Math.floor(diffMinutes / 1440);
        timeText = `Pickup in ${days} day${days > 1 ? "s" : ""}`;
    }

    const pickupLocation =
        booking.pickupLocation?.address || "Unknown location";

    Toast.show({
        type: "info",
        text1: "Upcoming Trip 🚗",
        text2: timeText,
        position: "top",
        visibilityTime: 0,
        autoHide: false,
        props: {
            bookingId: booking.id,
            pickupLocation,
            onSnooze: () => handleSnooze(booking),
            onDismiss: () => handleDismiss(booking),
        },
    });
};

const handleSnooze = (booking: Booking) => {
    const reminderKey = `reminder_${booking.id}_${booking.pickupDateTime}`;
    const snoozeUntil = Date.now() + SNOOZE_DURATION;

    setItem(reminderKey, snoozeUntil.toString());
    Toast.hide();
};

const handleDismiss = (booking: Booking) => {
    const dismissKey = `dismissed_${booking.id}_${booking.pickupDateTime}`;
    setItem(dismissKey, "true");
    Toast.hide();
};

export const cleanupOldReminders = () => {
    const json = getItem("bookings");
    if (!json) return;

    const bookings: Booking[] = JSON.parse(json);
    const now = Date.now();

    bookings.forEach((b) => {
        if (typeof b.pickupDateTime !== "number") return;

        if (b.pickupDateTime < now) {
            const dismissKey = `dismissed_${b.id}_${b.pickupDateTime}`;
            const reminderKey = `reminder_${b.id}_${b.pickupDateTime}`;

            setItem(dismissKey, "false");
            setItem(reminderKey, "0");
        }
    });
};
