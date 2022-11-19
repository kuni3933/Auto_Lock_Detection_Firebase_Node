import { db } from "../../lib/FirebaseInit.js";
import { ref } from "firebase/database";
export class State {
  // Property
  raspPiSerialNumber;
  isLockedRef;
  isLockedHistoryRef;
  isLockedUserHistoryRef;

  // Constructor
  constructor(raspPiSerialNumber) {
    // set raspPiSerialNumber
    this.raspPiSerialNumber = raspPiSerialNumber;

    // set Is_Locked_Ref
    this.isLockedRef = ref(db, `RaspPi/${raspPiSerialNumber}/Is_Locked`);

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
  initOnValue() {}
  entry_proc() {}
  wait_for_next_state() {}
  exit_proc() {}
  reset() {}
}
