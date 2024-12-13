// const express = require("express");
// const cors = require("cors");
// const userRoutes = require("./routes/userRoutes.js");
// const salesRoutes = require("./routes/salesRoutes.js");
// const walletRoutes = require("./routes/walletRoutes.js");
// const nftRoutes = require("./routes/nftRoutes.js");

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Rutas
// app.use("/api/users", userRoutes);
// app.use("/api/sales", salesRoutes);
// app.use("/api/wallet", walletRoutes);
// app.use("/api/nfts", nftRoutes);

// // Iniciar servidor
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

//verrsion olf

// const express = require("express");
// const cors = require("cors");
// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(cors());

// // Image data
// const images = require("./data/images.json");

// // Helper to select balanced random images
// function getRandomImages() {
//     const rarities = {
//         common: 0.5,
//         uncommon: 0.3,
//         rare: 0.15,
//         epic: 0.04,
//         legendary: 0.01,
//     };

//     const result = [];
//     const rarityCounts = {
//         common: 0,
//         uncommon: 0,
//         rare: 0,
//         epic: 0,
//         legendary: 0,
//     };

//     // Define how many of each rarity to include in the pack
//     const packDistribution = [
//         "common",
//         "common",
//         "uncommon",
//         "rare",
//         "epic", // Adjust this distribution as needed
//     ];

//     // Shuffle the distribution array
//     const shuffledDistribution = packDistribution.sort(() => Math.random() - 0.5);

//     shuffledDistribution.forEach((rarity) => {
//         const options = images.filter((img) => img.rarity === rarity);
//         const randomImage = options[Math.floor(Math.random() * options.length)];
//         result.push(randomImage);
//         rarityCounts[rarity]++;
//     });

//     return result;
// }

// // API route
// app.get("/api/pack", (req, res) => {
//     const pack = getRandomImages();
//     res.json(pack);
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });



const express = require("express");
const cors = require("cors");
const donationRoutes = require("./routes/donationRoutes.js");
const crearRoutes = require("./routes/NFTCrearRoutes.js");
const comprareRoutes = require("./routes/NFTComprarJugueteRoutes.js");
const donarRoutes = require("./routes/NFTDonarRoutes.js");
const path = require("path");

const app = express();

app.use(cors());

// Middleware para procesar JSON solo en métodos específicos
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Middleware de depuración
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Registrar rutas
app.use("/donations", donationRoutes);
app.use("/crear", crearRoutes);
app.use("/comprar", comprareRoutes);
app.use("/donar", donarRoutes);


app.use(express.static(path.join(__dirname, 'frontend', 'src')));

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'src', 'index.html'));
});

// Rutas para otros HTMLs
app.get('/donations', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'src', 'donations.html'));
});

app.get('/nft', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'src', 'NFT.html'));
});





// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
