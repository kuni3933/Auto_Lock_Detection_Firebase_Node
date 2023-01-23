import { autolockSensorRef } from "../lib/FirebaseInit.js";
import { onValue } from "firebase/database";
import { writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

//* Configディレクトリのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../Config`;
//console.log(`configDirPath: ${configDirPath}`);

onValue(autolockSensorRef, (snapshot) => {
  // ログ
  console.log("childThread: onValue_autolock_sensor.js");

  // 変更値をisLockedに格納
  const jsonObj = { Autolock_Sensor: undefined };
  jsonObj["Autolock_Sensor"] = snapshot.val();

  // ログ
  console.log(`{ onValue_autolock_sensor: ${jsonObj["Autolock_Sensor"]} }`);

  // Config/Autolock_Sensor.json への書き込み
  if (
    jsonObj["Autolock_Sensor"] == true ||
    jsonObj["Autolock_Sensor"] == false
  ) {
    writeFileSync(
      `${configDirPath}/Autolock_Sensor.json`,
      JSON.stringify(jsonObj, null, 2) + "\n"
    );
  }
});
