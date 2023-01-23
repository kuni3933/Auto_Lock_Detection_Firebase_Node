import { existsSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
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

// customTokenのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
const customTokenPath = `${__dirname}/../../Config/customToken.json`;
//console.log(`customTokenPath: ${customTokenPath}`);

// このスレッドで保持しておく状態変数
let isOwnerRegistered = false;
while (true) {
  // このwhile内で一時保持する変数
  const whileIsOwnerRegistered = existsSync(customTokenPath);

  // このスレッドで保持している状態変数と比較 && writeFlagがtrueか判定
  if (isOwnerRegistered != whileIsOwnerRegistered) {
    // 比較結果として違った場合は共有メモリに保存
    setIsOwnerRegistered(whileIsOwnerRegistered);

    // スレッドで保持している状態変数も更新
    isOwnerRegistered = whileIsOwnerRegistered;

    // ログ
    console.log(`isOwnerRegistered: ${whileIsOwnerRegistered}`);
  }
  // 2秒スリープ
  const Time = Date.now();
  while (Date.now() - Time < 2000) {}
}
