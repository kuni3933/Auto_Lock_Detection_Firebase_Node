import * as fs from "fs";
import sleep from "sleep";
import { workerData } from "worker_threads";

// 共有メモリの設定
const sharedUint8Array = new Uint8Array(workerData);

// このスレッドで保持しておく状態変数
let isOwnerRegistered = false;
while (true) {
  // このwhile内で一時保持する変数
  const whileIsOwnerRegistered = fs.existsSync(
    `${configDirPath}/customToken.json`
  );

  // このスレッドで保持している状態変数と比較 && writeFlagがtrueか判定
  if (isOwnerRegistered != whileIsOwnerRegistered) {
    // 比較結果として違った場合は共有メモリに保存
    Atomics.store(sharedUint8Array, 2, whileIsOwnerRegistered);

    // スレッドで保持している状態変数も更新
    isOwnerRegistered = whileIsOwnerRegistered;

    // ログ
    console.log(`isOwnerRegistered: ${whileIsOwnerRegistered}`);
  }
  // スリープ
  sleep.sleep(5);
}
