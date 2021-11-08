#!/usr/bin/env node

const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const gremlinAbi = require("../abis/Gremlin.json");
const ipfsHttpClient = require("ipfs-http-client");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const { random } = require("lodash");
const Chance = require("chance");
const ColorScheme = require("color-scheme");
const { Command } = require("commander");
const program = new Command();

function getSvgData() {
  const styleArray = ["soft", "hard", "pastel"];
  const scheme = new ColorScheme();

  scheme
    .from_hue(random(0, 360))
    .scheme("mono")
    .variation(styleArray[random(0, styleArray.length - 1)]);

  const colors = scheme.colors();

  return {
    eye: random(1, 23),
    horn: random(1, 5),
    mouse: random(1, 13),
    nose: random(1, 4),
    ear: random(1, 4),
    body: random(1, 3),
    bodyColor: !!random(0, 1) ? 1 : undefined,
    hat: random(1, 2),
    colorPrimary: colors[0],
    colorDarker: colors[1],
    colorBodyColor: colors[2],
    colorLips: colors[2],
  };
}

function getAttributes() {
  return {
    hp: random(1, 100),
    mp: random(1, 100),
    intelligence: random(1, 100),
    dexterity: random(1, 100),
    strength: random(1, 100),
  };
}

function ifCond(v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
}

function generateDescription({ mp, hp }) {
  return `MP: ${mp}, HP: ${hp}`;
}

function getWeb3(jsonRpcAddress, privateKey) {
  const provider = new HDWalletProvider([privateKey], jsonRpcAddress);
  const web3 = new Web3(provider);
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  return { web3, account };
}

async function main(networkId, walletPrivateKey, jsonRpcAddress, ipfsGatewayAddress) {
  const ipfs = ipfsHttpClient.create({ url: ipfsGatewayAddress });
  const { web3, account } = getWeb3(jsonRpcAddress, walletPrivateKey);
  const gremlinContract = new web3.eth.Contract(gremlinAbi.abi, gremlinAbi.networks[networkId].address);

  const data = getSvgData();
  const svgFile = fs.readFileSync(path.resolve(__dirname, "../../public/gremlin.svg"), { encoding: "UTF-8" });

  Handlebars.registerHelper({ ifCond });
  const svgTemplate = Handlebars.compile(svgFile);
  const svgString = svgTemplate(data);
  const attributes = getAttributes();

  const uploadedSvg = await ipfs.add(
    {
      path: "gremlin.svg",
      content: svgString,
    },
    { wrapWithDirectory: true },
  );

  const metaData = {
    name: new Chance().name(),
    description: generateDescription(attributes),
    image: uploadedSvg.cid.toString(),
    attributes: Object.keys(attributes).map((key) => {
      const value = attributes[key];

      return {
        display_type: "boost_percentage",
        trait_type: key,
        value,
      };
    }),
  };

  const uploadedMetaData = await ipfs.add(JSON.stringify(metaData));

  const { transactionHash } = await new Promise((resolve, reject) => {
    gremlinContract.methods
      .mintItem(account.address, uploadedMetaData.path)
      .send({ from: account.address, gas: 4712388 })
      .on("receipt", (data) => {
        resolve(data);
      });
  });

  console.log("Minting successful with hash: " + transactionHash);

  process.exit();
}

program
  .option("--network-id [id]", "The network id you want to access")
  .option("--wallet-private-key [key]", "The wallet private key where your gremlins will send to")
  .option("--json-rpc-address [address]", "The rpc address of your ethereum node")
  .option("--ipfs-gateway-address [address]", "The gateway address of ipfs")
  .parse();

const { networkId, walletPrivateKey, jsonRpcAddress, ipfsGatewayAddress } = program.opts();

if (!networkId) {
  console.log("networkId is required");
} else if (!walletPrivateKey) {
  console.log("walletPrivateKey is required");
} else if (!jsonRpcAddress) {
  console.log("jsonRpcAddress is required");
} else if (!ipfsGatewayAddress) {
  console.log("ipfsGatewayAddress is required");
} else {
  main(networkId, walletPrivateKey, jsonRpcAddress, ipfsGatewayAddress);
}
