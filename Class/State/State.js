import { ServoMotorClient } from "../ServoMotorClient.js";

export class State {
  // Property
  raspPiSerialNumber;
  isLockedBoolean;
  #sharedArrayBuffer;
  #sharedUint8Array;
  ServoMotorClient;
  time;
  onValue_isLocked_Thread;

  //* コンストラクタ
  constructor(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread) {
    // set raspPiSerialNumber
    this.raspPiSerialNumber = raspPiSerialNumber;

    // se isLockedBoolean
    this.isLockedBoolean = undefined;

    // set #sharedArrayBuffer
    this.#sharedArrayBuffer = sharedArrayBuffer;

    // set ServoMortorClient
    this.ServoMotorClient = new ServoMotorClient();

    // set #sharedUint8Array
    this.#sharedUint8Array = new Uint8Array(sharedArrayBuffer);

    // set Time
    this.time = Date.now();

    this.onValue_isLocked_Thread = onValue_isLocked_Thread;
  }

  // getter [sharedArrayBuffer]
  get sharedArrayBuffer() {
    return this.#sharedArrayBuffer;
  }

  // getter [isLocked]
  get isLocked() {
    return Atomics.load(this.#sharedUint8Array, 0);
  }

  get isOpened() {
    return Atomics.load(this.#sharedUint8Array, 1);
  }

  //* メソッド
  //* モーターを[Locked]状態にまで回す際のメソッド
  entry_proc() {
    console.log("--------------------------------------------------");
    console.log(`${this.constructor.name}: entry_proc()`);
  }
  //* 次のステートへ移行するためイベントを待つメソッド
  wait_for_next_state() {
    console.log(`\n${this.constructor.name}: wait_for_next_state()`);
  }
  //* 次のステートに移行する直前に実行されるメソッド
  exit_proc() {
    console.log(`\n${this.constructor.name}: exit_proc()`);
    console.log("State is changed");
  }
  //* タイマーリセットを行うメソッド
  reset() {
    console.log(`${this.constructor.name}: reset()`);
    this.time = Date.now();
  }
}
