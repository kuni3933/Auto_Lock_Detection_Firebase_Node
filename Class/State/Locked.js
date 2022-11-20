import { onValue } from "firebase/database";
import * as fs from "fs";
import { State } from "./State.js";
import { Unlocked } from "./Unlocked.js";

export class Locked extends State {
  constructor(raspPiSerialNumber) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber);
    this.isLocked = true;
  }

  // stateの変更直後にモーターを回す際のメソッド
  entry_proc() {
    super.entry_proc();
    // Locked_Angle
    const Locked_Angle = (() => {
      const jsonData = JSON.parse(fs.readFileSync("config.json", "utf-8"));
      const Angle = jsonData.Locked_Angle;
      return Angle;
    })();

    // ログ
    console.log("State: Locked");
    console.log(`Locked_Angle: ${Locked_Angle}`);

    // インスタンス生成の段階でモーターをUnlockedの位置まで回す
    console.log(`モーターを${Locked_Angle}度まで回す`);
  }

  wait_for_next_state() {
    super.wait_for_next_state();
    while (true) {
      if (this.moveNextState == true) {
        console.log("nextState: Unlocked");
        break;
      }
    }
    const nextState = new Unlocked(this.raspPiSerialNumber);
    return nextState;
  }

  exit_proc() {
    super.exit_proc();
  }
}
