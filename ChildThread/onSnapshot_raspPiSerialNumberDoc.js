import { raspPiSerialNumberDocRef } from "../lib/FirebaseInit.js";
import { onSnapshot } from "firebase/firestore";
import { writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

//* Configディレクトリのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../Config`;
//console.log(`configDirPath: ${configDirPath}`);

// 各パスのスレッド内更新用変数
const autoLockState_jsonObj = {
  AutoLockState: undefined,
};
const autoLockStateDelayTime_jsonObj = {
  AutoLockStateDelayTime: undefined,
};
const autoLockTime_jsonObj = {
  AutoLockTime: undefined,
};

onSnapshot(raspPiSerialNumberDocRef, (docSnapshot) => {
  console.log("childThread: onSnapshot_raspPiSerialNumberDoc.js");
  //console.log(docSnapshot.exists());
  const data = docSnapshot.data();

  if (autoLockState_jsonObj["AutoLockState"] != data["AutoLockState"]) {
    // スレッド内変数の更新
    autoLockState_jsonObj["AutoLockState"] = data["AutoLockState"];

    // Config/AutoLockState.json への書き込み
    writeFileSync(
      `${configDirPath}/AutoLockState.json`,
      JSON.stringify(autoLockState_jsonObj, null, 2) + "\n"
    );

    console.log(`{ onSnapshot_autoLockState: ${data["AutoLockState"]} }`);
  }

  if (
    autoLockStateDelayTime_jsonObj["AutoLockStateDelayTime"] !=
    data["AutoLockStateDelayTime"]
  ) {
    // スレッド内変数の更新
    autoLockStateDelayTime_jsonObj["AutoLockStateDelayTime"] =
      data["AutoLockStateDelayTime"];

    // Config/AutoLockTime.json への書き込み
    writeFileSync(
      `${configDirPath}/AutoLockStateDelayTime.json`,
      JSON.stringify(autoLockStateDelayTime_jsonObj, null, 2) + "\n"
    );

    console.log(
      `{ onSnapshot_autoLockStateDelayTime[sec]: ${data["AutoLockStateDelayTime"]} }`
    );
  }

  if (autoLockTime_jsonObj["AutoLockTime"] != data["AutoLockTime"]) {
    // スレッド内変数の更新
    autoLockTime_jsonObj["AutoLockTime"] = data["AutoLockTime"];

    // Config/AutoLockTime.json への書き込み
    writeFileSync(
      `${configDirPath}/AutoLockTime.json`,
      JSON.stringify(autoLockTime_jsonObj, null, 2) + "\n"
    );

    console.log(`{ onSnapshot_autoLockTime[sec]: ${data["AutoLockTime"]} }`);
  }
});
