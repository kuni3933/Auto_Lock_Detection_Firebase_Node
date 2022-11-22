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

onValue(ref(db, `RaspPi/${raspPiSerialNumber}/Is_Locked`), (snapshot) => {
  let isLocked = snapshot.val();

  console.log("childThread: onValue.js");
  // console.log(`snapshot: ${isLocked}`);
  parentPort.postMessage({ isLocked: isLocked });
});

onValue(ref(db, `RaspPi/${raspPiSerialNumber}/Angle`), (snapshot) => {
  const onValue_Angle = snapshot.val();
  const jsonData = JSON.parse(fs.readFileSync("config.json", "utf-8"));
  jsonData.Angle = onValue_Angle;
  fs.writeFileSync("config.json", JSON.stringify(jsonData));

  console.log("childThread: onValue.js");
  //console.log("childThread: onValue.js");
  parentPort.postMessage({ Angle: onValue_Angle });
});
