import { firebase } from "./FirebaseService";

export const uploadToFirebaseStorage = async (
  fileUri,
  fileName,
  onProgress
) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const ref = firebase.storage().ref().child(`documents/${fileName}`);
    const uploadTask = ref.put(blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(percent));
        },
        (error) => {
          console.error("❌ Upload error:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await ref.getDownloadURL();
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("❌ Failed to prepare upload:", error);
    throw error;
  }
};
