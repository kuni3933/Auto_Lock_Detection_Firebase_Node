import { Worker } from "worker_threads";
import { Door } from "./Class/Door.js";

const door = await Door.initDoor();
door.execute_state();

const onValueThread = new Worker("./ChildThread/onValue.js");
onValueThread.on("message", (msg) => {
  const { isLocked, Angle } = msg;

  if (isLocked != undefined) {
    console.log(`onValueThread: Received { isLocked: ${isLocked} }`);
    if (isLocked != door.state.isLocked) {
      door.change_state();
      door.execute_state();
    }
  }

  if (Angle != undefined) {
    console.log(`onValueThread: Received { Angle: ${JSON.stringify(Angle)} }`);
  }
});

//*/
