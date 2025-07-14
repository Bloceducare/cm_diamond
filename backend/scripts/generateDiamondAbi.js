const fs = require("fs");

async function main() {
  const basePath = "/contracts/facets/";
  let filePaths = fs.readdirSync("." + basePath);
  let abis = [];

  for (path of filePaths) {
    const jsonFile = path.replace("sol", "json");
    let json = fs.readFileSync(`./out/${path}/${jsonFile}`);
    json = JSON.parse(json);
    abis.push(...json.abi);
  }
  let finalAbi = JSON.stringify(abis);
  fs.writeFileSync("./contracts/ABI/diamond.json", finalAbi);

  console.log("ABI written to ../contracts/abis/diamond.json");
}

main().catch(console.log);
