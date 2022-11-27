import { parentPort, workerData } from "worker_threads";
import { getSerialNumber } from "raspi-serial-number";
import { onValue, ref, set } from "firebase/database";
import { db } from "../lib/FirebaseInit.js";

const sharedUint8Array = new Uint8Array(workerData);

//* Get raspPiSerialNumber
const raspPiSerialNumber = await getSerialNumber()
  .then((number) => {
    return number;
  })
  .catch((err) => {
    console.log(err);
    return "83ed5c72";
  });

// set Is_Locked_Ref
const isLockedRef = ref(db, `RaspPi/${raspPiSerialNumber}/Is_Locked`);

// set Is_Locked_History_Ref
const isLockedHistoryRef = ref(
  db,
  `RaspPi/${raspPiSerialNumber}/Is_Locked_History`
);

// set Is_Locked_User_History_Ref
const isLockedUserHistoryRef = ref(
  db,
  `RaspPi/${raspPiSerialNumber}/Is_Locked_User_History`
);

// isLockedをリッスン
onValue(isLockedRef, (snapshot) => {
  // ログ
  console.log("childThread: onValue_isLocked.js");

  // 変更値をisLockedに格納
  let onValue_isLocked = snapshot.val();

  // ログ
  console.log(`{ onValue_isLocked: ${onValue_isLocked} }`);

  if (onValue_isLocked == true || onValue_isLocked == false) {
    Atomics.store(sharedUint8Array, 0, onValue_isLocked);
  }
});

// オートロックで書き込みをする際の受信用ポート
parentPort.on("message", (msg) => {
  const { isLocked } = msg;
  if (isLocked == true || isLocked == false) {
    // ログ
    console.log(`onValue_isLocked.js: Received { isLocked: ${isLocked} }`);

    set(isLockedRef, isLocked);
    //set(isLockedHistoryRef,);
    //set(isLockedUserHistoryRef,);
  }
});
