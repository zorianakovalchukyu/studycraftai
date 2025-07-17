import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthProvider";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="person-circle" size={100} color="#5E5BFD" />

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Вийти</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#5E5BFD",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
