// NFTCrearRoutes.js
const express = require("express");
const { 
  mintNFT, 
  getTokenURI, 
  getUserCollection 
} = require("../services/NFTCrearService");

const router = express.Router();

router.post("/mint", async (req, res) => {
  const { recipient, tokenURI } = req.body;
  try {
    const tx = await mintNFT(recipient, tokenURI);
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al acuñar el NFT:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/token-uri/:tokenId", async (req, res) => {
  const { tokenId } = req.params;
  try {
    const tokenURI = await getTokenURI(tokenId);
    res.json({ tokenURI });
  } catch (error) {
    console.error("Error al obtener el URI del token:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/collection", async (req, res) => {
  const { userAddress } = req.query;

  if (!userAddress) {
    return res.status(400).json({ error: 'Se requiere una dirección de usuario (userAddress).' });
  }

  try {
    const nfts = await getUserCollection(userAddress);
    res.json({ success: true, nfts });
  } catch (error) {
    console.error('Error al obtener la colección del usuario:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;