export async function authRoutes(app) {
  const loginSchema = {
    schema: {
      description: "Gera o token JWT de autenticação",
      tags: ["Auth"],
      security: [],
      body: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", examples: ["admin"] },
          password: { type: "string", examples: ["123456"] },
        },
      },
      response: {
        200: {
          type: "object",
          properties: { token: { type: "string" } },
        },
        401: {
          description: "Credenciais inválidas",
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
  };

  app.post("/login", loginSchema, async (request, reply) => {
    const { username, password } = request.body;

    if (username === "admin" && password === "123456") {
      const token = app.jwt.sign(
        { username, role: "admin" },
        { expiresIn: "7d" },
      );

      return reply.send({ token });
    }
    return reply.status(401).send({ error: "Credenciais inválidas" });
  });
}
