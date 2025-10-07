import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const archivo = "respuestas.json";

// Registrar respuesta
app.post("/guardar", (req, res) => {
  const nuevaRespuesta = req.body;

  fs.readFile(archivo, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error leyendo archivo");

    const respuestas = data ? JSON.parse(data) : [];
    respuestas.push(nuevaRespuesta);

    fs.writeFile(archivo, JSON.stringify(respuestas, null, 2), (err) => {
      if (err) return res.status(500).send("Error escribiendo archivo");
      res.send({ mensaje: "✅ Respuesta registrada" });
    });
  });
});

// Mostrar resultados (solo para tu novia)
app.get("/resultados", (req, res) => {
  const { user, pass } = req.query;
  if (user !== "atziri" || pass !== "1234") {
    return res.status(401).send("Acceso denegado");
  }

  fs.readFile(archivo, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error leyendo archivo");
    const respuestas = data ? JSON.parse(data) : [];
    res.send(respuestas);
  });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
