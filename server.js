import app from "./app.js";

const PORT = 5000;

app.get("/", (req, res) => {
  res.send(`Server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
