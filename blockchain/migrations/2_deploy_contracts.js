const gremlin = artifacts.require("Gremlin");
const marketplace = artifacts.require("GremlinMarketplace");

module.exports = async function (deployer) {
  await deployer.deploy(gremlin);

  const deployedGremlin = await gremlin.deployed();

  const gremlinAddress = deployedGremlin.address;

  const deployedGremlinMarketplace = await deployer.deploy(marketplace, gremlinAddress);
};
