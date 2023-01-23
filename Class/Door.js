import { Unlocked } from "./State/Unlocked.js";
import { readFile } from "fs";

export class Door {
  // Property
  raspPiSerialNumber;
  state;

  // Constructor
  constructor(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread) {
    console.log("--------------------------------------------------");
    console.log("Initialize: Autolock_Raspi_Client");
    console.log(`SerialNumber: ${raspPiSerialNumber}\n`);

    // シリアルナンバーをセット
    this.raspPiSerialNumber = raspPiSerialNumber;

    // 初期ステートとして[Unlocked]をセット
    this.state = new Unlocked(
      raspPiSerialNumber,
      sharedArrayBuffer,
      onValue_isLocked_Thread
    );
  }

  static async initDoor(sharedArrayBuffer, onValue_isLocked_Thread) {
    const raspPiSerialNumber = await readFile(
      "/sys/firmware/devicetree/base/serial-number",
      "utf-8"
    ).catch((err) => {
      console.log(err);
      return "SerialNumber_3";
    });

    const door = new Door(
      raspPiSerialNumber,
      sharedArrayBuffer,
      onValue_isLocked_Thread
    );
    return door;
  }

  update_state() {
    this.state.entry_proc();
    const nextState = this.state.wait_for_next_state();
    this.state.exit_proc();
    this.state = nextState;
  }
}
