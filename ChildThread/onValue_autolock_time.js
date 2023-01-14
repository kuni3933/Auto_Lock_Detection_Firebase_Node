import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { onValue } from "firebase/database";
import { autolockTimeRef } from "../lib/FirebaseInit.js";

//* Configディレクトリのパス
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../Config`;
//console.log(`configDirPath: ${configDirPath}`);

onValue(autolockTimeRef, (snapshot) => {
  // ログ
  console.log("childThread: onValue_autolock_time.js");

  // 変更値[オブジェクト]をonValue_angleに格納
  const onValue_autolock_time = snapshot.val();

  // ログ
  console.log(`{ onValue_autolock_time[sec]: ${onValue_autolock_time} }`);

  // Config/Autolock_Time.json への書き込み
  fs.writeFileSync(
    `${configDirPath}/Autolock_Time.json`,
    `{"Autolock_Time": ${onValue_autolock_time}}`
  );
});
