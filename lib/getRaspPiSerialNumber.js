import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";

async function getSerialNumber() {
  // こっちのFunctionはFirebaseのreferenceパス指定の際に使用するとエラーが出るので使用停止
  await readFile("/proc/cpuinfo", "utf8")
    .then((content) => {
      const cont_array = content.split("\n");
      let serial_line = "";
      for (let i = 0; i < cont_array.length; i++) {
        serial_line = cont_array[i];
        if (serial_line.startsWith("Serial")) {
          break;
        }
      }
      console.log(serial_line.split(":")[1].slice(1));
      return serial_line.split(":")[1].slice(1);
    })
    .catch((err) => {
      console.error(err);
      return "SerialNumber_3";
    });
}

function getSerialNumberSync() {
  try {
    const cont_array = readFileSync("/proc/cpuinfo", "utf8").split("\n");
    let x = 0;
    let serial_line = "";
    while (x < cont_array.length) {
      serial_line = cont_array[x];
      if (serial_line.startsWith("Serial")) {
        break;
      }
      x++;
    }
    return serial_line.split(":")[1].slice(1);
  } catch (err) {
    console.log(err);
    return "SerialNumber_3";
  }
}

export { getSerialNumberSync };
