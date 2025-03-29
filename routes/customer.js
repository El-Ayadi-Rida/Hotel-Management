const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const { Sequelize } = require('sequelize');
const { User, Booking } = require('../models'); // from index.js

const router = express.Router();


/* #swagger.tags = ['Customers']
   #swagger.summary = 'Get all customers (Admin only)'
*/
router.get('/', authenticateToken, authorizeRole("admin"), async (req, res) => {
    try {
    //   const customers = await User.findAll({ where: { role: 'customer' } });
    const customers = await User.findAll({
        where: { role: 'customer' },
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.col('bookings.id')), 'bookingCount']
          ]
        },
        include: [{
          model: Booking,
          as: 'bookings',
          attributes: [], // we don’t need full booking data, just count
        }],
        group: ['User.id'], // required for aggregate
      });
  
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve customers", details: error.message });
    }
  });
  


/* #swagger.tags = ['Customers']
#swagger.summary = 'Get a customer by ID (Admin only)'
*/
router.get('/:id', authenticateToken, authorizeRole("admin"), async (req, res) => {
    try {
      const customer = await User.findOne({ where: { id: req.params.id, role: 'customer' } });
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve customer", details: error.message });
    }
  });


module.exports = router;
