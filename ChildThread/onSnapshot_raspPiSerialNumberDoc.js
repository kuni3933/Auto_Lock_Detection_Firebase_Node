import { raspPiSerialNumberDocRef } from "../lib/FirebaseInit.js";
import { onSnapshot } from "firebase/firestore";
import { writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

//* Configディレクトリのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../Config`;
//console.log(`configDirPath: ${configDirPath}`);

const jsonObj = { Autolock_Sensor: undefined, Autolock_Time: undefined };

onSnapshot(raspPiSerialNumberDocRef, (docSnapshot) => {
  // ログ
  console.log("childThread: onSnapshot_raspPiSerialNumberDoc.js");
  console.log(docSnapshot.exists());
  /*
  // 変更値を格納
  const data = docSnapshot.data();
  jsonObj["Autolock_Sensor"] = data.AutoLockState;
  jsonObj["Autolock_Time"] = data.AutoLockTime;

  // Config/Autolock_Sensor.json への書き込み
  writeFileSync(
    `${configDirPath}/Autolock_Sensor.json.json`,
    JSON.stringify(jsonObj["Autolock_Sensor"], null, 2) + "\n"
  );
  // Config/Autolock_Time.json への書き込み
  writeFileSync(
    `${configDirPath}/Autolock_Time.json.json`,
    JSON.stringify(jsonObj["Autolock_Time"], null, 2) + "\n"
  );

  // ログ
  console.log(`{ onSnapshot_autolock_sensor: ${jsonObj["Autolock_Sensor"]} }`);
  console.log(`{ onSnapshot_autolock_time[sec]: ${jsonObj["Autolock_Time"]} }`);
  */
});
