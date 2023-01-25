import { existsSync, writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import { Door } from "./Class/Door.js";

//* Configディレクトリのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../Config`;
//console.log(`configDirPath: ${configDirPath}`);

//* Config/*.json の存在チェックと無かった場合のファイル作成
// "Config/Angle.json" の存在確認と無かった場合のファイル作成
if (!existsSync(`${configDirPath}/Angle.json`)) {
  writeFileSync(`${configDirPath}/Angle.json`, '{"Lock": 0,"Unlock": 0}\n');
}
// "Config/AutoLockState.json" の存在確認と無かった場合のファイル作成"
if (!existsSync(`${configDirPath}/AutoLockState.json`)) {
  writeFileSync(
    `${configDirPath}/AutoLockState.json`,
    '{"AutoLockState": false}\n'
  );
}
// "Config/AutoLockStateDelayTime.json" の存在確認と無かった場合のファイル作成"
if (!existsSync(`${configDirPath}/AutoLockStateDelayTime.json`)) {
  writeFileSync(
    `${configDirPath}/AutoLockStateDelayTime.json`,
    '{"AutoLockStateDelayTime": false}\n'
  );
}
// "Config/AutoLockTime.json" の存在確認と無かった場合のファイル作成
if (!existsSync(`${configDirPath}/AutoLockTime.json`)) {
  writeFileSync(`${configDirPath}/AutoLockTime.json`, '{"AutoLockTime": 0}\n');
}

//* スレッド間で共有する配列を宣言(4Byte)
// 参考1:https://stackoverflow.com/questions/51053222/node-js-worker-threads-shared-object-store
// 参考2:https://note.affi-sapo-sv.com/js-sharedarraybuffer.php#title4
const sharedArrayBuffer = new SharedArrayBuffer(8);
const sharedUint8Array = new Uint8Array(sharedArrayBuffer);
//* sharedUint8Array[0] = ChildThread/onValue_isLocked.jsで更新されるDBのIs_Lockedの状態[isLocked]: true(1)ならロック状態
//* sharedUint8Array[1] = ChildThread/readSwitch.js で更新されるDoorの状態[isOpened]: true(1)なら開いている
//* sharedUint8Array[2] = ChildThread/onValue_isLocked.jsで更新されるFirebaseとの接続状態[isConnected]: true(1)なら接続状態
//* sharedUint8Array[3] = ChildThread/isOwnerRegistered.js でオーナーが登録されている(customToken.jsonの存在可否)かの状態[isOwnerRegistered]: true(1)なら登録済み
//* sharedUint8Array[4] = ChildThread/onAuthStateCheanged.js で更新されるログイン状態[isAuthStateLoggedIn]: true(1)ならログイン済み

//* readSwitchのisOpenedを読込/更新する子スレッドを起動
const isOpened_Thread = new Worker(`${__dirname}/ChildThread/isOpened.js`, {
  workerData: sharedArrayBuffer,
});

//* カスタムトークンが存在するか(オーナーが登録されているか)監視する子スレッドを起動
const isOwnerRegistered_Thread = new Worker(
  `${__dirname}/ChildThread/isOwnerRegistered.js`,
  {
    workerData: sharedArrayBuffer,
  }
);

//* ログイン状態を監視/更新する子スレッドを起動
const onAuthStateChanged_Thread = new Worker(
  `${__dirname}/ChildThread/onAuthStateChanged.js`,
  {
    workerData: sharedArrayBuffer,
  }
);

//* ロック/アンロック角度設定の読込/更新を行う子スレッドを起動
const onValue_angle_Thread = new Worker(
  `${__dirname}/ChildThread/onValue_angle.js`
);

//* オートロック関連設定の読込/更新を行う子スレッドを起動
const onSnapshot_autolock_Thread = new Worker(
  `${__dirname}/ChildThread/onSnapshot_raspPiSerialNumberDoc.js`
);

//* RealtimeDatabaseのIs_Lockedを読込/更新する子スレッドを起動
const onValue_isLocked_Thread = new Worker(
  `${__dirname}/ChildThread/onValue_isLocked.js`,
  { workerData: sharedArrayBuffer }
);

//* RealtimeDatabaseのIs_Onlineを読込/更新する子スレッドを起動
const onValue_isOnline_Thread = new Worker(
  `${__dirname}/ChildThread/onValue_isOnline.js`,
  { workerData: sharedArrayBuffer }
);

//* メイン処理を起動
//* "Config/customToken.json" の存在確認が取れるまで(オーナー登録がされるまで)無限ループ
const door = await Door.initDoor(sharedArrayBuffer, onValue_isLocked_Thread);
while (true) {
  console.log(
    `${Atomics.load(sharedUint8Array, 0)} ${Atomics.load(
      sharedUint8Array,
      1
    )} ${Atomics.load(sharedUint8Array, 2)} ${Atomics.load(
      sharedUint8Array,
      3
    )} ${Atomics.load(sharedUint8Array, 4)}`
  );
  // カスタムトークンがある(オーナーが登録されている)間はdoor.update_state()
  if (Atomics.load(sharedUint8Array, 3) == true) {
    door.update_state();
  }
  // 存在しなかったらスリープ
  else {
    // スリープ
    const Time = Date.now();
    while (Date.now() - Time < 5000) {}
  }
}

//*/
