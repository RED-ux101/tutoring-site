const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      return admin.apps[0];
    }

    // Initialize Firebase Admin SDK
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : require(path.join(__dirname, 'firebase-service-account.json'));

    const firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-project-id.appspot.com'
    });

    console.log('Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Get Firestore database
const getFirestore = () => {
  return admin.firestore();
};

// Get Firebase Storage
const getStorage = () => {
  return admin.storage();
};

// Get Firebase Auth
const getAuth = () => {
  return admin.auth();
};

// Database operations
const dbOperations = {
  // Files collection operations
  files: {
    async create(fileData) {
      const db = getFirestore();
      const docRef = await db.collection('files').add({
        ...fileData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: docRef.id, ...fileData };
    },

    async getById(fileId) {
      const db = getFirestore();
      const doc = await db.collection('files').doc(fileId).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },

    async getByTutorId(tutorId) {
      const db = getFirestore();
      const snapshot = await db.collection('files')
        .where('tutorId', '==', tutorId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async getAll() {
      const db = getFirestore();
      const snapshot = await db.collection('files')
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async update(fileId, updateData) {
      const db = getFirestore();
      await db.collection('files').doc(fileId).update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: fileId, ...updateData };
    },

    async delete(fileId) {
      const db = getFirestore();
      await db.collection('files').doc(fileId).delete();
      return { id: fileId };
    }
  },

  // Submissions collection operations
  submissions: {
    async create(submissionData) {
      const db = getFirestore();
      const docRef = await db.collection('submissions').add({
        ...submissionData,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: docRef.id, ...submissionData };
    },

    async getById(submissionId) {
      const db = getFirestore();
      const doc = await db.collection('submissions').doc(submissionId).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },

    async getPending() {
      const db = getFirestore();
      const snapshot = await db.collection('submissions')
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async getAll() {
      const db = getFirestore();
      const snapshot = await db.collection('submissions')
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async update(submissionId, updateData) {
      const db = getFirestore();
      await db.collection('submissions').doc(submissionId).update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: submissionId, ...updateData };
    },

    async delete(submissionId) {
      const db = getFirestore();
      await db.collection('submissions').doc(submissionId).delete();
      return { id: submissionId };
    }
  },

  // Tutors collection operations
  tutors: {
    async create(tutorData) {
      const db = getFirestore();
      const docRef = await db.collection('tutors').add({
        ...tutorData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: docRef.id, ...tutorData };
    },

    async getById(tutorId) {
      const db = getFirestore();
      const doc = await db.collection('tutors').doc(tutorId).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },

    async getByEmail(email) {
      const db = getFirestore();
      const snapshot = await db.collection('tutors')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      return snapshot.docs.length > 0 
        ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
        : null;
    }
  }
};

// Storage operations
const storageOperations = {
  async uploadFile(file, destination) {
    const bucket = getStorage().bucket();
    const fileBuffer = file.buffer;
    const fileName = `${destination}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}${path.extname(file.originalname)}`;
    
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname
        }
      }
    });

    // Make file publicly readable
    await fileUpload.makePublic();

    return {
      fileName,
      publicUrl: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype
    };
  },

  async deleteFile(fileName) {
    const bucket = getStorage().bucket();
    await bucket.file(fileName).delete();
    return { fileName };
  },

  async getDownloadUrl(fileName) {
    const bucket = getStorage().bucket();
    const file = bucket.file(fileName);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });
    return url;
  }
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getStorage,
  getAuth,
  dbOperations,
  storageOperations
}; 