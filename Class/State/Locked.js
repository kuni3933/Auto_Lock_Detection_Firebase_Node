import { State } from "./State.js";
import { Unlocked } from "./Unlocked.js";
import { readFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

//* Configディレクトリのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../../Config`;
//console.log(`configDirPath: ${configDirPath}`);

export class Locked extends State {
  //* コンストラクタ
  constructor(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread);
    this.isLockedBoolean = true;
  }

  //* メソッド
  //* モーターを[Locked]状態にまで回す際のメソッド
  entry_proc() {
    super.entry_proc();

    // Angle
    const Angle = (() => {
      const Angle = JSON.parse(
        readFileSync(`${configDirPath}/Angle.json`, "utf-8")
      );
      // ログ
      console.log(`${JSON.stringify(Angle, null, 2)}`);
      return Angle;
    })();

    // モーターを[Locked]の位置まで回す
    console.log(`モーターを${Angle.Lock}度まで回す`);
    this.ServoMotorClient.Turn(Angle.Lock, "Locked");
  }

  //* 次のステートへ移行するためイベントを待つメソッド
  wait_for_next_state() {
    super.wait_for_next_state();

    while (true) {
      // firebase側からUnlockedが指示された場合
      if (this.isLocked != this.isLockedBoolean) {
        break;
      }
      // ドアが開いた場合
      if (this.isOpened == true) {
        // onValue_isLocked_Threadに書き込み処理のためisLockedをPost送信
        this.onValue_isLocked_Thread.postMessage({ isLocked: false });
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
