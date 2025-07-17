import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";

const LoginOptionsScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Log into account</Text>
      <Text style={styles.subtitle}>
        Welcome back!{"\n"}Let’s continue learning
      </Text>

      <TouchableOpacity
        style={styles.emailButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.emailButtonText}>Continue with email</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.socialButton}>
        <Text>🍎 Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Text>📘 Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Text>🌐 Continue with Google</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By using StudyCraftAI, you agree to the{" "}
        <Text style={styles.link}>Terms and Privacy Policy</Text>.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  back: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    marginBottom: 24,
  },
  emailButton: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 14,
  },
  emailButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 12,
  },
  socialButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  terms: {
    marginTop: 30,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  link: {
    color: "#000",
    fontWeight: "600",
  },
});

export default LoginOptionsScreen;
