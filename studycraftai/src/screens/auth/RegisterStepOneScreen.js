import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { sendVerificationCode } from "../../services/EmailService";
import { firebase } from "../../services/FirebaseService";
const RegisterStepOneScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const isValid = email.includes("@") && email.includes(".");
  const handleNext = async () => {
    try {
      const methods = await firebase.auth().fetchSignInMethodsForEmail(email);

      if (methods.length === 0) {
        try {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, "test123");

          await firebase.auth().currentUser.delete();
          console.log("Це нова пошта");
        } catch (createErr) {
          if (createErr.code === "auth/email-already-in-use") {
            alert("Ця пошта вже зареєстрована.");
            navigation.navigate("Login");
            return;
          }
        }
      } else {
        alert("Ця пошта вже зареєстрована.");
        return;
      }

      await sendVerificationCode(email, code);
      navigation.navigate("RegisterStepTwo", { email, code });
    } catch (error) {
      alert("Помилка: " + error.message);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.wrapper}
      >
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Add your email 1 / 3</Text>
          <View style={styles.steps}>
            <View style={styles.stepActive} />
            <View style={styles.stepInactive} />
            <View style={styles.stepInactive} />
          </View>

          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 24,
    paddingTop: 60,
  },
  back: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  steps: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
  },
  stepActive: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#A88BFE",
  },
  stepInactive: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e0e0e0",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RegisterStepOneScreen;
