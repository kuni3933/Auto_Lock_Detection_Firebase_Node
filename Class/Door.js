import { getSerialNumber } from "raspi-serial-number";
import { Unlocked } from "./State/Unlocked.js";

export class Door {
  // Property
  raspPiSerialNumber;
  sharedArrayBuffer;
  state;

  // Constructor
  constructor(raspPiSerialNumber, sharedArrayBuffer) {
    console.log("--------------------------------------------------");
    console.log("Initialize: Autolock_Raspi_Client");
    console.log(`SerialNumber: ${raspPiSerialNumber}\n`);

    // シリアルナンバーをセット
    this.raspPiSerialNumber = raspPiSerialNumber;

    // sharedArrayBuffer をセット
    this.sharedArrayBuffer = sharedArrayBuffer;

    // 初期ステートとして[Unlocked]をセット
    this.state = new Unlocked(raspPiSerialNumber, sharedArrayBuffer);
  }

  static async initDoor(sharedArrayBuffer) {
    const serialNumber = await getSerialNumber()
      .then((number) => {
        return number;
      })
      .catch((err) => {
        console.log(err);
        return "83ed5c72";
      });

    const door = new Door(serialNumber, sharedArrayBuffer);
    return door;
  }

  async update_state() {
    this.state.entry_proc();
    const nextState = await this.state.wait_for_next_state();
    this.state.exit_proc();
    this.state = nextState;
  }
}
