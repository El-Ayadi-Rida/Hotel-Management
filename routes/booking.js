const express = require("express");
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware");
const { User, Booking , Room , Hotel } = require('../models');


const router = express.Router();

/* ----------------------------------------------------------
📌 Create a New Booking (Customer Only)
---------------------------------------------------------- */
router.post("/book/:roomId", authenticateToken, authorizeRole("customer"), async (req, res) => {
  
  /* #swagger.tags = ['Bookings']
      #swagger.summary = "Create a new booking (Customer Only)"
  */

  try {
    const { roomId } = req.params;
    const { checkInDate, checkOutDate, amount, config } = req.body;

    // ✅ Check if Room Exists
    const room = await Room.findByPk(roomId);
    if (!room || room.status === 'Booked') return res.status(400).json({ error: "Room not found" });

    if (!config?.adults || config.adults < 1) {
      return res.status(400).json({ error: 'At least 1 adult is required' });
    }


    // ✅ Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      roomId,
      checkInDate,
      checkOutDate,
      amount,
      config,
      status: 'Confirmed'
    });

    await Room.update(
      { status: "Booked" },
      { where: { id: roomId } }
    );

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ error: "Booking failed", details: error.message });
  }
});

/* ----------------------------------------------------------
📌 Get All Bookings (Admin Only)
---------------------------------------------------------- */
router.get("/", authenticateToken, authorizeRole("admin"), async (req, res) => {

  /* #swagger.tags = ['Bookings']
      #swagger.summary = "Get all bookings (Admin Only)"
  */

  try {

    const bookings = await Booking.findAll();

  
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve bookings", details: error.message });
  }
});

/* ----------------------------------------------------------
📌 Get a Booking by ID
---------------------------------------------------------- */
router.get("/:id", authenticateToken , async (req, res) => {

  /* #swagger.tags = ['Bookings']
      #swagger.summary = "Get a booking by ID"
  */

  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve booking", details: error.message });
  }
});

/* ----------------------------------------------------------
📌 Get Bookings for a Specific User (Customer Only)
---------------------------------------------------------- */
router.get("/user/:userId", authenticateToken , async (req, res) => {

  /* #swagger.tags = ['Bookings']
      #swagger.summary = "Get all bookings for a specific user"
  */

  try {
    const { userId } = req.params;

    // ✅ Check if the user exists before querying
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(400).json({ error: "Invalid userId", details: "The specified user does not exist." });
    }

    const bookings = await Booking.findAll({ 
      where: { userId } ,
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['roomNumber', 'type', 'price', 'status'] ,
          include: [
            {
              model: Hotel,
              as: 'hotel',
              attributes: ['name', 'location']
            }
          ]
        }
      ]
    });

    res.json({ userId, bookings });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve bookings", details: error.message });
  }
});

/* ----------------------------------------------------------
📌 Update a Booking (Admin Only)
---------------------------------------------------------- */
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {

  /* #swagger.tags = ['Bookings']
      #swagger.summary = "Update a booking (Admin Only)"
  */

  try {
    const { checkInDate, checkOutDate, status } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    await booking.update({ checkInDate, checkOutDate, status });
    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ error: "Booking update failed", details: error.message });
  }
});

/* ----------------------------------------------------------
📌 Cancel a Booking (Admin or Customer)
---------------------------------------------------------- */
router.put("/:id/cancel", authenticateToken, async (req, res) => {

  /* #swagger.tags = ['Bookings']
      #swagger.summary = "Cancel a booking (Admin or Customer)"
  */

  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // ✅ Allow admins OR the user who created the booking to cancel
    if (req.user.role !== "admin" && req.user.id !== booking.userId) {
      return res.status(403).json({ error: "Unauthorized", details: "You can only cancel your own bookings" });
    }

    await booking.update({ status: "Cancelled" });
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ error: "Booking cancellation failed", details: error.message });
  }
});

/* ----------------------------------------------------------
📌 Delete a Booking (Admin Only)
---------------------------------------------------------- */
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {

  /* #swagger.tags = ['Bookings']
      #swagger.summary = "Delete a booking (Admin Only)"
  */

  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    await booking.destroy();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Booking deletion failed", details: error.message });
  }
});

module.exports = router;
