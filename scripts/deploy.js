const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // 1️⃣ **Desplegar NFTFactory**
  const NFTCrear = await ethers.getContractFactory("NFTCrear");
  const nftCrear = await NFTCrear.deploy();
  await nftCrear.waitForDeployment();
  console.log("NFTCrear deployed to:", await nftCrear.getAddress());

  // 2️⃣ **Desplegar NFTChance con la dirección de NFTFactory**
  const NFTComprar = await ethers.getContractFactory("NFTComprarJuguete");
  const nftComprar = await NFTComprar.deploy(await nftCrear.getAddress());
  await nftComprar.waitForDeployment();
  console.log("NFTComprar deployed to:", await nftComprar.getAddress());

  // 3️⃣ **Desplegar NFTAuction con la dirección de NFTFactory**
  const NFTDonar = await ethers.getContractFactory("NFTDonar");
  const nftDonar = await NFTDonar.deploy(await nftCrear.getAddress());
  await nftDonar.waitForDeployment();
  console.log("NFTDonar deployed to:", await nftDonar.getAddress());

  // // 4️⃣ **Desplegar DonationWallet**   "DonationWallet": "gggggggg",
  const DonationWallet = await ethers.getContractFactory("DonationWallet");
  const donationWallet = await DonationWallet.deploy();
  await donationWallet.waitForDeployment();
  console.log("DonationWallet deployed to:", await donationWallet.getAddress());

  // Guardar direcciones de los contratos en un archivo JSON
  const addresses = {
    NFTCrear: await nftCrear.getAddress(),
    NFTComprar: await nftComprar.getAddress(),
    NFTDonar: await nftDonar.getAddress(),
    DonationWallet: await donationWallet.getAddress(),
  };

  fs.writeFileSync("addresses.json", JSON.stringify(addresses, null, 2));
  console.log("Deployment completed and addresses saved in addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
