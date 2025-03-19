const swaggerAutogen = require("swagger-autogen")();


const doc = {
  info: {
    title: "Hotel Management API",
    description: "The Hotel Management System is a web-based platform designed to streamline hotel operations, including room management, user authentication, and booking services. Built using Node.js (Express.js) for the backend, MySQL for data storage, and React.js for the frontend ->👥 Team Members: Douae BEN SAGA - Imane CHIBANI ->🧑‍💼 Supervisor: Ibtissam TOUAHRI",
    version: "1.0.0",
  },
  host: "localhost:5000",
  schemes: ["http"],
  tags: [
    { name: "Authentication", description: "User authentication endpoints" },
    { name: "Hotels", description: "Hotel management endpoints" },
    { name: "Rooms", description: "Rooms management endpoints" },
    { name: "Bookings", description: "Bookings management endpoints" },
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
const routes = ["./routes/auth.js", "./routes/hotel.js", "./routes/room.js" , "./routes/booking.js" , "./routes/other.js"]; // Scans all route files

swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log("📄 Structured Swagger JSON generated successfully");
});
