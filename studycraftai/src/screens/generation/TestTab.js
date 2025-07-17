import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const normalizeQuiz = (quiz) => {
  return quiz.map((q) => {
    const correctIndex = q.options.findIndex((opt) =>
      opt.trim().startsWith(`${q.answer})`)
    );

    const cleanOptions = q.options.map((opt) =>
      opt.replace(/^[A-D]\)\s*/, "").trim()
    );

    return {
      question: q.question || cleanOptions.join(" / "),
      options: cleanOptions,
      answerIndex: correctIndex,
    };
  });
};

const TestTab = ({ quiz = [] }) => {
  const normalized = normalizeQuiz(quiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const current = normalized[currentIndex];

  const handleSelect = (index) => {
    if (selected !== null) return;

    setSelected(index);
    const correct = index === current.answerIndex;
    setResults((prev) => [...prev, correct]);

    setTimeout(() => {
      if (currentIndex + 1 < normalized.length) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelected(null);
    setResults([]);
    setFinished(false);
  };

  if (!quiz || quiz.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No quiz available.</Text>
      </View>
    );
  }

  if (finished) {
    const score = results.filter((r) => r).length;
    return (
      <View style={styles.center}>
        <Text style={styles.title}>
          🎉 You scored {score} out of {normalized.length}!
        </Text>
        <Text style={styles.sub}>Great work! Ready to try again?</Text>
        <TouchableOpacity style={styles.button} onPress={resetQuiz}>
          <Text style={styles.buttonText}>Repeat Test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.progress}>
        Question {currentIndex + 1} of {normalized.length}
      </Text>

      <Text style={styles.question}>{current.question}</Text>

      {current.options.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.option,
            selected !== null && i === current.answerIndex && styles.correct,
            selected !== null &&
              i === selected &&
              i !== current.answerIndex &&
              styles.wrong,
          ]}
          onPress={() => handleSelect(i)}
          disabled={selected !== null}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { padding: 24, flex: 1, backgroundColor: "#fff" },
  progress: { fontSize: 14, color: "#888", marginBottom: 12 },
  question: { fontSize: 16, fontWeight: "600", marginBottom: 24 },
  option: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#9C2CF3",
  },
  correct: {
    backgroundColor: "#d8fbe5",
    borderColor: "#34c759",
    borderWidth: 0.5,
  },
  wrong: {
    backgroundColor: "#f8d7da",
    borderColor: "#c60c0c",
    borderWidth: 0.5,
  },
  optionText: { color: "#333" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  sub: { color: "#555", marginBottom: 24 },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  empty: { color: "#aaa", fontStyle: "italic" },
});

export default TestTab;
