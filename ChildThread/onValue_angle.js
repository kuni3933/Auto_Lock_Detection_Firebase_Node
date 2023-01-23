import { angleRef } from "../lib/FirebaseInit.js";
import { onValue } from "firebase/database";
import { writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

//* Configディレクトリのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
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
  writeFileSync(
    `${configDirPath}/Angle.json`,
    JSON.stringify(onValue_angle, null, 2) + "\n"
  );
});
