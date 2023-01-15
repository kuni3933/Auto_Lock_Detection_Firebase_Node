import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { onValue } from "firebase/database";
import { autolockSensorRef } from "../lib/FirebaseInit.js";

//* Configディレクトリのパス
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    fs.writeFileSync(
      `${configDirPath}/Autolock_Sensor.json`,
      JSON.stringify(jsonObj, null, 2)
    );
  }
});
