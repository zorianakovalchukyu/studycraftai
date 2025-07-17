import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { uploadToFirebaseStorage } from "../services/uploadToFirebaseStorage";

const generationOptions = [
  { label: "Generate summary", icon: "document-text-outline" },
  { label: "Extract key terms", icon: "book-outline" },
  { label: "Create quiz questions", icon: "help-circle-outline" },
  { label: "Make flashcards", icon: "albums-outline" },
  { label: "Create test", icon: "clipboard-outline" },
  { label: "Build slide presentation", icon: "tv-outline" },
];

const GenerationCards = ({ setLoading }) => {
  const navigation = useNavigation();

  const handlePress = async (label) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });
      setLoading(true);
      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        const { uri, name } = file;

        const fileUrl = await uploadToFirebaseStorage(uri, name, (progress) => {
          console.log(`Uploading... ${progress}%`);
        });

        if (!fileUrl) {
          Alert.alert("Upload Failed", "Could not upload file.");
          setLoading(false);
          return;
        }
        setLoading(false);
        navigation.navigate("Generating", {
          fileUrl,
          fileName: name,
          options: [label],
        });
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      Alert.alert("Error", "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {generationOptions.map(({ label, icon }) => (
        <TouchableOpacity
          key={label}
          style={styles.card}
          onPress={() => handlePress(label)}
        >
          <Ionicons name={icon} size={28} color="#A88BFE" />
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -24,
    padding: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#f4f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 8,
  },
});

export default GenerationCards;
