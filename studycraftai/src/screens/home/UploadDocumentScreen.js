import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { uploadToFirebaseStorage } from "../../services/uploadToFirebaseStorage";

const UploadDocumentScreen = () => {
  const [fileName, setFileName] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [options, setOptions] = useState([]);

  const navigation = useNavigation();

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result?.assets && result.assets[0]?.uri) {
        const file = result.assets[0];
        setFileName(file.name);

        setUploading(true);
        setUploadProgress(0);

        const uploadedUrl = await uploadToFirebaseStorage(
          file.uri,
          file.name,
          (percent) => setUploadProgress(percent)
        );

        setFileUrl(uploadedUrl);
        setUploading(false);
      } else {
        Alert.alert("❌ File selection cancelled.");
      }
    } catch (error) {
      console.error("Pick file error:", error);
      Alert.alert("❌ Failed to pick file", error.message);
      setUploading(false);
    }
  };

  const toggleOption = (value) => {
    if (options.includes(value)) {
      setOptions(options.filter((o) => o !== value));
    } else {
      setOptions([...options, value]);
    }
  };

  const handleGenerate = () => {
    if (!fileUrl || !fileName) {
      Alert.alert("📄 File must be selected and uploaded first");
      return;
    }

    if (options.length === 0) {
      Alert.alert("🧠 Select at least one generation option");
      return;
    }

    navigation.navigate("Generating", {
      fileUrl,
      fileName,
      options,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Upload your document</Text>
      <Text style={styles.subtitle}>
        Turn any lecture or article into smart content in seconds
      </Text>

      <View style={styles.fileBox}>
        <TouchableOpacity style={styles.chooseBtn} onPress={pickFile}>
          <Text style={styles.chooseText}>Choose PDF file</Text>
        </TouchableOpacity>
        <Text style={styles.fileName}>File selected: {fileName || "None"}</Text>

        {uploading && (
          <View style={styles.progressBox}>
            <View
              style={[styles.progressBar, { width: `${uploadProgress}%` }]}
            />
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          </View>
        )}
      </View>

      <Text style={styles.question}>What would you like to generate?</Text>

      {checklist.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.radio}
          onPress={() => toggleOption(item)}
        >
          <Ionicons
            name={
              options.includes(item) ? "radio-button-on" : "radio-button-off"
            }
            size={20}
            color="#A88BFE"
          />
          <Text style={styles.radioText}>{item}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
        <Text style={styles.generateText}>Generate</Text>
      </TouchableOpacity>
    </View>
  );
};

const checklist = [
  "Generate summary",
  "Extract key terms",
  "Create quiz questions",
  "Make flashcards",
  "Create test",
  "Build slide presentation",
];

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  subtitle: { fontSize: 14, color: "#444", marginBottom: 20 },
  fileBox: {
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  chooseBtn: {
    backgroundColor: "#A88BFE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  chooseText: { color: "#fff", fontWeight: "bold" },
  fileName: { fontSize: 12, color: "#444" },
  progressBox: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    overflow: "hidden",
    width: "100%",
    marginTop: 8,
  },
  progressBar: { height: "100%", backgroundColor: "#A88BFE" },
  progressText: { fontSize: 12, color: "#666", marginTop: 4 },
  question: { fontSize: 14, fontWeight: "600", marginBottom: 10 },
  radio: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  radioText: { fontSize: 14 },
  generateBtn: {
    marginTop: 30,
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  generateText: { color: "#fff", fontWeight: "bold" },
});

export default UploadDocumentScreen;
