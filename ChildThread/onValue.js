import { parentPort } from "worker_threads";
import { getSerialNumber } from "raspi-serial-number";
import { onValue, ref } from "firebase/database";
import { db } from "../lib/FirebaseInit.js";

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
