import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const PDFViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fileUrl } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#444" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <WebView
        source={{ uri: fileUrl }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#5E5BFD"
            style={styles.loader}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default PDFViewerScreen;
