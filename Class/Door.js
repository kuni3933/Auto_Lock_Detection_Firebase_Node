import { getSerialNumber } from "raspi-serial-number";
import { Locked } from "./State/Locked.js";
import { Unlocked } from "./State/Unlocked.js";

export class Door {
  // Property
  raspPiSerialNumber;
  state;

  // Constructor
  constructor(raspPiSerialNumber) {
    console.log("--------------------------------------------------");
    console.log("Initialize: Autolock_Raspi_Client");
    console.log(`SerialNumber: ${raspPiSerialNumber}\n`);

    // シリアルナンバーをセット
    this.raspPiSerialNumber = raspPiSerialNumber;

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
  update_state() {
    this.state.entry_proc();
    this.state.initOnValue();
    const nextState = this.state.wait_for_next_state();
    this.state.exit_proc();
    this.state = nextState;
  }
}
