import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import axios from "axios";
import { firestore } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { auth } from "../firebase";

const FishList = ({ user }) => {
  const [fishes, setFishes] = useState([]);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();

  const fetchFishData = async () => {
    if (!user) {
      console.error("User not found, cannot fetch fish data.");
      return;
    }

    try {
      const q = query(
        collection(firestore, "fish_catches"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const fishData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFishes(fishData);
    } catch (error) {
      console.error("Error fetching fish data: ", error);
    }
  };

  const fetchWeatherData = async () => {
    if (location) {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,wind_speed_10m`
        );
        setWeather(response.data.current);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
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
        });
      })();
    }, [])
  );

  useEffect(() => {
    fetchFishData();
    fetchWeatherData();
  }, [location]);

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this fish?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, "fish_catches", id));
              fetchFishData();
              Alert.alert("Success", "Fish data deleted successfully!");
            } catch (error) {
              console.error("Error deleting fish data: ", error);
              Alert.alert("Error", "Failed to delete fish data.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => navigation.navigate("Fish Details", { fish: item })}
      >
        <Text style={styles.itemText}>Species: {item.species}</Text>
        <Text style={styles.itemText}>
          Date:{" "}
          {item.createdAt?.toDate().toLocaleDateString() || "Unknown Date"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => auth.signOut()}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weatherContainer}>
        {weather ? (
          <Text style={styles.weatherText}>
            Current Temperature: {weather.temperature_2m}°C, Wind Speed:{" "}
            {weather.wind_speed_10m} km/h
          </Text>
        ) : (
          <Text style={styles.weatherText}>Fetching weather data...</Text>
        )}
        {user && (
          <Text style={styles.userEmail}>Logged in as: {user.email}</Text>
        )}
      </View>
      <FlatList
        data={fishes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Add Fish")}
      >
        <Text style={styles.addButtonText}>Add Fish</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f8ff", // Light blue background
  },
  headerContainer: {
    marginBottom: 16,
    alignItems: "flex-end", // Align button to the right
  },
  logoutButton: {
    backgroundColor: "#ff4500", // Orange red background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  weatherContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  weatherText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#006400", // Dark green text
    textAlign: "center", // Center align text
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "#4682B4", // Light blue color for email
    textAlign: "center", // Center align text
  },
  listContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff6347", // Tomato red for better visibility
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    marginTop: 16,
    backgroundColor: "#006400", // Dark green for Add Fish button
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FishList;
