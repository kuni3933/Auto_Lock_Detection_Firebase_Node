import sleep from "sleep";
import { isOpenedRef } from "../lib/FirebaseInit.js";
import { Gpio } from "pigpio";
import { set } from "firebase/database";
import { workerData } from "worker_threads";

//* 共有メモリの設定
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
  const whileIsOpened = readSwitch.digitalRead();

  // このスレッドで保持している状態変数と比較 && writeFlagがtrueか判定
  if (isOpened != whileIsOpened && getIsOwnerRegistered() == true) {
    // 比較結果として違った場合は共有メモリに保存
    setIsOpened(whileIsOpened);

    // スレッドで保持している状態変数も更新
    isOpened = whileIsOpened;

    // 非ログイン状態だったら1秒待機してログインを待つ
    if (getIsAuthStateLoggedIn() == false) {
      sleep.sleep(1);
    }
    // RealtimeDatabaseに保存
    set(isOpenedRef, whileIsOpened).catch((err) => {
      console.log(err);
    });

    // ログ
    console.log(`isOpened: ${whileIsOpened}`);
  }
}
