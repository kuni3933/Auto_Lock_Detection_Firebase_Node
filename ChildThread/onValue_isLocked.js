import { parentPort, workerData } from "worker_threads";
import { onValue, set } from "firebase/database";
import {
  isLockedRef,
  isLockedHistoryRef,
  isLockedUserHistoryRef,
} from "../lib/FirebaseInit.js";

const sharedUint8Array = new Uint8Array(workerData);

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
