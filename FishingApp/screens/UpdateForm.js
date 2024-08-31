import React, { useState } from "react";
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
import { firestore } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const UpdateFish = ({ route, navigation }) => {
  const { fish } = route.params;

  const [species, setSpecies] = useState(fish.species);
  const [weight, setWeight] = useState(fish.weight.toString());
  const [length, setLength] = useState(fish.length.toString());

  const handleUpdateFish = async () => {
    if (species && weight && length) {
      try {
        const fishRef = doc(firestore, "fish_catches", fish.id);
        await updateDoc(fishRef, {
          species,
          weight: parseFloat(weight),
          length: parseFloat(length),
        });

        Alert.alert("Success", "Fish data updated successfully!");
        navigation.goBack(); // Navigate back to the FishDetails screen
      } catch (error) {
        console.error("Error updating fish data: ", error);
        Alert.alert("Error", "Failed to update fish data.");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields.");
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
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateFish}
          >
            <Text style={styles.updateButtonText}>Update Fish</Text>
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
    backgroundColor: "#f0f8ff", // Light blue background color
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
    color: "#333",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
  updateButton: {
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
  updateButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UpdateFish;
