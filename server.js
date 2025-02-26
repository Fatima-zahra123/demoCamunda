import express from "express";
import cors from "cors";
import fs from "fs/promises"; // Utiliser la version asynchrone de fs

const app = express();
const PORT = 5000;
const BPMN_FILE_PATH = "./public/example.bpmn";

app.use(cors());
app.use(express.json());

// Route pour charger le fichier BPMN
app.get("/bpmn", async (req, res) => {
    try {
        const data = await fs.readFile(BPMN_FILE_PATH, "utf8");
        res.send(data);
    } catch (err) {
        res.status(500).send("Erreur de lecture du fichier BPMN");
    }
});

// Route pour enregistrer les modifications
app.post("/save-bpmn", async (req, res) => {
    const { xml } = req.body;
    try {
        await fs.writeFile(BPMN_FILE_PATH, xml, "utf8");
        res.send("Fichier BPMN enregistré avec succès !");
    } catch (err) {
        res.status(500).send("Erreur lors de l'enregistrement du fichier BPMN");
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
