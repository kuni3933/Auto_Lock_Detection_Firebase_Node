import { db } from "../../lib/FirebaseInit.js";
import { ref } from "firebase/database";
export class State {
  // Property
  raspPiSerialNumber;
  isLockedBoolean;
  #sharedArrayBuffer;
  #sharedUint8Array;
  time;
  onValue_isLocked_Thread;

  // Constructor
  constructor(raspPiSerialNumber, sharedArrayBuffer, onValue_isLocked_Thread) {
    // set raspPiSerialNumber
    this.raspPiSerialNumber = raspPiSerialNumber;

    // se isLockedBoolean
    this.isLockedBoolean = undefined;

    // set #sharedArrayBuffer
    this.#sharedArrayBuffer = sharedArrayBuffer;

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

  set isLocked(isLocked) {
    if (isLocked == true || isLocked == false) {
      Atomics.store(this.#sharedUint8Array, 0, isLocked);
    }
  }

  get isOpened() {
    return Atomics.load(this.#sharedUint8Array, 1);
  }

  // method
  entry_proc() {
    console.log("--------------------------------------------------");
    console.log(`${this.constructor.name}: entry_proc()`);
  }
  wait_for_next_state() {
    console.log(`\n${this.constructor.name}: wait_for_next_state()`);
  }
  exit_proc() {
    console.log(`\n${this.constructor.name}: exit_proc()`);
    console.log("State is changed");
  }
  reset() {
    console.log(`\n${this.constructor.name}: reset()`);
    this.time = Date.now();
  }
}
