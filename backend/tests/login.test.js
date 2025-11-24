// tests/login.test.js
import request from "supertest";
import express from "express";

// Creamos una mini-app de ejemplo
const app = express();
app.use(express.json());

// Ruta de ejemplo
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    return res.status(200).json({ token: "fake-jwt-token" });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

describe("POST /login", () => {
  it("debería devolver un token si las credenciales son correctas", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "admin", password: "1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("debería devolver 401 si las credenciales son incorrectas", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "user", password: "wrong" });

    expect(res.statusCode).toBe(401);
    expect(res.body.token).toBeUndefined();
    expect(res.body.message).toBe("Unauthorized");
  });
});
