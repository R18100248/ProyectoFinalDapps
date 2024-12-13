// NFTDonarRoutes.js
const express = require("express");
const { 
  createDonation, 
  claimDonation, 
  getDonationDetails, 
  addBeneficiary, 
  updateBeneficiaryStatus, 
  getActiveDonationDetails
} = require("../services/NFTDonarService");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { tokenId, tokenURI } = req.body;
  try {
    const tx = await createDonation(tokenId, tokenURI);
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al crear la donación:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/claim", async (req, res) => {
  const { tokenId } = req.body;
  try {
    const tx = await claimDonation(tokenId);
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al reclamar la donación:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/details/:tokenId", async (req, res) => {
  const { tokenId } = req.params;
  try {
    const details = await getDonationDetails(tokenId);
    res.json({ details });
  } catch (error) {
    console.error("Error al obtener detalles de la donación:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-beneficiary", async (req, res) => {
  const { beneficiaryAddress } = req.body;
  try {
    const tx = await addBeneficiary(beneficiaryAddress);
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al agregar beneficiario:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/update-beneficiary-status", async (req, res) => {
  const { beneficiaryAddress, hasClaimed } = req.body;
  try {
    const tx = await updateBeneficiaryStatus(beneficiaryAddress, hasClaimed);
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al actualizar el estado del beneficiario:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/active-donations", async (req, res) => {
  try {
    const activeDonations = await getActiveDonationDetails();
    res.json({ activeDonations });
  } catch (error) {
    console.error("Error al obtener donaciones activas:", error.message);
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;