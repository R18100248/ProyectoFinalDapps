require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// Comprobación de variables de entorno
console.log("SEPOLIA_RPC_URL:", process.env.SEPOLIA_RPC_URL);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);

// Cargar direcciones desde addresses.json
const addresses = JSON.parse(fs.readFileSync("./addresses.json"));

// Cargar ABIs desde los artefactos de Hardhat
const crearABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/NFTCrear.sol/NFTCrear.json")
).abi;

const comprarABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/NFTComprarJuguete.sol/NFTComprarJuguete.json")
).abi;

const donarABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/NFTDonar.sol/NFTDonar.json")
).abi;

const donationABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/DonationWallet.sol/DonationWallet.json")
).abi;

// Instanciar el proveedor con ethers v6
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Crear wallet con el provider
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Instanciar contratos
const nftCrearContract = new ethers.Contract(addresses.NFTCrear, crearABI, wallet);
console.log("Dirección del contrato de  (NFTCrear):", addresses.NFTCrear);

const nftComprarJugueteContract = new ethers.Contract(addresses.NFTComprar, comprarABI, wallet);
console.log("Dirección del contrato de  (NFTComprar):", addresses.NFTComprar);

const nftDonarContract = new ethers.Contract(addresses.NFTDonar, donarABI, wallet);
console.log("Dirección del contrato de  (NFTDonar):", addresses.NFTDonar);

const donationContract = new ethers.Contract(addresses.DonationWallet, donationABI, wallet);
console.log("Dirección del contrato de  (DonationWallet):", addresses.DonationWallet);

module.exports = {
  nftCrearContract,
  nftComprarJugueteContract,
  nftDonarContract,
  donationContract,
  provider,
  wallet,
};
