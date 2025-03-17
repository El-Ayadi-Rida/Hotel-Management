const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Hotel Management API",
    description: "Automatically generated API documentation",
    version: "1.0.0",
  },
  host: "localhost:5000",
  schemes: ["http"],
  tags: [
    { name: "Authentication", description: "User authentication endpoints" },
    { name: "Hotels", description: "Hotel management endpoints" },
    { name: "Other", description: "Other Routes..." },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const outputFile = "./docs/swagger.json"; // Swagger JSON file (generated)
const routes = ["./routes/other.js" , "./routes/auth.js", "./routes/hotel.js"]; // Scans all route files

swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log("📄 Structured Swagger JSON generated successfully");
});
