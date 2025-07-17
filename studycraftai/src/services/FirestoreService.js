import { firebase } from "./FirebaseService";

export const saveFileToFirestore = async (
  fileUrl,
  fileName,
  options = [],
  generatedData = {}
) => {
  const user = firebase.auth().currentUser;
  if (!user) return null;

  const filteredData = Object.fromEntries(
    Object.entries(generatedData).filter(([_, value]) => value !== undefined)
  );

  const fileData = {
    uid: user.uid,
    name: fileName,
    url: fileUrl,
    options,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    ...filteredData,
  };
  console.log(fileData);
  try {
    const docRef = await firebase
      .firestore()
      .collection("documents")
      .add(fileData);
    console.log("✅ Document saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Failed to save document to Firestore:", error);
    return null;
  }
};

export const getUserDocuments = async () => {
  const user = firebase.auth().currentUser;
  if (!user) return [];

  try {
    const snapshot = await firebase
      .firestore()
      .collection("documents")
      .where("uid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Failed to fetch user documents:", error);
    return [];
  }
};
export const deleteDocumentById = async (docId) => {
  try {
    await firebase.firestore().collection("documents").doc(docId).delete();
    console.log("🗑️ Document deleted:", docId);
  } catch (error) {
    console.error("❌ Failed to delete document:", error);
  }
};
