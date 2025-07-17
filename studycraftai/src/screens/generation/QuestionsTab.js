import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const QuestionsTab = ({ questions = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ScrollView>
          {questions.length === 0 ? (
            <Text style={styles.placeholder}>No questions generated.</Text>
          ) : (
            questions.map((q, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.questionRow}
                  onPress={() => toggle(index)}
                >
                  <Ionicons
                    name="help-circle"
                    size={20}
                    color="#A88BFE"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.questionText}>{q.question}</Text>
                  <Ionicons
                    name={openIndex === index ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#333"
                    style={{ marginLeft: "auto" }}
                  />
                </TouchableOpacity>

                {openIndex === index && (
                  <Text style={styles.answerText}>{q.answer}</Text>
                )}

                <View style={styles.divider} />
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  questionText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#111",
    flex: 1,
  },
  answerText: {
    fontSize: 13,
    color: "#444",
    paddingLeft: 28,
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
  placeholder: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginVertical: 40,
  },
});

export default QuestionsTab;
