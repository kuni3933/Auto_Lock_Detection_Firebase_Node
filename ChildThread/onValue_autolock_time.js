import { autolockTimeRef } from "../lib/FirebaseInit.js";
import { onValue } from "firebase/database";
import { writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

//* Configディレクトリのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../Config`;
//console.log(`configDirPath: ${configDirPath}`);

onValue(autolockTimeRef, (snapshot) => {
  // ログ
  console.log("childThread: onValue_autolock_time.js");

  // 変更値[オブジェクト]をjsonObj["Autolock_Time"]に格納
  const jsonObj = { Autolock_Time: undefined };
  jsonObj["Autolock_Time"] = snapshot.val();

  // ログ
  console.log(`{ onValue_autolock_time[sec]: ${jsonObj["Autolock_Time"]} }`);

  // Config/Autolock_Time.json への書き込み
  writeFileSync(
    `${configDirPath}/Autolock_Time.json`,
    JSON.stringify(jsonObj, null, 2) + "\n"
  );
});
