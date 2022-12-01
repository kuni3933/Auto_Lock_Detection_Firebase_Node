import * as dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 環境変数の読み込み
//* Configディレクトリのパス
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../Config`;
console.log(`configDirPath: ${configDirPath}`);
dotenv.config({ path: `${configDirPath}/.env` });

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_apiKey,
  authDomain: process.env.FIREBASE_authDomain,
  databaseURL: process.env.FIREBASE_databaseURL,
  projectId: process.env.FIREBASE_projectId,
  storageBucket: process.env.FIREBASE_storageBucket,
  messagingSenderId: process.env.FIREBASE_messagingSenderId,
  appId: process.env.FIREBASE_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

// export
export { db };
