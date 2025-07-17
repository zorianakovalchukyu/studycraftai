import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

const GlossaryTab = ({ terms = [] }) => {
  const formattedGlossary = terms
    .map((item) => `${item.term}\n- ${item.definition}`)
    .join("\n\n");

  const handleCopy = async () => {
    if (!formattedGlossary) return;
    await Clipboard.setStringAsync(formattedGlossary);
    Alert.alert("Copied glossary to clipboard");
  };

  const handleDownload = async () => {
    if (!formattedGlossary) return;

    try {
      const fileUri = FileSystem.documentDirectory + "Glossary.pdf"; 
      await FileSystem.writeAsStringAsync(fileUri, formattedGlossary);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Glossary saved", fileUri);
      }
    } catch (error) {
      Alert.alert("Download failed", error.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
          <Ionicons name="copy-outline" size={22} color="#A88BFE" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {terms.length > 0 ? (
            terms.map((item, index) => (
              <View key={index} style={styles.termBlock}>
                <Text style={styles.termTitle}>{item.term}</Text>
                <Text style={styles.definition}>- {item.definition}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholder}>No glossary available.</Text>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
        <Ionicons name="download-outline" size={18} color="#666" />
        <Text style={styles.downloadText}>Glossary_Lecture.pdf</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    position: "relative",
    flex: 1,
  },
  copyBtn: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  termBlock: {
    marginBottom: 16,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  definition: {
    fontSize: 14,
    color: "#333",
  },
  placeholder: {
    fontStyle: "italic",
    color: "#aaa",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 6,
  },
  downloadText: {
    fontSize: 13,
    color: "#666",
    textDecorationLine: "underline",
  },
});

export default GlossaryTab;
