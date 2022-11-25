import { db } from "../../lib/FirebaseInit.js";
import { ref } from "firebase/database";
export class State {
  // Property
  raspPiSerialNumber;
  isLocked;
  moveNextState;
  isLockedHistoryRef;
  isLockedUserHistoryRef;

  // Constructor
  constructor(raspPiSerialNumber) {
    // set raspPiSerialNumber
    this.raspPiSerialNumber = raspPiSerialNumber;

    // set isLocked
    this.isLocked = undefined;

    // set moveNextState
    this.moveNextState = undefined;

    // set Is_Locked_History_Ref
    this.isLockedHistoryRef = ref(
      db,
      `RaspPi/${raspPiSerialNumber}/Is_Locked_History`
    );

    // set Is_Locked_User_History_Ref
    this.isLockedUserHistoryRef = ref(
      db,
      `RaspPi/${raspPiSerialNumber}/Is_Locked_User_History`
    );
  }

  // method
  entry_proc() {
    console.log("--------------------------------------------------");
    console.log(`${this.constructor.name}: entry_proc()`);
  }
  wait_for_next_state() {
    console.log(`\n${this.constructor.name}: wait_for_next_state()`);
  }
  exit_proc() {
    console.log(`\n${this.constructor.name}: exit_proc()`);
    console.log("State is changed");
  }
  reset() {
    console.log(`\n${this.constructor.name}: reset()`);
  }
}