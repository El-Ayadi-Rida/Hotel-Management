const express = require("express");
const { Sequelize, where } = require('sequelize');
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware");
const { User, Booking , Room , Hotel } = require('../models');


const router = express.Router();


router.get('/bookings-by-hotel', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const data = await Booking.findAll({
            attributes: [
              [Sequelize.col('room.hotel.name'), 'hotel'],
              [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'bookingCount']
            ],
            include: [{
              model: Room,
              as: 'room',
              attributes: [],
              include: [{
                model: Hotel,
                as: 'hotel',
                attributes: []
              }]
            }],
            group: ['room.hotel.id']
          });          
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to load data", details: error.message });
    }
  });
router.get('/bookings-by-hotel-customer', authenticateToken, authorizeRole('customer'), async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await Booking.findAll({
            attributes: [
              [Sequelize.col('room.hotel.name'), 'hotel'],
              [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'bookingCount']
            ],
            where: {userId},
            include: [{
              model: Room,
              as: 'room',
              attributes: [],
              include: [{
                model: Hotel,
                as: 'hotel',
                attributes: []
              }]
            }],
            group: ['room.hotel.id']
          });          
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to load data", details: error.message });
    }
  });


  router.get('/bookings-over-time', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
      const data = await Booking.findAll({
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('checkInDate')), 'date'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['date'],
        order: [['date', 'ASC']]
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to load data", details: error.message });
    }
  });

  
  router.get('/room-status', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
      const data = await Room.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']
        ],
        group: ['status']
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to load room status", details: error.message });
    }
  });

  
  router.get('/top-customers', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
      const data = await Booking.findAll({
        attributes: [
          [Sequelize.col('user.username'), 'username'],
          [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'bookingCount']
        ],
        include: [{
          model: User,
          as: 'user',
          attributes: []
        }],
        group: ['user.id'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'DESC']],
        limit: 5
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to load top customers", details: error.message });
    }
  });
  

  module.exports = router;
