import figlet from "figlet";
export function aa_log(string) {
  figlet(string, (err, data) => {
    if (err) {
      console.error(err);
    }
    console.log(data);
  });
}
