import { parentPort } from "worker_threads";
import { getSerialNumber } from "raspi-serial-number";
import { onValue, ref } from "firebase/database";
import { db } from "../lib/FirebaseInit.js";
import * as fs from "fs";

const raspPiSerialNumber = await getSerialNumber()
  .then((number) => {
    return number;
  })
  .catch((err) => {
    // console.log(err);
    return "83ed5c72";
  });

onValue(ref(db, `RaspPi/${raspPiSerialNumber}/Angle`), (snapshot) => {
  //ログ
  console.log("childThread: onValue.js");

  //変更値[オブジェクト]をonValue_Angleに格納
  const onValue_angle = snapshot.val();
  const jsonData = JSON.parse(fs.readFileSync("config.json", "utf-8"));
  jsonData.Angle = onValue_angle;
  fs.writeFileSync("config.json", JSON.stringify(jsonData));

  //親スレッドにonValue_AngleにPOST送信
  parentPort.postMessage({ angle: onValue_angle });
});
