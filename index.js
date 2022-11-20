import { Door } from "./Class/Door.js";

const door = await Door.initDoor();
door.initOnValue();

setInterval(() => {
  while (true) {
    door.update_state();
  }
}, 1000);

//*/
