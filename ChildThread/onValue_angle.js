import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { onValue } from "firebase/database";
import { angleRef } from "../lib/FirebaseInit.js";

//* Configディレクトリのパス
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../Config`;
//console.log(`configDirPath: ${configDirPath}`);

onValue(angleRef, (snapshot) => {
  // ログ
  console.log("childThread: onValue_angle.js");

  // 変更値[オブジェクト]をonValue_angleに格納
  const onValue_angle = snapshot.val();

  // ログ
  console.log(`{ onValue_angle: ${JSON.stringify(onValue_angle, null, 2)} }`);

  // Config/Angle.json への書き込み
  fs.writeFileSync(
    `${configDirPath}/Angle.json`,
    JSON.stringify(onValue_angle, null, 2)
  );
});
