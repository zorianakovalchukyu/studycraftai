import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import { saveFileToFirestore } from "../../services/FirestoreService";

const GeneratingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fileUrl, fileName, options, onDone } = route.params;

  const [statusMap, setStatusMap] = useState({});

  const labelToType = {
    "Generate summary": "summary",
    "Extract key terms": "glossary",
    "Create quiz questions": "questions",
    "Make flashcards": "flashcards",
    "Create test": "test",
    "Build slide presentation": "presentation",
  };

  const typeToLabel = {
    summary: "Generating summary",
    glossary: "Generating glossary",
    questions: "Generating questions",
    flashcards: "Creating flashcards",
    test: "Creating test",
    presentation: "Building presentation",
  };

  useEffect(() => {
    generateContent();
  }, []);

  const generateContent = async () => {
    const selectedTypes = options.map((label) => labelToType[label]);
    const results = {};

    for (const type of selectedTypes) {
      setStatusMap((prev) => ({ ...prev, [type]: "loading" }));

      try {
        const res = await fetch(`http://192.168.0.104:5000/generate-${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl }),
        });

        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (err) {
          console.warn(`Invalid JSON for ${type}:`, text);
          setStatusMap((prev) => ({ ...prev, [type]: "error" }));
          continue;
        }

        if (type === "test" && Array.isArray(data.test)) {
          results.test = data.test;
          setStatusMap((prev) => ({ ...prev, [type]: "success" }));
          continue;
        }

        if (data[type] !== undefined) {
          results[type] = data[type];
          setStatusMap((prev) => ({ ...prev, [type]: "success" }));
        } else {
          setStatusMap((prev) => ({ ...prev, [type]: "error" }));
        }
      } catch (err) {
        console.error(`Generation failed for ${type}`, err);
        setStatusMap((prev) => ({ ...prev, [type]: "error" }));
      }
    }

    console.log("Final generated data:", results);

    if (onDone && typeof onDone === "function") {
      onDone(results);
      navigation.goBack();
      return;
    }

    const docId = await saveFileToFirestore(
      fileUrl,
      fileName,
      options,
      results
    );

    if (docId) {
      navigation.replace("DocumentViewerTab", {
        docName: fileName,
        fileUrl,
        ...results,
      });
    } else {
      Alert.alert("Document not saved");
    }
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "loading":
        return "🔄";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "○";
    }
  };

  const handleCancel = () => {
    Alert.alert("Cancel", "Generation cancelled");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generating your{"\n"}learning content...</Text>
      <Text style={styles.subtitle}>This may take 10–15 seconds</Text>

      <Progress.Circle
        indeterminate
        size={90}
        color="#5E5BFD"
        borderWidth={3}
        style={{ marginVertical: 30, alignSelf: "center" }}
      />

      <View style={{ marginTop: 10 }}>
        {Object.entries(typeToLabel).map(([type, label]) => {
          const selected = options.map((label) => labelToType[label]);
          if (!selected.includes(type)) return null;

          return (
            <View key={type} style={styles.stepRow}>
              <Text style={styles.statusIcon}>
                {renderStatusIcon(statusMap[type])}
              </Text>
              <Text style={styles.stepText}>{label}</Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginTop: 6,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  statusIcon: {
    fontSize: 18,
    width: 28,
    textAlign: "center",
  },
  stepText: {
    fontSize: 15,
    color: "#444",
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GeneratingScreen;
