import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getUserDocuments } from "../../services/FirestoreService";
import GenerationCards from "../../components/GenerationCards";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const userName = "Zoriana Kovalchuk";

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getUserDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const recentDocs = documents.slice(0, 2);

  const handleDocumentPress = (doc) => {
    console.log(doc);
    const hasGeneratedContent =
      doc.summary ||
      doc.glossary ||
      doc.questions ||
      doc.flashcards ||
      doc.test ||
      doc.presentation;

    if (hasGeneratedContent) {
      navigation.navigate("DocumentViewerTab", {
        summary: doc.summary.summary,
        glossary: doc.glossary,
        flashcards: doc.flashcards,
        questions: doc.questions,
        test: doc.test,
        presentation: doc.presentation,
        fileUrl: doc.url,
        docName: doc.name,
      });
    } else {
      Linking.openURL(doc.url);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={styles.container}>
    
        <View style={styles.header}>
          <Image
            source={require("../../../assets/avatar.jpg")}
            style={styles.avatar}
          />
          <Text style={styles.greeting}>Hello, {userName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent activity:</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#A88BFE" />
          ) : recentDocs.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="folder-open-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No processed documents yet</Text>
            </View>
          ) : (
            recentDocs.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={styles.docItemContainer}
                onPress={() => handleDocumentPress(doc)}
              >
                <View style={styles.docItem}>
                  <Ionicons name="document-outline" size={20} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docTitle}>{doc.name}</Text>
                    <Text style={styles.docMeta}>
                      {doc.summary || doc.glossary || doc.test
                        ? "Tap to view generated content"
                        : "Tap to open PDF"}
                    </Text>
                    <Text style={styles.docDate}>
                      {doc.createdAt?.toDate().toLocaleDateString() || ""}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate("UploadDocument")}
        >
          <Text style={styles.uploadText}>Upload your PDF file</Text>
        </TouchableOpacity>

        <GenerationCards setLoading={setUploading} />
      </View>

      {uploading && (
        <View style={styles.fullOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Uploading document...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 16,
  },
  empty: {
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    marginTop: 8,
    color: "#888",
  },
  docItemContainer: {
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
  },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  docTitle: {
    fontWeight: "500",
  },
  docMeta: {
    color: "#777",
    fontSize: 12,
  },
  docDate: {
    fontSize: 12,
    color: "#999",
  },
  uploadButton: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 10,
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
});

export default HomeScreen;
