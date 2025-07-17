import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "react-native";

const RegisterSuccessScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Image
        source={require("../../../assets/success-icon.jpg")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Your account{"\n"}was successfully created!
      </Text>
      <Text style={styles.subtitle}>
        Only one click to explore online education.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LoginOptions")}
      >
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <Text style={styles.policy}>
        By using StudyCraftAI, you agree to the{" "}
        <Text style={styles.link}>Terms and Privacy Policy</Text>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  policy: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  link: {
    fontWeight: "600",
    color: "#000",
  },
});

export default RegisterSuccessScreen;
