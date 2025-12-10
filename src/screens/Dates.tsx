import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";

const Dates = () => {

  const [pickupDate, setpickupDate] = useState(new Date());
  const [pickupDateShow, setpickupDateShow] = useState(false);
  const [dropDate, setdropDate] = useState(new Date());
  const [dropDateShow, setdropDateShow] = useState(false);




  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={{ gap: 12 }}>
          <TouchableOpacity onPress={() => setpickupDateShow(true)}>
            <Text>Select pickup date</Text>
          </TouchableOpacity>
          {
            pickupDateShow && (
              <DateTimePicker
                value={pickupDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setpickupDateShow(false);
                  if (event.type === "dismissed") return;
                  if (selectedDate) {
                    setpickupDate(selectedDate);
                  }
                }}
              />
            )
          }
          <View style={styles.dateDisplay}>
            <Text>{pickupDate.toDateString()}</Text>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <TouchableOpacity onPress={() => setdropDateShow(true)}>
            <Text>Select pickup date</Text>
          </TouchableOpacity>
          <View>
            {
              dropDateShow && (
                <DateTimePicker
                  value={dropDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setdropDateShow(false);
                    if (event.type === "dismissed") return;
                    if (selectedDate) {
                      setdropDate(selectedDate);
                    }
                  }}
                />
              )
            }
          </View>
          <View style={styles.dateDisplay}>
            <Text>{dropDate.toDateString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.continueBtn}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dates;

const styles = StyleSheet.create({
  container: {
    height: "100%",

    marginTop: 40,
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "space-between"
  },
  box: {
    gap: 42,
    width: "100%"
  },
  dateDisplay: {
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12
  },
  bottomContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  continueBtn: {
    width: "100%",
    backgroundColor: "#0A8F8F",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  continueText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
