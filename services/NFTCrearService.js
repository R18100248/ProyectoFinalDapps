const { ethers } = require("ethers");
const { nftCrearContract, wallet } = require("../config");

/**
 * Acuñar un NFT.
 * @param {string} recipient - Dirección del destinatario.
 * @param {string} tokenURI - URI del token.
 */
async function mintNFT(recipient, tokenURI) {
  try {
    const tx = await nftCrearContract.mintNFT(recipient, tokenURI, { gasLimit: 300000 });
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error al acuñar NFT:", error.message);
    throw new Error("No se pudo acuñar el NFT");
  }
}


/**
 * Obtener la URI de un token específico.
 * @param {string} tokenId - ID del token.
 */
async function getTokenURI(tokenId) {
  try {
    if (!tokenId || isNaN(tokenId)) {
      throw new Error("Token ID inválido");
    }

    const tokenURI = await nftCrearContract.tokenURI(tokenId);
    return tokenURI;
  } catch (error) {
    console.error("Error al obtener el Token URI:", error.message);
    throw new Error("No se pudo obtener el Token URI.");
  }
}

async function getUserCollection(owner) {
  try {
    // Llamar a la función tokensOfOwner del contrato
    const tokenIds = await nftCrearContract.tokensOfOwner(owner);

    // Obtener el URI de cada token
    const nfts = [];
    for (const tokenId of tokenIds) {
      const tokenURI = await nftCrearContract.tokenURI(tokenId);
      nfts.push({
        tokenId: tokenId.toString(), // Convertir BigNumber a string
        tokenURI,
      });
    }

    return nfts;
  } catch (error) {
    console.error('Error al obtener la colección:', error.message);
    throw new Error('No se pudo obtener la colección del usuario.');
  }
}


module.exports = {
  mintNFT,
  getTokenURI, 
  getUserCollection,
};
