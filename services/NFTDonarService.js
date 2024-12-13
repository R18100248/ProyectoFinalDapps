// NFTDonarService.js
const { ethers } = require("ethers");
const { nftDonarContract, wallet,nftCrearContract } = require("../config");

/**
 * Crear una nueva donación de NFT.
 * @param {string} tokenId - ID del NFT que se donará.
 * @param {string} tokenURI - URL de la imagen asociada al NFT.
 */ 

async function createDonation(tokenId, imageUrl) {
  try {
    if (!tokenId || isNaN(tokenId)) {
      throw new Error("Token ID inválido");
    }
    if (!imageUrl || typeof imageUrl !== "string") {
      throw new Error("URL de la imagen inválida");
    }

    const owner = await nftCrearContract.ownerOf(tokenId);
    console.log(`El propietario del token ${tokenId} es: ${owner}`);

    const approvedAddress = await nftCrearContract.getApproved(tokenId);
    console.log(`Aprobado: ${approvedAddress}`);

    if (!approvedAddress || approvedAddress.toLowerCase() !== nftDonarContract.target.toLowerCase()) {
      console.log(`Aprobando el token ${tokenId} para el contrato de donacion de juguetes...`);
      const approvalTx = await nftCrearContract.approve(nftDonarContract.target, tokenId);
      await approvalTx.wait();
      console.log(`Token ${tokenId} aprobado exitosamente.`);
    }

    console.log(`Creando la donacion para el token ${tokenId} con URL de imagen ${imageUrl}...`);
    const tx = await nftDonarContract.createDonation(tokenId, imageUrl, {
      gasLimit: 300000, // Ajustar si es necesario
    });

    await tx.wait(); // Esperar confirmación de la transacción
    console.log("Donacion de juguetes creada exitosamente:", tx.hash);
    return tx;
  } catch (error) {
    console.error("Error al crear donacion de juguetes:", error.message);
    throw new Error("No se pudo crear la donacion de juguetes.");
  }
}




/**
 * Reclamar una donación de NFT.
 * @param {string} tokenId - ID del NFT a reclamar.
 */
async function claimDonation(tokenId) {
  try {
    const tx = await nftDonarContract.claimDonation(tokenId, { gasLimit: 300000 });
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error al reclamar la donación:", error.message);
    throw new Error("No se pudo reclamar la donación.");
  }
}

/**
 * Obtener detalles de una donación.
 * @param {string} tokenId - ID de la donación.
 */
async function getDonationDetails(tokenId) {
  try {
    const donationDetails = await nftDonarContract.getDonationDetails(tokenId);
    return donationDetails;
  } catch (error) {
    console.error("Error al obtener los detalles de la donación:", error.message);
    throw new Error("No se pudieron obtener los detalles de la donación.");
  }
}

/**
 * Agregar un nuevo beneficiario.
 * @param {string} beneficiaryAddress - Dirección del beneficiario.
 */
async function addBeneficiary(beneficiaryAddress) {
  try {
    const tx = await nftDonarContract.addBeneficiary(beneficiaryAddress, { gasLimit: 300000 });
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error al agregar beneficiario:", error.message);
    throw new Error("No se pudo agregar al beneficiario.");
  }
}

/**
 * Actualizar el estado de "reclamado" de un beneficiario.
 * @param {string} beneficiaryAddress - Dirección del beneficiario.
 * @param {boolean} hasClaimed - Estado de reclamado.
 */
async function updateBeneficiaryStatus(beneficiaryAddress, hasClaimed) {
  try {
    const tx = await nftDonarContract.updateBeneficiaryStatus(beneficiaryAddress, hasClaimed, { gasLimit: 300000 });
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error al actualizar el estado del beneficiario:", error.message);
    throw new Error("No se pudo actualizar el estado del beneficiario.");
  }
}

/**
 * Obtener detalles de todas las donaciones activas.
 * @returns {Promise<Array>} Lista de detalles de las donaciones activas.
 */
async function getActiveDonationDetails() {
  try {
    const activeDonations = await nftDonarContract.getActiveDonationDetails();
    return activeDonations.map((donation) => ({
      donor: donation.donor,
      tokenId: donation.tokenId.toString(),
      claimed: donation.claimed,
      tokenURI: donation.tokenURI,
    }));
  } catch (error) {
    console.error("Error al obtener los detalles de las donaciones activas:", error.message);
    throw new Error("No se pudieron obtener los detalles de las donaciones activas.");
  }
}




module.exports = {
  createDonation,
  claimDonation,
  getDonationDetails,
  addBeneficiary,
  updateBeneficiaryStatus,
  getActiveDonationDetails, 
};
