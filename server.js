require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json"); // Load generated Swagger file
const createAdminIfNotExists = require("./utils/adminSetup");


const session = require("express-session");

const authRoutes = require("./routes/auth");
const hotelRoutes = require("./routes/hotel");
const otherRoutes = require("./routes/other");
const roomRoutes = require("./routes/room");
const bookingRoutes = require("./routes/booking");
const customerRoutes = require('./routes/customer');
const analyticsRoutes = require('./routes/analytics');




const { authenticateToken, authorizeRole } = require("./middlewares/authMiddleware");

const app = express();

// ✅ Enable CORS Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "*", // Allow frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  }));
  
app.use(express.json());


// 📌 Ensure an admin exists before starting the server
createAdminIfNotExists();



// 📌 Load Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Auth Routes
app.use("/auth", authRoutes);

// Hotel Routes
app.use("/hotels", hotelRoutes);

// Hotel Routes
app.use("/other", otherRoutes);

// Room Routes
app.use("/rooms", roomRoutes);

// Booking Routes
app.use("/bookings", bookingRoutes);

// customers Routes
app.use('/customers', customerRoutes);

// analytics Routes
app.use('/analytics', analyticsRoutes);




app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
