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
  // ログ
  console.log("childThread: onValue.js");

  // 変更値をisLockedに格納
  let isLocked = snapshot.val();

  // 親スレッドにisLockedをPOST送信
  parentPort.postMessage({ isLocked: isLocked });
});
