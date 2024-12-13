const express = require("express");
const { donate, getBalance, withdraw } = require("../services/donationService");

const router = express.Router();

router.post("/donate", async (req, res) => {
  const { amount } = req.body;
  try {
    const tx = await donate(amount);
    await tx.wait(); // Espera la confirmación de la transacción
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al procesar la donación:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/balance", async (req, res) => {
  try {
    const balance = await getBalance();
    res.json({ balance });
  } catch (error) {
    console.error("Error al obtener el balance:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Nuevo endpoint: Retirar fondos
router.post("/withdraw", async (req, res) => {
  const { to, amount } = req.body;
  try {
    const tx = await withdraw(to, amount);
    await tx.wait(); // Espera la confirmación de la transacción
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al retirar fondos:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
