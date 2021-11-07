const { ethers } = require("ethers");
const gremlinAbi = require("../abis/Gremlin.json");
const ipfsHttpClient = require("ipfs-http-client");
const ipfs = ipfsHttpClient.create({ host: "localhost", port: "5001", protocol: "http" });

const networkId = "5777";
const toAddress = "0x570A6F85c22ad6aAC932060c6b30aa3167171E0E";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
  const signer = provider.getSigner();
  const gremlinContract = new ethers.Contract(gremlinAbi.networks[networkId].address, gremlinAbi.abi, signer);

  const buffalo = {
    description: "It's actually a bison?",
    external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
    image: "https://austingriffith.com/images/paintings/buffalo.jpg",
    name: "Buffalo",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "green",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 42,
      },
    ],
  };
  console.log("Uploading buffalo...");
  const uploaded = await ipfs.add(JSON.stringify(buffalo));

  console.log("Minting buffalo with IPFS hash (" + uploaded.path + ")");

  const id = await gremlinContract.mintItem(toAddress, uploaded.path);

  console.log(id);

  console.log("Minting successful with id: " + id);
}

main();
