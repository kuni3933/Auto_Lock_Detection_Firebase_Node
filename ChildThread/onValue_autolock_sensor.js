import * as fs from "fs";
import { getSerialNumber } from "raspi-serial-number";
import { onValue, ref } from "firebase/database";
import { db } from "../lib/FirebaseInit.js";

//* Configディレクトリのパス
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../Config`;
console.log(`configDirPath: ${configDirPath}`);

//* Get raspPiSerialNumber
const raspPiSerialNumber = await getSerialNumber()
  .then((number) => {
    return number;
  })
  .catch((err) => {
    console.log(err);
    return "83ed5c72";
  });

onValue(ref(db, `RaspPi/${raspPiSerialNumber}/Autolock_Sensor`), (snapshot) => {
  // ログ
  console.log("childThread: onValue_autolock_sensor.js");

  // 変更値をisLockedに格納
  let onValue_autolock_sensor = snapshot.val();

  // ログ
  console.log(`{ onValue_autolock_sensor: ${onValue_autolock_sensor} }`);

  // Config/Autolock_Sensor.json への書き込み
  if (onValue_autolock_sensor == true || onValue_autolock_sensor == false) {
    fs.writeFileSync(
      `${configDirPath}/Autolock_Sensor.json`,
      `{"Autolock_Sensor": ${onValue_autolock_sensor}}`
    );
  }
});
