import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import SummaryTab from "../generation/SummaryTab";
import GlossaryTab from "../generation/GlossaryTab";
import QuestionsTab from "../generation/QuestionsTab";
import FlashcardsTab from "../generation/FlashcardsTab";
import TestTab from "../generation/TestTab";
import PresentationTab from "../generation/PresentationTab";

const Tab = createMaterialTopTabNavigator();

const DocumentViewerTabScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    summary,
    glossary,
    flashcards,
    questions,
    test,
    presentation,
    fileUrl,
    docName,
  } = route.params || {};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#444" />
          </TouchableOpacity>
          <Text style={styles.fileName} numberOfLines={1}>
            {docName || "Document"}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("PDFViewer", { fileUrl })}
          >
            <Ionicons name="eye-outline" size={22} color="#A88BFE" />
          </TouchableOpacity>
        </View>

        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#A88BFE",
            tabBarLabelStyle: { fontWeight: "bold" },
            tabBarIndicatorStyle: { backgroundColor: "#A88BFE" },
          }}
        >
          {summary && (
            <Tab.Screen name="Summary">
              {() => (
                <SummaryTab
                  content={summary}
                  fileUrl={fileUrl}
                  docName={docName}
                  onRegenerated={(newSummary) => {
                    route.params.summary = newSummary;
                  }}
                />
              )}
            </Tab.Screen>
          )}
          {glossary && (
            <Tab.Screen name="Glossary">
              {() => <GlossaryTab terms={glossary} />}
            </Tab.Screen>
          )}
          {questions && (
            <Tab.Screen name="Questions">
              {() => <QuestionsTab questions={questions} />}
            </Tab.Screen>
          )}
          {flashcards && (
            <Tab.Screen name="Flashcards">
              {() => <FlashcardsTab flashcards={flashcards} />}
            </Tab.Screen>
          )}
          {test && (
            <Tab.Screen name="Test">{() => <TestTab quiz={test} />}</Tab.Screen>
          )}
          {presentation && (
            <Tab.Screen name="Presentation">
              {() => <PresentationTab presentation={presentation} />}
            </Tab.Screen>
          )}
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flexShrink: 1,
  },
});

export default DocumentViewerTabScreen;
