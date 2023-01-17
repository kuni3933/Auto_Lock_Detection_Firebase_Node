import * as dotenv from "dotenv";
import path from "path";
import { getAuth } from "firebase/auth";
import { fileURLToPath } from "url";
import { getDatabase, ref } from "firebase/database";
import { collection, doc, getFirestore } from "firebase/firestore";
import { getSerialNumber } from "raspi-serial-number";
import { initializeApp } from "firebase/app";

//* Get raspPiSerialNumber
const raspPiSerialNumber = await getSerialNumber()
  .then((number) => {
    return number;
  })
  .catch((err) => {
    console.log(err);
    return "SerialNumber_3";
  });

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

//initialize Auth
const auth = getAuth(app);

// Initialize Realtime Database
const db = getDatabase(app);

const firestore = getFirestore(app);

//raspPiシリアルナンバーのdocRef
const raspPiSerialNumberDocRef = doc(
  collection(firestore, "RaspPi"),
  raspPiSerialNumber
);

// Angleのref
const angleRef = ref(db, `RaspPi/${raspPiSerialNumber}/Angle`);

// オートロックセンサーのref
const autolockSensorRef = ref(
  db,
  `RaspPi/${raspPiSerialNumber}/Autolock_Sensor`
);

// オートロックタイムのref
const autolockTimeRef = ref(db, `RaspPi/${raspPiSerialNumber}/Autolock_Time`);

// Is_Locked_Ref
const isLockedRef = ref(db, `RaspPi/${raspPiSerialNumber}/Is_Locked`);

// Is_Opened_Ref
const isOpenedRef = ref(db, `RaspPi/${raspPiSerialNumber}/Is_Opened`);

// Is_Online_Ref
const isOnlineRef = ref(db, `RaspPi/${raspPiSerialNumber}/Is_Online`);

// export
export {
  auth,
  db,
  angleRef,
  autolockSensorRef,
  autolockTimeRef,
  isLockedRef,
  isOpenedRef,
  isOnlineRef,
  raspPiSerialNumberDocRef,
};
