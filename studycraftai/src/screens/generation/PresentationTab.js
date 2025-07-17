import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as Sharing from "expo-sharing";
import { generatePresentationPDF } from "../../utils/generatePresentationPDF";

const PresentationTab = ({ presentation = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleExportPDF = async () => {
    const path = await generatePresentationPDF(presentation);
    if (path) {
      await Sharing.shareAsync(path);
    }
  };
  if (!presentation || presentation.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No presentation available.</Text>
      </View>
    );
  }

  const currentSlide = presentation[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < presentation.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.exportBtn} onPress={handleExportPDF}>
        <Text style={styles.exportText}>Export to PDF</Text>
      </TouchableOpacity>
      <Text style={styles.slideNumber}>
        Slide {currentIndex + 1} of {presentation.length}
      </Text>

      <View style={styles.slide}>
        <Text style={styles.title}>{currentSlide.title}</Text>

        {currentSlide.bullets?.map((point, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{point}</Text>
          </View>
        ))}
      </View>

      <View style={styles.nav}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentIndex === 0}
          style={[styles.navBtn, currentIndex === 0 && styles.disabledBtn]}
        >
          <Text style={styles.navText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === presentation.length - 1}
          style={[
            styles.navBtn,
            currentIndex === presentation.length - 1 && styles.disabledBtn,
          ]}
        >
          <Text style={styles.navText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { color: "#999", fontStyle: "italic" },
  slideNumber: { textAlign: "center", color: "#888", marginBottom: 8 },
  slide: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 20,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: "#555",
  },
  bulletText: {
    fontSize: 16,
    color: "#444",
    flex: 1,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navBtn: {
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 10,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  navText: {
    fontSize: 18,
    color: "#333",
  },
  exportBtn: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  exportText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default PresentationTab;
