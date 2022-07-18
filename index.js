import { aa_log } from "./lib/AsciiArtLog.js";
import { db } from "./lib/FirebaseInit.js";
import { exec } from "child_process";
import { onValue, ref } from "firebase/database";
import { lockPath, unlockPath } from "./lib/PythonFileCheck.js";
import { raspPiNum } from "./lib/RaspPiSerialNumberInit.js";

// Initialize scriptPath
const scriptPath = process.cwd();
console.log(`scriptPath: "${scriptPath}"\n`);

// Initialize command
let command = null;

// Initialize raspPiNum_DatabaseReference
const isLockedRef = ref(db, "Rasp_Pi/" + raspPiNum + "/Is_Locked");

// Get Is_Locked_Value
onValue(isLockedRef, (snapshot) => {
  console.log("--------------------------------------------------");
  switch (snapshot.val()) {
    case null:
      console.log("Error: snapshot.val() is null...<(+p+)>");
      break;
    case true:
      console.log(raspPiNum + ".Is_Locked: True");
      aa_log("True");
      command = lockPath;
      break;
    case false:
      console.log(raspPiNum + ".Is_Locked: False");
      aa_log("False");
      command = unlockPath;
      break;
    default:
      break;
  }

  if (command != null) {
    exec(command, function (err, stdout, stderr) {
      console.log("execute => " + command);
      if (!err) {
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
      } else {
        console.log(err);
      }
    });
    command = null;
  }
});
