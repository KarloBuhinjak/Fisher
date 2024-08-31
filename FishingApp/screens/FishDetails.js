import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const FishDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fish } = route.params;

  const [fishData, setFishData] = useState(fish);

  const fetchFishData = useCallback(async () => {
    try {
      const fishRef = doc(firestore, "fish_catches", fish.id);
      const docSnap = await getDoc(fishRef);
      if (docSnap.exists()) {
        setFishData({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert("Error", "No such document!");
      }
    } catch (error) {
      console.error("Error fetching fish data: ", error);
      Alert.alert("Error", "Failed to fetch fish data.");
    }
  }, [fish.id]);

  useFocusEffect(
    useCallback(() => {
      fetchFishData();
    }, [fetchFishData])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          Species: <Text style={styles.detailValue}>{fishData.species}</Text>
        </Text>
        <Text style={styles.detailText}>
          Weight: <Text style={styles.detailValue}>{fishData.weight} kg</Text>
        </Text>
        <Text style={styles.detailText}>
          Length: <Text style={styles.detailValue}>{fishData.length} cm</Text>
        </Text>
        <Text style={styles.detailText}>
          Date:{" "}
          <Text style={styles.detailValue}>
            {fishData.createdAt?.toDate().toLocaleDateString() ||
              "Unknown Date"}
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => navigation.navigate("Update Fish", { fish: fishData })}
        >
          <Text style={styles.updateButtonText}>Update Details</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: fishData.latitude,
          longitude: fishData.longitude,
          latitudeDelta: fishData.latitudeDelta || 0.0922,
          longitudeDelta: fishData.longitudeDelta || 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: fishData.latitude,
            longitude: fishData.longitude,
          }}
          title="Catch Location"
          description={fishData.species}
        />
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f7fa", // Light cyan background color
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 8,
    color: "#00796b", // Teal color for better readability
  },
  detailValue: {
    fontWeight: "bold",
  },
  updateButton: {
    marginTop: 16,
    backgroundColor: "#00796b", // Teal color for the button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  map: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default FishDetails;
