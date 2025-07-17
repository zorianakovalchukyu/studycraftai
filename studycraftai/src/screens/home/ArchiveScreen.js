import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getUserDocuments,
  deleteDocumentById,
} from "../../services/FirestoreService";
import { Ionicons } from "@expo/vector-icons";

const FILTERS = [
  "All",
  "Summary",
  "Test",
  "Questions",
  "Flashcards",
  "Presentation",
];

const ArchiveScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const navigation = useNavigation();

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    const docs = await getUserDocuments();
    setDocuments(docs);
    setLoading(false);
  };

  const confirmDelete = (docId) => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(docId),
        },
      ]
    );
  };

  const handleDelete = async (docId) => {
    await deleteDocumentById(docId);
    fetchDocs();
  };

  const getAvailableTags = (item) => {
    const tags = [];
    if (item.summary) tags.push("Summary");
    if (item.glossary) tags.push("Glossary");
    if (item.flashcards) tags.push("Flashcards");
    if (item.questions) tags.push("Questions");
    if (item.test) tags.push("Test");
    if (item.presentation) tags.push("Presentation");
    return tags;
  };

  const filterDocuments = () => {
    if (activeFilter === "All") return documents;
    return documents.filter((doc) => doc[activeFilter.toLowerCase()]);
  };

  const renderItem = ({ item }) => {
    const tags = getAvailableTags(item);

    return (
      <SafeAreaView>
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.itemContent}
            onPress={() =>
              navigation.navigate("DocumentViewerTab", {
                docName: item.name,
                ...item,
              })
            }
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.date}>
              {item.createdAt?.toDate?.().toLocaleDateString() || "—"}
            </Text>
            {tags.length > 0 ? (
              <View style={styles.tagsContainer}>
                {tags.map((tag) => (
                  <Text key={tag} style={styles.tag}>
                    ✅ {tag}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.noContent}>No generated content</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => confirmDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#d00" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5E5BFD" />
      </View>
    );
  }

  const filteredDocs = filterDocuments();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>📁 My Archive</Text>

        {/* Filters */}
        <View style={styles.filterBar}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredDocs.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.empty}>
              No documents match filter "{activeFilter}".
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredDocs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  filterBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: "#A88BFE",
  },
  filterText: {
    fontSize: 12,
    color: "#555",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemContent: { flex: 1, marginRight: 12 },
  title: { fontSize: 16, fontWeight: "600" },
  date: { fontSize: 12, color: "#777", marginTop: 4 },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 6,
  },
  tag: {
    backgroundColor: "#e5e4ff",
    color: "#5E5BFD",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  noContent: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 8,
    fontStyle: "italic",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: {
    fontSize: 14,
    color: "#aaa",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default ArchiveScreen;
