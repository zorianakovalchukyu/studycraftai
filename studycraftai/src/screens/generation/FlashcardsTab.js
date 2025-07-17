import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const FlashcardsTab = ({ flashcards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [statusMap, setStatusMap] = useState({}); 
  const [mode, setMode] = useState("all"); 
  const [completed, setCompleted] = useState(false);

  const allIndexes = flashcards.map((_, i) => i);
  const visibleIndexes =
    mode === "all"
      ? allIndexes
      : allIndexes.filter((i) => statusMap[i] === "unknown");

  const currentCardIndex = visibleIndexes[currentIndex];
  const current = flashcards[currentCardIndex];

  const handleKnow = () => {
    const updated = { ...statusMap, [currentCardIndex]: "known" };
    setStatusMap(updated);
    goToNext(updated);
  };

  const handleDontKnow = () => {
    const updated = { ...statusMap, [currentCardIndex]: "unknown" };
    setStatusMap(updated);
    goToNext(updated);
  };

  const goToNext = (updatedMap) => {
    if (currentIndex + 1 >= visibleIndexes.length) {
      setCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const resetSession = (newMode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
  };

  if (!flashcards.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>No flashcards available.</Text>
      </View>
    );
  }

  if (completed) {
    const known = Object.values(statusMap).filter((s) => s === "known").length;
    const total = flashcards.length;
    const unknown = total - known;

    return (
      <View style={styles.container}>
        <Text style={styles.doneTitle}>Well done!</Text>
        <Text style={styles.doneSub}>
          You’ve completed this flashcard session
        </Text>

        <View style={styles.resultBox}>
          <Text>✅ {known} cards marked as “I know this”</Text>
          <Text>🕒 {unknown} cards to review again</Text>
          <Text>Total: {total} flashcards</Text>
        </View>

        {unknown > 0 && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => resetSession("unknown")}
          >
            <Text style={styles.buttonText}>Review unknown</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => resetSession("all")}
        >
          <Text style={styles.buttonText}>Repeat all</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowAnswer(!showAnswer)}
        activeOpacity={0.9}
      >
        <Text style={styles.question}>
          {showAnswer ? current.answer : current.question}
        </Text>
        {!showAnswer && (
          <Text style={styles.tapHint}>[Tap to reveal answer]</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.counter}>
        {currentIndex + 1} / {visibleIndexes.length}
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.navBtn} onPress={handlePrev}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.knowBtn} onPress={handleKnow}>
          <Text style={styles.knowText}>👍 I know it</Text>
        </TouchableOpacity>

        {currentIndex === visibleIndexes.length - 1 ? (
          <TouchableOpacity style={styles.navBtn} onPress={handleDontKnow}>
            <Text style={styles.arrow}>Finish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navBtn} onPress={handleDontKnow}>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  card: {
    flex: 1,
    backgroundColor: "#a88bfe",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  tapHint: {
    fontSize: 12,
    color: "#eee",
    marginTop: 12,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  navBtn: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  arrow: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  knowBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  knowText: {
    color: "#333",
    fontWeight: "500",
  },
  placeholder: {
    color: "#aaa",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 48,
  },
  counter: {
    textAlign: "center",
    marginTop: 12,
    color: "#444",
    fontSize: 14,
    fontWeight: "500",
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  doneSub: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  resultBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 20,
    gap: 8,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default FlashcardsTab;
