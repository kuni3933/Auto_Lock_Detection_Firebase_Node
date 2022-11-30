import * as fs from "fs";
import { set } from "firebase/database";
import { State } from "./State.js";
import { Unlocked } from "./Unlocked.js";

export class Locked extends State {
  constructor(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread);
    this.isLockedBoolean = true;
  }

  //* モーターを[Locked]状態にまで回す際のメソッド
  entry_proc() {
    super.entry_proc();

    // Angle
    const Angle = (() => {
      const Angle = JSON.parse(fs.readFileSync("./Config/Angle.json", "utf-8"));
      // ログ
      console.log(`${JSON.stringify(Angle)}`);
      return Angle;
    })();

    // モーターを[Locked]の位置まで回す
    console.log(`モーターを${Angle.Lock}度まで回す`);
  }

  //* 次のステートへ移行するためイベントを待つメソッド
  wait_for_next_state() {
    super.wait_for_next_state();

    // Angle
    const Angle = (() => {
      const Angle = JSON.parse(fs.readFileSync("./Config/Angle.json", "utf-8"));
      // ログ
      console.log(`${JSON.stringify(Angle)}`);
      return Angle;
    })();

    while (true) {
      // ドアが開いた場合
      if (this.isOpened == true) {
        // onValue_isLocked_Threadに書き込み処理のためisLockedをPost送信
        this.onValue_isLocked_Thread.postMessage({ isLocked: false });
        // ついでにsharedUint8Array[0]に0を書き込む
        this.isLocked = false;
        break;
      }
      // firebase側からUnlockedが指示された場合
      else if (this.isLocked != this.isLockedBoolean) {
        break;
      }
    }
    return new Unlocked(
      this.raspPiSerialNumber,
      this.sharedArrayBuffer,
      this.onValue_isLocked_Thread
    );
  }

  //* 次のステートに移行する直前に実行されるメソッド
  exit_proc() {
    super.exit_proc();
    console.log("nextState: Unlocked\n");
  }

  //* タイマーリセットを行うメソッド
  reset() {
    super.reset();
  }
}
