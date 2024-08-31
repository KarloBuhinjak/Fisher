import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Funkcija za mapiranje Firebase grešaka na korisnički prijateljske poruke
const getErrorMessage = (error) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please use a different email.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/weak-password":
      return "The password is too weak. Please choose a stronger password.";
    case "auth/invalid-email":
      return "The email address is not valid. Please enter a valid email address.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    default:
      return "An unknown error occurred. Please try again.";
  }
};

// Funkcija za prikazivanje Alert poruka
const showAlert = (title, message) => {
  Alert.alert(title, message, [{ text: "OK" }]);
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const firebase_auth = auth;

  // Funkcija za prijavu
  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebase_auth, email, password);
      showAlert("Success", "Login successful!"); // Poruka za uspjeh
    } catch (error) {
      console.log(error);
      showAlert("Login Failed", getErrorMessage(error)); // Poruka za grešku
    } finally {
      setLoading(false);
    }
  };

  // Funkcija za registraciju
  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(firebase_auth, email, password);
      showAlert(
        "Success",
        "Account created successfully! Please check your email."
      ); // Poruka za uspjeh
    } catch (error) {
      console.log(error);
      showAlert("Sign Up Failed", getErrorMessage(error)); // Poruka za grešku
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        <Text style={styles.title}>Welcome to FishTracker</Text>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          onChangeText={(text) => setPassword(text)}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#006400" />
        ) : (
          <>
            <Button title="Login" onPress={signIn} color="#006400" />
            <Button title="Create account" onPress={signUp} color="#4682B4" />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Svjetloplava boja za pozadinu
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006400", // Tamnozelena boja
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#006400",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5", // Svjetlosiva boja za input polja
    color: "#333",
  },
});
