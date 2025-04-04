const express = require("express");
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware");
const { Sequelize } = require('sequelize');
const { Hotel , Room } = require('../models');


const router = express.Router();

router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {


        /* #swagger.tags = ['Hotels']
            #swagger.summary = "Create a new hotel (Admin Only)"
        */

  try {    
    const { name, location, description } = req.body;
    
    const hotel = await Hotel.create({ name, location, description, adminId: req.user.id });

    res.status(201).json({ message: "Hotel created successfully", hotel });

  } catch (error) {
    res.status(500).json({ error: "Hotel creation failed", details: error.message });
  }
});

// 📌 Get All Hotels
router.get("/", async (req, res) => {

    /* #swagger.tags = ['Hotels']
        #swagger.summary = "Get all hotels"
    */

  try {
    const hotels = await Hotel.findAll({
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.col('rooms.id')), 'roomCount']
          ]
        },
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: [] // we don’t want full room data
          }
        ],
        group: ['Hotel.id']  
    });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve hotels", details: error.message });
  }
});

// 📌 Get a Single Hotel by ID
router.get("/:id", async (req, res) => {
    
        /* #swagger.tags = ['Hotels']
            #swagger.summary = "get hotel by id"
        */
       
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve hotel", details: error.message });
  }
});

// 📌 Update Hotel (Admin Only)
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  
        /* #swagger.tags = ['Hotels']
            #swagger.summary = "Update  hotel (Admin Only)"
        */
       
  try {
    const { name, location, description } = req.body;
    const hotel = await Hotel.findByPk(req.params.id);

    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    // Only allow the admin who created the hotel to update it
    if (hotel.adminId !== req.user.id) return res.status(403).json({ error: "Not authorized to update this hotel" });

    await hotel.update({ name, location, description });
    res.json({ message: "Hotel updated successfully", hotel });
  } catch (error) {
    res.status(500).json({ error: "Hotel update failed", details: error.message });
  }
});

// 📌 Delete Hotel (Admin Only)
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
    
        /* #swagger.tags = ['Hotels']
            #swagger.summary = "Delete a hotel (Admin Only)"
        */
       
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    if (hotel.adminId !== req.user.id) return res.status(403).json({ error: "Not authorized to delete this hotel" });

    await hotel.destroy();
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Hotel deletion failed", details: error.message });
  }
});

module.exports = router;
