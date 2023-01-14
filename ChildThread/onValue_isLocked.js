import { parentPort, workerData } from "worker_threads";
import { onValue, set } from "firebase/database";
import { FieldValue } from "firebase/firestore";
import { isLockedRef, raspPiSerialNumberDocRef } from "../lib/FirebaseInit.js";

// 共有配列
const sharedUint8Array = new Uint8Array(workerData);
function getIsLocked() {
  Atomics.load(sharedUint8Array, 0);
}
function setIsLocked(bool) {
  Atomics.store(sharedUint8Array, 0, bool);
}

function getIsOpened() {
  Atomics.load(sharedUint8Array, 1);
}
function setIsOpened(bool) {
  Atomics.store(sharedUint8Array, 1, bool);
}

function getIsOwnerRegistered() {
  Atomics.load(sharedUint8Array, 2);
}
function setIsOwnerRegistered(bool) {
  Atomics.store(sharedUint8Array, 2, bool);
}

function getIsAuthStateLoggedIn() {
  Atomics.load(sharedUint8Array, 3);
}
function setIsAuthStateLoggedIn(bool) {
  Atomics.store(sharedUint8Array, 3, bool);
}

// Is_Lockedをリッスン
onValue(isLockedRef, (snapshot) => {
  // ログ
  console.log("childThread: onValue_isLocked.js");

  // 変更値をisLockedに格納
  let onValue_isLocked = snapshot.val();

  // ログ
  console.log(`{ onValue_isLocked: ${onValue_isLocked} }`);

  if (onValue_isLocked == true || onValue_isLocked == false) {
    setIsLocked(onValue_isLocked);
  }
});

// オートロックでラズパイ側から書き込みをする際の受信用ポート
parentPort.on("message", (msg) => {
  const { isLocked } = msg;
  if (isLocked == true || isLocked == false) {
    // ログ
    console.log(`onValue_isLocked.js: Received { isLocked: ${isLocked} }`);

    // 共有メモリの値を更新
    setIsLocked(isLocked);

    // 非ログイン状態だったら1秒待機してログインを待つ
    if (getIsAuthStateLoggedIn() == false) {
      sleep.sleep(1);
    }
    // Realtim Databaseに書き込み
    set(isLockedRef, isLocked).catch((err) => {
      console.log(err);
    });
    // 履歴はまだ構造未定なので放置
    //raspPiSerialNumberDocRef;
  }
});
