import { onDisconnect, onValue, set } from "firebase/database";
import { dotInfoConnectedRef, isOnlineRef } from "../lib/FirebaseInit.js";
import { workerData } from "worker_threads";

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

// Is_Onlineをリッスン
onValue(isOnlineRef, async (snapshot) => {
  // ネットワーク接続が切断状態になったら'Is_Online'をfalseにする
  await onDisconnect(isOnlineRef).set(false);

  // ログ
  console.log("childThread: onValue_isOnline.js");

  // 変更値をisOnlineに格納
  let onValue_isOnline = snapshot.val();

  // ログ
  console.log(`{ onValue_isOnline: ${onValue_isOnline} }`);

  // 非ログイン状態だったら2秒待機してログインを待つ
  if (getIsAuthStateLoggedIn() == false) {
    const Time = Date.now();
    while (Date.now() - Time < 2000) {}
  }

  if (onValue_isOnline == false) {
    await set(isOnlineRef, true);
  }
});

// Firebaseへの接続状況をリッスン
onValue(dotInfoConnectedRef, (snapshot) => {
  if (snapshot.val()) {
    setIsConnected(true);
  } else {
    setIsConnected(false);
  }
});
