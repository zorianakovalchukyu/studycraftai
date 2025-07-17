import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DocumentCard = ({ name, url, date, type = "PDF" }) => {
  const openFile = () => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Ionicons name="document-text-outline" size={28} color="#888" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>
            {type} · {date}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={openFile} style={styles.button}>
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: "#777",
  },
  button: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default DocumentCard;
