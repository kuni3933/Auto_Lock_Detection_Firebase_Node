import { getSerialNumber } from "raspi-serial-number";
import { onValue, ref } from "firebase/database";
import { db } from "../lib/FirebaseInit.js";
import * as fs from "fs";

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

onValue(ref(db, `RaspPi/${raspPiSerialNumber}/Angle`), (snapshot) => {
  // ログ
  console.log("childThread: onValue_angle.js");

  // 変更値[オブジェクト]をonValue_angleに格納
  const onValue_angle = snapshot.val();

  // ログ
  console.log(`{ onValue_angle: ${JSON.stringify(onValue_angle)} }`);

  // Config/Angle.json への書き込み
  fs.writeFileSync(
    `${configDirPath}/Angle.json`,
    JSON.stringify(onValue_angle)
  );
});
