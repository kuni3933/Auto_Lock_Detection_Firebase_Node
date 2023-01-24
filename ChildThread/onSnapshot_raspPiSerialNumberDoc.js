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
const autoLockSensorJsonObj = {
  Autolock_Sensor: undefined,
};
const autoLockTimeJsonObj = {
  Autolock_Time: undefined,
};

onSnapshot(raspPiSerialNumberDocRef, (docSnapshot) => {
  console.log("childThread: onSnapshot_raspPiSerialNumberDoc.js");
  //console.log(docSnapshot.exists());
  const data = docSnapshot.data();

  if (autoLockSensorJsonObj["Autolock_Sensor"] != data["AutoLockState"]) {
    // スレッド内変数の更新
    autoLockSensorJsonObj["Autolock_Sensor"] = data["AutoLockState"];

    // Config/Autolock_Sensor.json への書き込み
    writeFileSync(
      `${configDirPath}/Autolock_Sensor.json`,
      JSON.stringify(autoLockSensorJsonObj["Autolock_Sensor"], null, 2) + "\n"
    );
  }

  if (autoLockTimeJsonObj["Autolock_Time"] != data["AutoLockTime"]) {
    // スレッド内変数の更新
    autoLockTimeJsonObj["Autolock_Time"] = data["AutoLockTime"];

    // Config/Autolock_Time.json への書き込み
    writeFileSync(
      `${configDirPath}/Autolock_Time.json`,
      JSON.stringify(autoLockTimeJsonObj["Autolock_Time"], null, 2) + "\n"
    );
  }

  console.log(
    `{ onSnapshot_autolockSensor: ${autoLockSensorJsonObj["Autolock_Sensor"]} }`
  );
  console.log(
    `{ onSnapshot_autolockTime[sec]: ${autoLockTimeJsonObj["Autolock_Time"]} }`
  );
});
