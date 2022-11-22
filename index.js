import { Worker } from "worker_threads";
import { Door } from "./Class/Door.js";

const door = await Door.initDoor();
door.execute_state();

const onValueThread = new Worker("./ChildThread/onValue.js");
onValueThread.on("message", (msg) => {
  const { isLocked } = msg;
  console.log(`onValueThread: Received [${isLocked}]`);

  if (isLocked != door.state.isLocked) {
    door.change_state();
    door.execute_state();
  }
});

//*/
