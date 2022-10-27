import { raspPiNum } from "./lib/RaspPiSerialNumberInit";
class Door {
  constructor() {
    this.state = Unlocked;

    console.log("--------------------------------------------------");
    console.log("Initialize: Autolock_Raspi_Client");
    console.log(`SerialNumber: ${raspPiNum}`);
    console.log("--------------------------------------------------");
  }

  update_state() {
    this.state;
  }
}
