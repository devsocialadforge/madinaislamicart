import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Update the Review interface to match ProductReviews.tsx
export interface Review {
  id: string;
  author: string;
  user_name: string; // Add this field
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

// Image upload functions
export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Review operations
export const createReview = async (reviewData: {
  user_id: string;
  user_name: string;
  product_id: string;
  rating: number;
  comment: string;
  title?: string;
  images?: string[];
}) => {
  const reviewsRef = collection(db, "reviews");
  const newReviewRef = doc(reviewsRef);
  await setDoc(newReviewRef, {
    ...reviewData,
    createdAt: Timestamp.now(),
  });
  return newReviewRef.id;
};

export const getProductReviews = async (productId: string) => {
  const reviewsRef = collection(db, "reviews");
  const q = query(
    reviewsRef,
    where("product_id", "==", productId),
    orderBy("createdAt", "desc")
  );
  const reviewsSnap = await getDocs(q);
  return reviewsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getUserReviews = async (userId: string) => {
  const reviewsRef = collection(db, "users", userId, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const reviewsSnap = await getDocs(q);
  return reviewsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update getReviews function
export const getReviews = async (productId: string) => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("product_id", "==", productId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      author: doc.data().user_id || "Anonymous",
      user_name: doc.data().user_name || "Anonymous", // Add this mapping
      rating: doc.data().rating || 0,
      title: doc.data().title || "",
      content: doc.data().comment || "",
      date:
        doc.data().createdAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
      verified: true,
      helpful: 0,
      images: doc.data().images || [],
    })) as Review[];
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw error;
  }
};

// Additional image upload utilities
export const uploadMultipleImages = async (
  files: File[],
  basePath: string
): Promise<string[]> => {
  const uploadPromises = files.map(async (file, index) => {
    const timestamp = Date.now();
    const fileName = `bulk_${index + 1}_${timestamp}_${file.name}`;
    const fullPath = `${basePath}/${fileName}`;
    return uploadImage(file, fullPath);
  });

  return Promise.all(uploadPromises);
};

export const uploadImageWithMetadata = async (
  file: File,
  path: string,
  metadata: {
    contentType?: string;
    customMetadata?: Record<string, string>;
  } = {}
): Promise<string> => {
  const storageRef = ref(storage, path);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: metadata.contentType || file.type,
    customMetadata: metadata.customMetadata || {},
  });

  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
