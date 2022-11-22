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

    // Angle
    const Angle = (() => {
      const jsonData = JSON.parse(fs.readFileSync("config.json", "utf-8"));
      return jsonData.Angle;
    })();

    // ログ
    console.log(`${JSON.stringify(Angle)}`);

    // インスタンス生成の段階でモーターをUnlockedの位置まで回す
    console.log(`モーターを${Angle.Unlocked}度まで回す`);
  }

  wait_for_next_state() {
    super.wait_for_next_state();
    console.log("");
  }

  exit_proc() {
    super.exit_proc();
    console.log("nextState: Locked\n");
  }

  reset() {
    super.reset();
    console.log("");
  }
}
