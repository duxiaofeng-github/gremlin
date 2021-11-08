#!/usr/bin/env node

const { ethers } = require("ethers");
const gremlinAbi = require("../abis/Gremlin.json");
const ipfsHttpClient = require("ipfs-http-client");
const ipfs = ipfsHttpClient.create({ host: "localhost", port: "5001", protocol: "http" });
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

async function main(networkId, walletAddress, jsonRpcAddress) {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcAddress);
  const signer = provider.getSigner();
  const gremlinContract = new ethers.Contract(gremlinAbi.networks[networkId].address, gremlinAbi.abi, signer);

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

  const { hash } = await gremlinContract.mintItem(walletAddress, uploadedMetaData.path);

  console.log("Minting successful with hash: " + hash);
}

program
  .option("--network-id [id]", "The network id you want to access")
  .option("--wallet-address [address]", "The wallet address where your gremlins will send to")
  .option("--json-rpc-address [address]", "The rpc address of your ethereum node")
  .parse();

const { networkId, walletAddress, jsonRpcAddress } = program.opts();

if (!networkId) {
  console.log("networkId is required");
} else if (!walletAddress) {
  console.log("walletAddress is required");
} else if (!jsonRpcAddress) {
  console.log("jsonRpcAddress is required");
} else {
  main(networkId, walletAddress, jsonRpcAddress);
}
