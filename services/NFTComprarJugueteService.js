// NFTComparJugueteService.js
const { ethers } = require("ethers");
const { nftComprarJugueteContract, wallet,nftCrearContract } = require("../config");

/**
 * Comprar un juguete NFT.
 * @param {string} imageUrl - URL de la imagen asociada al NFT.
 * @param {string} amount - Monto en ETH para la compra.
 */
async function buyNFT(imageUrl, amount) {
  try {
    if (!amount) {
      throw new Error("El monto (amount) es requerido y no puede estar vacío.");
    }
    if (isNaN(amount)) {
      throw new Error("El monto (amount) debe ser un número válido.");
    }
        

  let  amountInWei = ethers.parseEther(amount.toString());

  tx = await nftComprarJugueteContract.buyNFT(imageUrl, {
   value: amountInWei, // Usar el monto del usuario
   gasLimit: 300000, // Subimos el gasLimit
 });

 await tx.wait(); // Esperar confirmación de la transacción
 return tx;
} catch (error) {
 console.error("Error al intentar ganar un NFT:", error.message);
 throw new Error("El intento falló.");
}

}

/**
 * Configurar el precio por NFT.
 * @param {string} newPrice - Nuevo precio en ETH.
 */
async function setPricePerNFT(newPrice) {
  try {
    const newPriceInWei = ethers.parseUnits(newPrice.toString(), "ether");
    const tx = await nftComprarJugueteContract.setPricePerNFT(newPriceInWei, { gasLimit: 300000 });
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error al configurar el precio del NFT:", error.message);
    throw new Error("No se pudo configurar el precio del NFT.");
  }
}

/**
 * Obtener el saldo actual del contrato.
 * @returns {Promise<string>} Saldo actual en el contrato.
 */
async function getBalance() {
  try {
    // Convertir ETH a Wei
    console.log("Dirección de NFTCrear en el backend:", nftCrearContract.target);
  //  const owner = await nftCrearContract.owner();
   // console.log("Propietario del contrato NFTCrear:", owner);
   // console.log("Dirección del contrato NFTComprar:", nftComprarJugueteContract.target);
    
// const ss = await nftCrearContract.transferOwnership(nftComprarJugueteContract.target);// nftComprarJugueteContract adress
//  await ss.wait();



    const balance = await nftComprarJugueteContract.getBalance();
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error al obtener el saldo del contrato:", error.message);
    throw new Error("No se pudo obtener el saldo del contrato.");
  }
}

/**
 * Retirar los fondos acumulados en el contrato.
 */
async function withdrawFunds() {
  try {
    const tx = await nftComprarJugueteContract.withdrawFunds({ gasLimit: 300000 });
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error al retirar los fondos del contrato:", error.message);
    throw new Error("No se pudieron retirar los fondos.");
  }
}

module.exports = {
  buyNFT,
  setPricePerNFT,
  getBalance,
  withdrawFunds,
};