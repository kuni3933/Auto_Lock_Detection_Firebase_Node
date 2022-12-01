import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import { Door } from "./Class/Door.js";

//* Configディレクトリのパス
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../Config`;
console.log(`configDirPath: ${configDirPath}`);

//* Config/*.json の存在チェックと無かった場合のファイル作成
// Configディレクトリ の存在確認と無かった場合のディレクトリ作成
if (!fs.existsSync(configDirPath)) {
  fs.mkdirSync(configDirPath);
}
// "Config/Angle.json" の存在確認と無かった場合のファイル作成
if (!fs.existsSync(`${configDirPath}/Angle.json`)) {
  fs.writeFileSync(`${configDirPath}/Angle.json`, '{"Lock": 0,"Unlock": 0}');
}
// "Config/Autolock_Sensor.json" の存在確認と無かった場合のファイル作成"
if (!fs.existsSync(`${configDirPath}/Autolock_Sensor.json`)) {
  fs.writeFileSync(
    `${configDirPath}/Autolock_Sensor.json`,
    '{"Autolock_Sensor": false}'
  );
}
// "Config/Autolock_Time.json" の存在確認と無かった場合のファイル作成
if (!fs.existsSync(`${configDirPath}/Autolock_Time.json`)) {
  fs.writeFileSync(
    `${configDirPath}/Autolock_Time.json`,
    '{"Autolock_Time": 0}'
  );
}
// "Config/Token.json" の存在確認と無かった場合のファイル作成
if (!fs.existsSync(`${configDirPath}/Token.json`)) {
  fs.writeFileSync(`${configDirPath}/Token.json`, '{"Token": ""}');
}

//* スレッド間で共有する配列を宣言(4Byte)
// 参考1:https://stackoverflow.com/questions/51053222/node-js-worker-threads-shared-object-store
// 参考2:https://note.affi-sapo-sv.com/js-sharedarraybuffer.php#title4
//* sharedArrayBuffer[0] = ChildThread/onValue.jsで更新されるRealtimeDatabaseのisLocked[isLocked]
//* sharedArrayBuffer[1] = ChildThread/readSwitch.js で更新されるDoorの状態[isOpened]
const sharedArrayBuffer = new SharedArrayBuffer(4);
const sharedUint8Array = new Uint8Array(sharedArrayBuffer);
// 初期値設定
Atomics.store(sharedUint8Array, 0, false); // 初期値: isLocked = false
Atomics.store(sharedUint8Array, 1, false); // 初期値: isOpened = false

//* ロック/アンロック角度設定の読込/更新を行う子スレッドを起動
const onValue_angle_Thread = new Worker(
  `${__dirname}/ChildThread/onValue_angle.js`
);

//* オートロックセンサー設定の読込/更新を行う子スレッドを起動
const onValue_autolock_sensor_Thread = new Worker(
  `${__dirname}/ChildThread/onValue_autolock_sensor.js`
);

//* オートロックタイム設定の読込/更新を行う子スレッドを起動
const onValue_autolock_time_Thread = new Worker(
  `${__dirname}/ChildThread/onValue_autolock_time.js`
);

//* RealtimeDatabaseのIs_Lockedを読込/更新する子スレッドを起動
const onValue_isLocked_Thread = new Worker(
  `${__dirname}/ChildThread/onValue_isLocked.js`,
  { workerData: sharedArrayBuffer }
);

//* readSwitchのisOpenedを読込/更新する子スレッドを起動
const readSwitch_Thread = new Worker(`${__dirname}/ChildThread/readSwitch.js`, {
  workerData: sharedArrayBuffer,
});

//* メイン処理を起動
const door = await Door.initDoor(sharedArrayBuffer, onValue_isLocked_Thread);
while (true) {
  door.update_state();
}

//*/
