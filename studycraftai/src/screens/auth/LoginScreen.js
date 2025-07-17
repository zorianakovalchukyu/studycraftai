import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthProvider";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const isValid = email.includes("@") && password.length >= 6;

  const handleLogin = async () => {
    try {
      await login(email.trim(), password);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Alert.alert("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Incorrect password.");
      } else {
        Alert.alert("Login failed", error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Log into account</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.passwordField}
              placeholder="Enter password"
              secureTextEntry={!show}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShow(!show)}>
              <Ionicons
                name={show ? "eye" : "eye-off"}
                size={20}
                color="#444"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, !isValid && styles.disabled]}
            onPress={handleLogin}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <Text style={styles.forgot}>Forgot password?</Text>

          <Text style={styles.policy}>
            By using StudyCraftAI, you agree to the{" "}
            <Text style={styles.link}>Terms and Privacy Policy</Text>.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24, paddingTop: 60 },
  title: { fontSize: 20, fontWeight: "600", marginTop: 16, marginBottom: 24 },
  label: { fontSize: 14, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  passwordField: {
    flex: 1,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forgot: {
    color: "#444",
    textAlign: "center",
    marginBottom: 24,
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

export default LoginScreen;
