import { workerData } from "worker_threads";
import { Gpio } from "pigpio";

const sharedUint8Array = new Uint8Array(workerData);

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

  // このスレッドで保持している状態と比較
  if (isOpened != whileIsOpened) {
    // 比較結果として違った場合は保存
    Atomics.store(sharedUint8Array, 1, whileIsOpened);
    isOpened = whileIsOpened;
    console.log(`isOpened: ${whileIsOpened}`);
  }
}
