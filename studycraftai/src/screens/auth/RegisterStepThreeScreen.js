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
import { firebase } from "../../services/FirebaseService";
import { useRoute } from "@react-navigation/native";

const RegisterStepThreeScreen = () => {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
  const strength = [minLength, hasNumber, hasSymbol].filter(Boolean).length;

  const isValid = minLength && hasNumber && hasSymbol;

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

          <Text style={styles.title}>Create your password 3 / 3</Text>

          <View style={styles.steps}>
            <View style={styles.stepActive} />
            <View style={styles.stepActive} />
            <View style={styles.stepActive} />
          </View>

          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry={!visible}
              onChangeText={setPassword}
              value={password}
            />

            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Ionicons
                name={visible ? "eye" : "eye-off"}
                size={20}
                color="#444"
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.progressBar,
              strength === 1
                ? styles.red
                : strength === 2
                ? styles.orange
                : strength === 3
                ? styles.green
                : styles.gray,
            ]}
          />
          <View style={styles.criteria}>
            <Text style={[styles.criterion, minLength && styles.valid]}>
              ● 8 characters minimum
            </Text>
            <Text style={[styles.criterion, hasNumber && styles.valid]}>
              ● a number
            </Text>
            <Text style={[styles.criterion, hasSymbol && styles.valid]}>
              ● a symbol
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, isValid ? styles.active : styles.disabled]}
            disabled={!isValid}
            onPress={async () => {
              if (!isValid) return;
              try {
                await firebase
                  .auth()
                  .createUserWithEmailAndPassword(email, password);
                navigation.navigate("RegisterSuccess");
              } catch (error) {
                alert("Registration failed: " + error.message);
              }
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

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
  title: { fontSize: 20, fontWeight: "600", marginTop: 16, marginBottom: 12 },
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
  label: { marginBottom: 8, fontSize: 14 },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 20,
    width: "100%",
    backgroundColor: "#ddd",
  },
  gray: {
    color: "black",
    width: "100%",
  },
  red: {
    backgroundColor: "red",
    width: "33%",
  },
  orange: {
    backgroundColor: "orange",
    width: "66%",
  },
  green: {
    backgroundColor: "green",
    width: "100%",
  },

  criteria: {
    marginBottom: 24,
  },
  criterion: {
    color: "#999",
    marginBottom: 6,
  },
  valid: {
    color: "purple",
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  active: {
    backgroundColor: "#000",
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  policy: {
    marginTop: 40,
    fontSize: 12,
    textAlign: "center",
    color: "#999",
  },
  link: {
    fontWeight: "600",
    color: "#000",
  },
});

export default RegisterStepThreeScreen;
