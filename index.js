import * as fs from "fs";
import { Worker } from "worker_threads";
import { Door } from "./Class/Door.js";

//* Check & Create Config/*.json
if (!fs.existsSync("./Config/Angle.json")) {
  fs.writeFileSync("./Config/Angle.json", '{"Lock": 0,"Unlock": 0}');
}
if (!fs.existsSync("./Config/Token.json")) {
  fs.writeFileSync("./Config/Token.json", '{"Token": ""}');
}

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

  if (angle.Lock != undefined && angle.Unlock != undefined) {
    console.log(
      `onValue_angle_Thread: Received { angle: ${JSON.stringify(angle)}, }`
    );
  }
});

//*/
