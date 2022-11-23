import { Worker } from "worker_threads";
import { Door } from "./Class/Door.js";

const door = await Door.initDoor();
door.execute_state();

const onValue_isLocked_Thread = new Worker("./ChildThread/onValue_isLocked.js");
onValue_isLocked_Thread.on("message", (msg) => {
  const { isLocked } = msg;

  if (isLocked != undefined) {
    console.log(`onValueThread: Received { isLocked: ${isLocked} }`);
    if (isLocked != door.state.isLocked) {
      door.change_state();
      door.execute_state();
    }
  }
});

const onValue_angle_Thread = new Worker("./ChildThread/onValue_angle.js");
onValue_angle_Thread.on("message", (msg) => {
  const { angle } = msg;

  if (angle != undefined) {
    console.log(`onValueThread: Received { angle: ${JSON.stringify(angle)} }`);
  }
});

//*/
