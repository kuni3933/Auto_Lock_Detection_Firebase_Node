import { getSerialNumber } from "raspi-serial-number";
import { ref, onValue, onChildChanged } from "firebase/database";
import { db } from "../lib/FirebaseInit.js";
import { Locked } from "./State/Locked.js";
import { Unlocked } from "./State/Unlocked.js";

export class Door {
  // Property
  raspPiSerialNumber;
  isLockedRef;
  state;

  // Constructor
  constructor(raspPiSerialNumber) {
    console.log("--------------------------------------------------");
    console.log("Initialize: Autolock_Raspi_Client");
    console.log(`SerialNumber: ${raspPiSerialNumber}\n`);

    // シリアルナンバーをセット
    this.raspPiSerialNumber = raspPiSerialNumber;

    // Is_Locked_Refをセット
    this.isLockedRef = ref(db, `RaspPi/${raspPiSerialNumber}/Is_Locked`);

    // 初期ステートとして[Unlocked]をセット
    this.state = new Unlocked(raspPiSerialNumber);
  }

  static async initDoor() {
    const serialNumber = await getSerialNumber()
      .then((number) => {
        return number;
      })
      .catch((err) => {
        console.log(err);
        return "83ed5c72";
      });

    const door = new Door(serialNumber);
    return door;
  }

  // method
  async initOnValue() {
    console.log("--------------------------------------------------");
    console.log("Start: initOnValue()");

    onValue(this.isLockedRef, (snapshot) => {
      let isLocked = snapshot.val();

      if (isLocked != this.state.isLocked && this.state.moveNextState != true) {
        this.state.moveNextState = true;
      }

      console.log(`\nsnapshot: ${isLocked}`);
      console.log(`moveNextState: ${this.state.moveNextState}\n`);
    });
  }

  async initOnChildChanged() {
    console.log("--------------------------------------------------");
    console.log("Start: initOnChildChanged()");

    onChildChanged(this.isLockedRef, (snapshot) => {
      let isLocked = snapshot.val();

      if (isLocked != this.state.isLocked && this.state.moveNextState != true) {
        this.state.moveNextState = true;
      }

      console.log(`\nsnapshot: ${isLocked}`);
      console.log(`moveNextState: ${this.state.moveNextState}\n`);
    });
  }

  update_state() {
    this.state.entry_proc();
    const nextState = this.state.wait_for_next_state();
    this.state.exit_proc();
    this.state = nextState;
  }
}
