import {
  dotInfoConnectedRef,
  isLockedRef,
  keyStateLogColRef,
  raspPiSerialNumberDocRef,
} from "../lib/FirebaseInit.js";
import { set, get, onValue } from "firebase/database";
import {
  addDoc,
  arrayUnion,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

const isLocked = false;
console.log(`onValue_isLocked.js: Received { isLocked: ${isLocked} }`);

//console.log(doc(keyStateLogColRef).id);
/*
// isLocked,keyStateLog 双方の書込み
Promise.all([
  // Realtim Databaseに書き込み
  set(isLockedRef, isLocked).catch((err) => {
    console.log(err);
  }),
  // テスト
  addDoc(keyStateLogColRef, {
    keyState: isLocked,
    timeStamp: serverTimestamp(),
    userSerialNo: Number(isLocked).toString(),
  }).catch((err) => {
    console.log(err);
  }),
]);
*/
/*
  // Firestoreに履歴を書き込み
  updateDoc(raspPiSerialNumberDocRef, {
    keyStateLog: arrayUnion({
      keyState: isLocked,
      timeStamp: Timestamp.now(),
      userSerialNo: Number(isLocked).toString(),
    }),
  }).catch((err) => {
    console.log(err);
  }),
]);

// keyStateLogColのDocを全て挙げる
const keyStateLogDocsQuery = query(
  keyStateLogColRef,
  orderBy("timeStamp", "desc")
);
const keyStateLogDocs = await getDocs(keyStateLogDocsQuery);
keyStateLogDocs.forEach((doc) => {
  const data = doc.data();
  console.log(
    doc.id,
    ": ",
    doc.data()
    //data.keyState,
    //new Date(data.timeStamp.toString().seconds * 1000),
    //data.userSerialNo
  );
});
*/

/*
onValue(dotInfoConnectedRef, (snapshot) => {
  console.log(snapshot.val());
});
*/
