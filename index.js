import { aa_log } from "./lib/AsciiArtLog.js";
import { db } from "./lib/FirebaseInit.js";
import { exec } from "child_process";
import { onValue, ref } from "firebase/database";
import { lockCommand, unlockCommand } from "./lib/PythonFileCheck.js";
import { raspPiNum } from "./lib/RaspPiSerialNumberInit.js";

// Initialize notInitializationFlag
let notInitializationFlag = false;

// Initialize command
let command = null;

// Initialize raspPiNum_DatabaseReference
const isLockedRef = ref(db, `Rasp_Pi/${raspPiNum}/Is_Locked`);

// Get Is_Locked_Value
onValue(isLockedRef, (snapshot) => {
  console.log("--------------------------------------------------");
  switch (snapshot.val()) {
    case null:
      console.log("Error: snapshot.val() == null ...<(+p+)>");
      break;

    case true:
      console.log(raspPiNum + ".Is_Locked: True");
      aa_log("True");
      command = lockCommand;
      break;

    case false:
      console.log(raspPiNum + ".Is_Locked: False");
      aa_log("False");
      command = unlockCommand;
      break;

    default:
      break;
  }

  if (notInitializationFlag == true) {
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
    } else {
      console.log("Error: command == null ...<(+p+)>");
    }
  } else {
    notInitializationFlag = true;
    console.log("Warning: notInitializationFlag == true ...<(+p+)>");
  }
});
