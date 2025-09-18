const express = require("express");
const app = express();
const path = require("path");
const db = require("./models/db"); 

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});


app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produtos");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
});


app.post("/api/products", async (req, res) => {
  const { nome, preco, quantidade } = req.body;
  if (!nome || !preco || !quantidade) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)",
      [nome, preco, quantidade]
    );
    res.status(201).json({ id: result.insertId, nome, preco, quantidade });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar produto" });
  }
});


app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco, quantidade } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE produtos SET nome = ?, preco = ?, quantidade = ? WHERE id = ?",
      [nome, preco, quantidade, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ id, nome, preco, quantidade });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});


app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM produtos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto removido" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir produto" });
  }
});

app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080");
});
