import * as admin from "firebase-admin";

// Check if the app is already initialized to prevent errors in development
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // This line correctly formats the private key from the environment variable
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error(
      "Firebase Admin initialization error",
      (error as Error).message
    );
  }
}

export default admin;
