import * as fs from "fs";
import { State } from "./State.js";
import { Locked } from "./Locked.js";

export class Unlocked extends State {
  constructor(raspPiSerialNumber) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber);
    this.isLocked = false;
    this.moveNextState = false;
  }

  // stateの変更直後にモーターを回す際のメソッド
  entry_proc() {
    super.entry_proc();
    // Unlocked_Angle
    const Unlocked_Angle = (() => {
      const jsonData = JSON.parse(fs.readFileSync("config.json", "utf-8"));
      const Angle = jsonData.Unlocked_Angle;
      return Angle;
    })();

    // ログ
    console.log("State: Unlocked");
    console.log(`Unlocked_Angle: ${Unlocked_Angle}`);

    // インスタンス生成の段階でモーターをUnlockedの位置まで回す
    console.log(`モーターを${Unlocked_Angle}度まで回す`);
  }

  wait_for_next_state() {
    super.wait_for_next_state();
    while (true) {
      if (this.moveNextState == true) {
        break;
      }
    }
    const nextState = new Locked(this.raspPiSerialNumber);
    console.log("nextState: Locked");
    return nextState;
  }

  exit_proc() {
    super.exit_proc();
  }
}
