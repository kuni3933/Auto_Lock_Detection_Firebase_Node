import { State } from "./State.js";
import { Locked } from "./Locked.js";
import { readFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

//* Configディレクトリのパス
const __dirname = dirname(fileURLToPath(import.meta.url));
const configDirPath = `${__dirname}/../../../Config`;
//console.log(`configDirPath: ${configDirPath}`);

export class Unlocked extends State {
  //* コンストラクタ
  constructor(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread) {
    // スーパークラスのStateを引き継ぐ
    super(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread);
    this.isLockedBoolean = false;
  }

  //* メソッド
  //* モーターを[Unlocked]状態にまで回す際のメソッド
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

    // モーターを[Unlocked]の位置まで回す
    console.log(`モーターを${Angle.Unlock}度まで回す`);
    this.ServoMotorClient.Turn(Angle.Unlock, "Unlocked");
  }

  //* 次のステートへ移行するためイベントを待つメソッド
  wait_for_next_state() {
    super.wait_for_next_state();

    // AutoLockState
    const AutoLockState = (() => {
      const AutoLockState = JSON.parse(
        readFileSync(`${configDirPath}/AutoLockState.json`, "utf-8")
      ).AutoLockState;
      //ログ
      console.log(`{ "AutoLockState": ${AutoLockState} }`);
      return AutoLockState;
    })();

    // AutoLockStateDelayTime
    const AutoLockStateDelayTime = (() => {
      const AutoLockState =
        JSON.parse(
          readFileSync(`${configDirPath}/AutoLockStateDelayTime.json`, "utf-8")
        ).AutoLockStateDelayTime * 1000;
      //ログ
      console.log(
        `{ "AutoLockStateDelayTime[ms]": ${AutoLockStateDelayTime} }`
      );
      return AutoLockStateDelayTime;
    })();

    //   AutoLockTime
    const AutoLockTime = (() => {
      const AutoLockTime =
        JSON.parse(readFileSync(`${configDirPath}/AutoLockTime.json`, "utf-8"))
          .AutoLockTime * 1000;
      //ログ
      console.log(`{ "AutoLockTime[ms]": ${AutoLockTime} }`);
      return AutoLockTime;
    })();

    // タイマー処理等のためにthis.timeをリセット
    this.reset();

    //* オートロックタイマーが0より大きい値 の場合
    if (0 < AutoLockTime) {
      let doorIsOpenedOnce = false; // リードスイッチでドアが一回開いたかどうかを判定する変数
      while (Date.now() - this.time < AutoLockTime) {
        // firebase側からLockedが指示された場合
        if (this.isLocked != this.isLockedBoolean) {
          break;
        }
        // ドアが開いた場合
        if (this.isOpened == true) {
          this.reset(); // タイマーをリセット
          doorIsOpenedOnce = true; // 一度はドアが開いたのでTrue
        }
        // リードスイッチによるオートロックがtrue && ドアが開いていた状態から閉まった場合
        else if (AutoLockState == true && doorIsOpenedOnce == true) {
          const Time = Date.now();
          while (Date.now() - Time < AutoLockStateDelayTime) {} // AutoLockStateDelayTime[ms]秒後も開いていなかったらbreak
          if (this.isOpened == false) break;
        }
        //console.log(this.time);
        //console.log(Date.now() - this.time);
      }
      // firebase側からLockedを指示されていない場合(即ちまだisLockedがfalseの場合)
      if (this.isLocked == this.isLockedBoolean) {
        // onValue_isLocked_Threadに書き込み処理のためisLockedをPost送信
        this.onValue_isLocked_Thread.postMessage({ isLocked: true });
      }
    }
    //* オートロックタイマーが0かそれ以外 の場合
    else {
      let doorIsOpenedOnce = false; // リードスイッチでドアが一回開いたかどうかを判定する変数
      while (true) {
        // firebase側からLockedが指示された場合
        if (this.isLocked != this.isLockedBoolean) {
          break;
        }
        // ドアが開いた場合
        if (this.isOpened == true) {
          doorIsOpenedOnce = true; // 一度はドアが開いたのでTrue
        }
        // リードスイッチによるオートロックがtrue && ドアが閉まっていて 一度は開いていた場合
        else if (AutoLockState == true && doorIsOpenedOnce == true) {
          const Time = Date.now();
          while (Date.now() - Time < AutoLockStateDelayTime) {} // AutoLockStateDelayTime[ms]秒後も開いていなかったらbreak
          if (this.isOpened == false) break;
        }
        //console.log(this.time);
        //console.log(Date.now() - this.time);
      }
      // firebase側からLockedを指示されていない場合(即ちまだisLockedがfalseの場合)
      if (this.isLocked == this.isLockedBoolean) {
        // onValue_isLocked_Threadに書き込み処理のためisLockedをPost送信
        this.onValue_isLocked_Thread.postMessage({ isLocked: true });
      }
    }
    return new Locked(
      this.raspPiSerialNumber,
      this.sharedArrayBuffer,
      this.onValue_isLocked_Thread
    );
  }

  //* 次のステートに移行する直前に実行されるメソッド
  exit_proc() {
    super.exit_proc();
    console.log("nextState: Locked\n");
  }

  //* タイマーリセットを行うメソッド
  reset() {
    super.reset();
  }
}
