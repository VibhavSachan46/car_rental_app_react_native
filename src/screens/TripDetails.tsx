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
  setPickupDate,
  setDropDate,
  setPickupTime,
  setUserDetails,
} from "../store/slices/bookingDetails";
import { getItem } from "../storage/mmkv";
import Toast from "react-native-toast-message";

const TripDetails = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const [pickupDate, setPickupDateState] = useState(new Date());
  const [pickupDateShow, setPickupDateShow] = useState(false);

  const [dropDate, setDropDateState] = useState(new Date());
  const [dropDateShow, setDropDateShow] = useState(false);

  const [pickupTime, setPickupTimeState] = useState(generateDefaultTime());
  const [pickupTimeShow, setPickupTimeShow] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function generateDefaultTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now;
  }

  useEffect(() => {
    const stored = getItem("bookings");
    if (!stored) return;

    const list = JSON.parse(stored);
    if (!list.length) return;

    const last = list[list.length - 1];
    setName(last.name || "");
    setPhone(last.phone || "");
    setEmail(last.email || "");
  }, []);

  function handleContinue() {
    dispatch(setPickupDate(pickupDate.toDateString()));
    dispatch(setDropDate(dropDate.toDateString()));
    dispatch(setPickupTime(pickupTime.toTimeString().slice(0, 5)));
    dispatch(setUserDetails({ name, phone, email }));

    navigation.navigate("Review");
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Trip Details</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>Pickup Date</Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setPickupDateShow(true)}
            >
              <Text style={styles.dateText}>{pickupDate.toDateString()}</Text>
            </TouchableOpacity>

            {pickupDateShow && (
              <DateTimePicker
                value={pickupDate}
                minimumDate={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selected) => {
                  setPickupDateShow(false);
                  if (event.type === "dismissed") return;

                  if (selected) {
                    setPickupDateState(selected);
                    if (selected > dropDate) setDropDateState(selected);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Drop Date</Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setDropDateShow(true)}
            >
              <Text style={styles.dateText}>{dropDate.toDateString()}</Text>
            </TouchableOpacity>

            {dropDateShow && (
              <DateTimePicker
                value={dropDate}
                minimumDate={pickupDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selected) => {
                  setDropDateShow(false);
                  if (event.type === "dismissed") return;

                  if (selected) setDropDateState(selected);
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
              onPress={() => setPickupTimeShow(true)}
            >
              <Text style={styles.dateText}>
                {pickupTime.toTimeString().slice(0, 5)}
              </Text>
            </TouchableOpacity>

            {pickupTimeShow && (
              <DateTimePicker
                value={pickupTime}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selected) => {
                  setPickupTimeShow(false);
                  if (event.type === "dismissed") return;
                  if (!selected) return;

                  const now = new Date();
                  const chosen = new Date(pickupDate);
                  chosen.setHours(selected.getHours());
                  chosen.setMinutes(selected.getMinutes());

                  if (pickupDate.toDateString() === now.toDateString()) {
                    if (chosen < now) {
                      Toast.show({
                        type: "error",
                        text1: "Booking Confirmed",
                        text2: "Pickup date cannot be greater than drop date",
                      });
                      return;
                    }
                  }

                  setPickupTimeState(selected);
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Passenger Details</Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#999"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      {/* SUBMIT */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
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
