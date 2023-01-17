import { isOpenedRef } from "../lib/FirebaseInit.js";
import { Gpio } from "pigpio";
import { set } from "firebase/database";
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

function getIsOwnerRegistered() {
  return Atomics.load(sharedUint8Array, 2);
}
function setIsOwnerRegistered(bool) {
  Atomics.store(sharedUint8Array, 2, bool);
}

function getIsAuthStateLoggedIn() {
  return Atomics.load(sharedUint8Array, 3);
}
function setIsAuthStateLoggedIn(bool) {
  Atomics.store(sharedUint8Array, 3, bool);
}

// リードスイッチのGPIO(PIN) = 11
const PIN = 11;

// GPIO(11pin)を入力モードとし、pull up設定とする
const readSwitch = new Gpio(PIN, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
});

// このスレッドで保持しておく状態変数
let isOpened = false;
while (true) {
  // このwhile内で一時保持する変数 whileIsOpened
  const whileIsOpened = Boolean(readSwitch.digitalRead());

  // 0.500sec待機
  const Time = Date.now();
  while (Date.now() - Time < 500) {}

  //*/ スレッド内状態変数[isOpened] と while内取得値[whileIsOpened] が異値 &&
  //*/ 0.500secスリープ後も while内取得値[whileIsOpened] と 現在の状態 が 同値 &&
  //*/ オーナーが登録済み
  // の場合
  if (
    isOpened != whileIsOpened &&
    whileIsOpened == Boolean(readSwitch.digitalRead()) &&
    getIsOwnerRegistered()
  ) {
    // 共有メモリに保存
    setIsOpened(whileIsOpened);

    // スレッドで保持している状態変数も更新
    isOpened = whileIsOpened;

    // 非ログイン状態だったら2秒待機してログインを待つ
    if (getIsAuthStateLoggedIn() == false) {
      const Time = Date.now();
      while (Date.now() - Time < 2000) {}
    }

    // RealtimeDatabaseに保存
    await set(isOpenedRef, whileIsOpened).catch((err) => {
      console.log(err);
    });

    // ログ
    console.log(`isOpened: ${whileIsOpened}`);
  }
}
