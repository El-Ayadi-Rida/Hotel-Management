const express = require("express");
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware");
const { Room, Hotel } = require('../models');


const router = express.Router();

// 📌 Create a New Room (Admin Only)
router.post("/:hotelId", authenticateToken, authorizeRole("admin"), async (req, res) => {
  
        /* #swagger.tags = ['Rooms']
            #swagger.summary = "Create a new room (Admin Only)"
        */

  try {
    const { hotelId } = req.params;
    const { roomNumber, type, price } = req.body;
    
    // ✅ Check if Hotel Exists
    const hotelExists = await Hotel.findByPk(hotelId);
    if (!hotelExists) {
      return res.status(400).json({ error: "Invalid hotelId", details: "The specified hotel does not exist." });
    }

    const room = await Room.create({ hotelId, roomNumber, type, price });
    
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(500).json({ error: "Room creation failed", details: error.message });
  }
});

// 📌 Get All Rooms
router.get("/", async (req, res) => {
  
        /* #swagger.tags = ['Rooms']
            #swagger.summary = "Get all rooms"
        */

  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve rooms", details: error.message });
  }
});

// 📌 ✅ Get Rooms by Hotel ID
router.get("/hotel/:hotelId", async (req, res) => {

  /* #swagger.tags = ['Rooms']
      #swagger.summary = "Get all rooms for a specific hotel"
  */

  try {
    const { hotelId } = req.params;

    // ✅ Check if the hotel exists before querying
    const hotelExists = await Hotel.findByPk(hotelId);
    if (!hotelExists) {
      return res.status(400).json({ error: "Invalid hotelId", details: "The specified hotel does not exist." });
    }

    const rooms = await Room.findAll({ where: { hotelId } });

    res.json({ hotelId, rooms });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve rooms", details: error.message });
  }
});


// 📌 Get a Room by ID
router.get("/:id", async (req, res) => {

  /* #swagger.tags = ['Rooms']
      #swagger.summary = "Get room by Id"
  */

  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve room", details: error.message });
  }
});

// 📌 Update Room (Admin Only)
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {

  /* #swagger.tags = ['Rooms']
      #swagger.summary = "Update room (Admin Only)"
  */

  try {
    const { roomNumber, type, price, status } = req.body;
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    await room.update({ roomNumber, type, price, status });
    res.json({ message: "Room updated successfully", room });
  } catch (error) {
    res.status(500).json({ error: "Room update failed", details: error.message });
  }
});

// 📌 Delete Room (Admin Only)
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {

      /* #swagger.tags = ['Rooms']
          #swagger.summary = "Delete room (Admin Only)"
      */

  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    await room.destroy();
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Room deletion failed", details: error.message });
  }
});

module.exports = router;
