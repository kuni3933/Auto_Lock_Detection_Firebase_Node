import { workerData } from "worker_threads";
import { getSerialNumber } from "raspi-serial-number";
import { onValue, ref } from "firebase/database";
import { db } from "../lib/FirebaseInit.js";

//
const sharedUint8Array = new Uint8Array(workerData);

//* Get raspPiSerialNumber
const raspPiSerialNumber = await getSerialNumber()
  .then((number) => {
    return number;
  })
  .catch((err) => {
    console.log(err);
    return "83ed5c72";
  });

onValue(ref(db, `RaspPi/${raspPiSerialNumber}/Is_Locked`), (snapshot) => {
  // ログ
  console.log("childThread: onValue_isLocked.js");

  // 変更値をisLockedに格納
  let onValue_isLocked = snapshot.val();

  // ログ
  console.log(`{ onValue_isLocked: ${onValue_isLocked} }`);

  if (onValue_isLocked == true || onValue_isLocked == false) {
    Atomics.store(sharedUint8Array, 0, onValue_isLocked);
  }
});
