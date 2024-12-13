// NFTComparJugueteRoutes.js
const express = require("express");
const { 
  getBalance, 
  setPricePerNFT, 
  buyNFT, 
  withdrawFunds 
} = require("../services/NFTComprarJugueteService");

const router = express.Router();

// Obtener el saldo actual del contrato
router.get("/balance", async (req, res) => {
  try {
    const balance = await getBalance();
    res.json({ balance });
  } catch (error) {
    console.error("Error al obtener el saldo del contrato:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Configurar el precio por NFT
router.post("/set-price", async (req, res) => {
  const { newPrice } = req.body;
  try {
    const tx = await setPricePerNFT(newPrice);
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al configurar el precio del NFT:", error.message);
    res.status(500).json({ error: error.message });
  }
});



router.post("/buy", async (req, res) => {
  const { imageUrl, amount } = req.body;
  try {
    const tx = await buyNFT(imageUrl, amount);
    await tx.wait(); // Espera la confirmación de la transacción
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al intentar ganar NFT:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Retirar fondos acumulados en el contrato
router.post("/withdraw", async (req, res) => {
  try {
    const tx = await withdrawFunds();
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al retirar los fondos del contrato:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
