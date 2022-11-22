import { Worker } from "worker_threads";
import { Door } from "./Class/Door.js";

const door = await Door.initDoor();

const onValueWorker = new Worker("./onValue.js");

onValueWorker.on("message", (msg) => {
  console.log(msg);
  const { isLocked } = msg;
  if (isLocked != door.state.isLocked && door.state.moveNextState != true) {
    door.state.moveNextState = true;
  }
});

setTimeout(() => {
  while (true) {
    door.update_state();
  }
}, 1000);

//*/
