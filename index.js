import { Door } from "./Class/Door.js";

const door = await Door.initDoor();
await door.initOnValue();

setTimeout(() => {
  while (true) {
    door.update_state();
  }
}, 1000);

//*/
