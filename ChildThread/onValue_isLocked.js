import { parentPort, workerData } from "worker_threads";
import { onValue, set } from "firebase/database";
import { addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { isLockedRef, raspPiSerialNumberDocRef } from "../lib/FirebaseInit.js";

//* 共有メモリの設定
const sharedUint8Array = new Uint8Array(workerData);
function getIsLocked() {
  return Atomics.load(sharedUint8Array, 0);
}
function setIsLocked(bool) {
  Atomics.store(sharedUint8Array, 0, bool);
}

function getIsOpened() {
  return Atomics.load(sharedUint8Array, 1);
}
function setIsOpened(bool) {
  Atomics.store(sharedUint8Array, 1, bool);
}

function getIsConnected() {
  return Atomics.load(sharedUint8Array, 2);
}
function setIsConnected(bool) {
  return Atomics.store(sharedUint8Array, 2, bool);
}

function getIsOwnerRegistered() {
  return Atomics.load(sharedUint8Array, 3);
}
function setIsOwnerRegistered(bool) {
  Atomics.store(sharedUint8Array, 3, bool);
}

function getIsAuthStateLoggedIn() {
  return Atomics.load(sharedUint8Array, 4);
}
function setIsAuthStateLoggedIn(bool) {
  Atomics.store(sharedUint8Array, 4, bool);
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
parentPort.on("message", async (msg) => {
  const { isLocked } = msg;
  if (isLocked == true || isLocked == false) {
    // ログ
    console.log(`onValue_isLocked.js: Received { isLocked: ${isLocked} }`);

    // 共有メモリの値を更新
    setIsLocked(isLocked);

    // 非ログイン状態だったら2秒待機してログインを待つ
    if (getIsAuthStateLoggedIn() == false) {
      const Time = Date.now();
      while (Date.now() - Time < 2000) {}
    }

    // RealtimeDatabase_isLockedに書き込み
    set(isLockedRef, isLocked).catch((err) => {
      console.log(err);
    });

    // Firestore_keyStateLogCollectionに新規履歴docを追加
    if (getIsConnected()) {
      // Firebaseとのネットワークが確立済みの場合はserverTimestamp()
      addDoc(keyStateLogColRef, {
        keyState: isLocked,
        timeStamp: serverTimestamp(),
        userSerialNo: Number(isLocked).toString(),
      }).catch((err) => {
        console.log(err);
      });
    } else {
      // Firebaseとのネットワークが未確立の場合はTimestamp.now()でローカルタイム
      addDoc(keyStateLogColRef, {
        keyState: isLocked,
        timeStamp: Timestamp.now(),
        userSerialNo: Number(isLocked).toString(),
      }).catch((err) => {
        console.log(err);
      });
    }
  }
});
