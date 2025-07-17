import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={require("../../assets/robot-background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.title}>
            Welcome to <Text style={{ fontWeight: "bold" }}>StudyCraftAI</Text>
          </Text>
          <Text style={styles.subtitle}>
            Join over 10,000 learners around the world{"\n"}and enjoy online
            education!
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CreateAccountOptions")}
          >
            <Text style={styles.buttonText}>Create an account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("LoginOptions")}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={{ fontWeight: "bold" }}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    padding: 30,
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  loginText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default WelcomeScreen;
