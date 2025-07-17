import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const RegisterStepTwoScreen = () => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const navigation = useNavigation();
  const route = useRoute();
  const { email, code: realCode } = route.params;
  const isComplete = code.join("") === realCode;

  const handleInput = (index, value) => {
    const updatedCode = [...code];
    updatedCode[index] = value.slice(-1);
    setCode(updatedCode);
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

          <Text style={styles.title}>Verify your email 2 / 3</Text>

          {/* Steps */}
          <View style={styles.steps}>
            <View style={styles.stepActive} />
            <View style={styles.stepActive} />
            <View style={styles.stepInactive} />
          </View>

          <Text style={styles.subtitle}>
            We just sent a 5-digit code to{"\n"}
            <Text style={{ fontWeight: "bold" }}>{email}</Text>, enter it below:
          </Text>

          <View style={styles.codeRow}>
            {code.map((char, index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => handleInput(index, value)}
                value={char}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, !isComplete && styles.buttonDisabled]}
            onPress={() => navigation.navigate("RegisterStepThree", { email })}
            disabled={!isComplete}
          >
            <Text style={styles.buttonText}>Verify email</Text>
          </TouchableOpacity>

          <Text style={styles.linkText}>
            Wrong email?{" "}
            <Text style={styles.link}>Send to different email</Text>
          </Text>

          <Text style={styles.policyText}>
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
  title: { fontSize: 20, fontWeight: "600", marginTop: 16, marginBottom: 12 },
  subtitle: { fontSize: 14, color: "#444", marginBottom: 24 },
  steps: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
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
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    textAlign: "center",
    fontSize: 18,
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
  linkText: {
    textAlign: "center",
    marginTop: 16,
    color: "#444",
  },
  link: {
    color: "#000",
    fontWeight: "600",
  },
  policyText: {
    fontSize: 12,
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
  },
});

export default RegisterStepTwoScreen;
