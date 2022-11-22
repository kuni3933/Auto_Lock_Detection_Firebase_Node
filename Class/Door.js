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

  execute_state() {
    this.state.entry_proc();
    this.state.wait_for_next_state();
  }

  change_state() {
    this.state.exit_proc();
    if (this.state instanceof Locked) {
      this.state = new Unlocked(this.raspPiSerialNumber);
    } else if (this.state instanceof Unlocked) {
      this.state = new Locked(this.raspPiSerialNumber);
    }
  }
}
