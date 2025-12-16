import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import {
  setPickupDateTime,
  setDropDateTime,
  setUserDetails,
} from "../store/slices/bookingDetails";
import { getItem } from "../storage/mmkv";
import Toast from "react-native-toast-message";

const TripDetails = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropDate, setDropDate] = useState(new Date());

  const [pickupTime, setPickupTime] = useState(getDefaultPickupTime());

  const [showPickupDate, setShowPickupDate] = useState(false);
  const [showDropDate, setShowDropDate] = useState(false);
  const [showPickupTime, setShowPickupTime] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function getDefaultPickupTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }

  const combineDateAndTime = (date: Date, time: Date) => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };

  useEffect(() => {
    const stored = getItem("bookings");
    if (!stored) return;

    const bookings = JSON.parse(stored);
    if (!bookings.length) return;

    const last = bookings[bookings.length - 1];
    setName(last?.user?.name || "");
    setPhone(last?.user?.phone || "");
    setEmail(last?.user?.email || "");
  }, []);

  const handleContinue = () => {
    if (!name.trim() || !phone.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing details",
        text2: "Name and phone are required",
      });
      return;
    }

    const pickupDateTime = combineDateAndTime(pickupDate, pickupTime);
    const dropDateTime = combineDateAndTime(dropDate, pickupTime);

    if (dropDateTime <= pickupDateTime) {
      Toast.show({
        type: "error",
        text1: "Invalid dates",
        text2: "Drop time must be after pickup time",
      });
      return;
    }

    dispatch(setPickupDateTime(pickupDateTime));
    dispatch(setDropDateTime(dropDateTime));
    dispatch(setUserDetails({ name, phone, email }));

    navigation.navigate("Review");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Trip Details</Text>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.label}>Pickup Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPickupDate(true)}
          >
            <Text style={styles.dateText}>
              {pickupDate.toDateString()}
            </Text>
          </TouchableOpacity>

          {showPickupDate && (
            <DateTimePicker
              value={pickupDate}
              minimumDate={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, selected) => {
                setShowPickupDate(false);
                if (e.type === "dismissed" || !selected) return;

                setPickupDate(selected);
                if (selected > dropDate) setDropDate(selected);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Drop Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDropDate(true)}
          >
            <Text style={styles.dateText}>
              {dropDate.toDateString()}
            </Text>
          </TouchableOpacity>

          {showDropDate && (
            <DateTimePicker
              value={dropDate}
              minimumDate={pickupDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, selected) => {
                setShowDropDate(false);
                if (e.type === "dismissed" || !selected) return;
                setDropDate(selected);
              }}
            />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.label}>Pickup Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPickupTime(true)}
          >
            <Text style={styles.dateText}>
              {pickupTime.toTimeString().slice(0, 5)}
            </Text>
          </TouchableOpacity>

          {showPickupTime && (
            <DateTimePicker
              value={pickupTime}
              mode="time"
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, selected) => {
                setShowPickupTime(false);
                if (e.type === "dismissed" || !selected) return;

                const now = new Date();
                const chosen = combineDateAndTime(pickupDate, selected);

                if (
                  pickupDate.toDateString() === now.toDateString() &&
                  chosen < now
                ) {
                  Toast.show({
                    type: "error",
                    text1: "Invalid time",
                    text2: "Pickup time must be in the future",
                  });
                  return;
                }

                setPickupTime(selected);
              }}
            />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Passenger Details</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          placeholder="Email (optional)"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Review Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TripDetails;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#F6F8FA",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A8F8F",
    marginBottom: 20,
  },

  cardContainer: {
    gap: 22,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    gap: 20,
  },

  section: {
    gap: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  dateButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F2F4F7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  dateText: {
    fontSize: 16,
    color: "#333",
  },

  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F1F3F5",
    borderRadius: 12,
    fontSize: 15,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    color: "#222",
  },

  bottomContainer: {
    width: "100%",
    marginBottom: 80,
  },

  continueBtn: {
    width: "100%",
    backgroundColor: "#0A8F8F",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 6,
  },

  continueText: {
    color: "white",
    fontWeight: "700",
    fontSize: 17,
  },
});
