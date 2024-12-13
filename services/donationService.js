const { ethers } = require("ethers");
const { donationContract, wallet } = require("../config");

/**
 * Realiza una donación al contrato de donaciones.
 * @param {string} amount - Monto en ETH para donar.
 */
async function donate(amount) {
  try {
    if (!amount || isNaN(amount)) {
      throw new Error("Monto inválido");
    }

    const toAddress = await donationContract.getAddress(); // Obtener dirección del contrato
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount), // Convertir el monto de ETH a Wei
    });

    return tx; // Retorna la transacción
  } catch (error) {
    console.error("Error al donar:", error.message);
    throw new Error("La transacción de donación falló.");
  }
}

/**
 * Obtiene el balance actual del contrato de donaciones.
 */
async function getBalance() {
  try {
    const balanceBN = await donationContract.getBalance(); // Obtener balance
    const balance = ethers.formatEther(balanceBN); // Convertir de Wei a ETH
    return balance;
  } catch (error) {
    console.error("Error al obtener balance:", error.message);
    throw new Error("No se pudo obtener el balance.");
  }
}

/**
 * Retira fondos del contrato de donaciones.
 * @param {string} to - Dirección a la que se enviarán los fondos.
 * @param {string} amount - Monto en ETH a retirar.
 */
async function withdraw(to, amount) {
  try {
    if (!ethers.isAddress(to)) {
      throw new Error("La dirección de destino no es válida");
    }

    if (!amount || isNaN(amount)) {
      throw new Error("Monto inválido");
    }

    const amountInWei = ethers.parseEther(amount); // Convertir de ETH a Wei
    const tx = await donationContract.withdraw(to, amountInWei, {
      gasLimit: 100000, // Ajustar si es necesario
    });

    await tx.wait(); // Esperar confirmación de la transacción
    return tx;
  } catch (error) {
    console.error("Error al retirar fondos:", error.message);
    throw new Error("La transacción de retiro falló.");
  }
}

module.exports = {
  donate,
  getBalance,
  withdraw, // Exportar el nuevo método
};
