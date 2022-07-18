import { getSerialNumber } from "raspi-serial-number";

// RaspberryPi Serial Number
let raspPiNum = "SerialNumber_3";

getSerialNumber((err, data) => {
  if (err) {
    console.dir(err);
  } else if (data) {
    raspPiNum = data;
    console.log(`     data: ${data}`);
  }
  console.log(`raspPiNum: ${raspPiNum}\n`);
});

export { raspPiNum };
