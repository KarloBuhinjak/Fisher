import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { firestore } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const AddFish = ({ user }) => {
  const [species, setSpecies] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleSaveFish = async () => {
    if (species && weight && length && location) {
      try {
        await addDoc(collection(firestore, "fish_catches"), {
          species,
          weight: parseFloat(weight),
          length: parseFloat(length),
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: location.latitudeDelta,
          longitudeDelta: location.longitudeDelta,
          createdAt: serverTimestamp(),
          userId: user.uid,
        });

        Alert.alert("Success", "Fish data saved successfully!");
        setSpecies("");
        setWeight("");
        setLength("");
        navigation.goBack();
      } catch (error) {
        console.error("Error saving fish data: ", error);
        Alert.alert("Error", "Failed to save fish data.");
      }
    } else {
      Alert.alert(
        "Error",
        "Please fill in all fields and ensure location is available."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.label}>Species:</Text>
          <TextInput
            style={styles.input}
            value={species}
            onChangeText={setSpecies}
            placeholder="Enter species"
          />
          <Text style={styles.label}>Weight (kg):</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter weight"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Length (cm):</Text>
          <TextInput
            style={styles.input}
            value={length}
            onChangeText={setLength}
            placeholder="Enter length"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveFish}>
            <Text style={styles.saveButtonText}>Save Fish</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eaf2f8", // Light blue background color
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#4caf50", // Green color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddFish;
