import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

const SummaryTab = ({ content, fileUrl, docName }) => {
  const [currentSummary, setCurrentSummary] = useState(content);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    console.log(currentSummary);
    if (!currentSummary) return;
    await Clipboard.setStringAsync(String(currentSummary));

    Alert.alert("Copied to clipboard");
  };

  const handleDownload = async () => {
    if (!currentSummary) {
      Alert.alert("No summary to download");
      return;
    }

    try {
      const fileUri = FileSystem.documentDirectory + "summary.txt";
      await FileSystem.writeAsStringAsync(fileUri, String(currentSummary));

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("File saved", "Saved to: " + fileUri);
      }
    } catch (err) {
      console.error("❌ Download error:", err);
      Alert.alert("Failed to download", err.message);
    }
  };

  const handleRegenerate = async () => {
    if (!fileUrl) {
      Alert.alert("No file", "Missing file URL for regeneration.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://192.168.1.3:5000/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (data?.summary) {
        setCurrentSummary(data.summary);
        console.log("✅ Summary regenerated");
      } else {
        throw new Error("Summary not found in response");
      }
    } catch (err) {
      console.error("❌ Regeneration failed:", err);
      Alert.alert("Regeneration failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={22} color="#A88BFE" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.regenerateBtn}
            onPress={handleRegenerate}
          >
            <Ionicons name="refresh-outline" size={22} color="#A88BFE" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>{currentSummary.title}</Text>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#5E5BFD"
              style={{ marginTop: 40 }}
            />
          ) : currentSummary ? (
            <Text style={styles.text}>{currentSummary}</Text>
          ) : (
            <Text style={styles.placeholder}>No summary available.</Text>
          )}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={[styles.iconButton, styles.downloadBtn]}
        onPress={handleDownload}
      >
        <Ionicons name="download-outline" size={22} color="#A88BFE" />
        <Text style={styles.iconText}>Summary_{docName}</Text>
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
    position: "relative",
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
    right: 46,
  },
  regenerateBtn: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    padding: 16,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,

    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  downloadBtn: {
    position: "absolute",
    bottom: 30,
    left: 20,
  },
  iconText: {
    fontSize: 13,
    color: "#A88BFE",
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111",
  },
  text: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    textAlign: "justify",
  },
  placeholder: {
    fontStyle: "italic",
    color: "#888",
    fontSize: 14,
  },
});

export default SummaryTab;
