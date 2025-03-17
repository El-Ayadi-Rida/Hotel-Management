const express = require("express");
const { authenticateToken, authorizeRole } = require("../middlewares/authMiddleware");
const router = express.Router();

// Protected Route (Requires Authentication)
router.get("/protected", authenticateToken, (req, res) => {
    
        /* #swagger.tags = ['Other']
            #swagger.summary = "Protected Route (Requires Authentication)"
        */

    res.json({ message: "Access granted!", user: req.user });
  });
  
// Admin Only Route
router.get("/admin", authenticateToken, authorizeRole("admin"), (req, res) => {
    
        /* #swagger.tags = ['Other']
            #swagger.summary = "Admin Only Route"
        */

res.json({ message: "Admin access granted!" });
});

// Customer Only Route
router.get("/customer", authenticateToken, authorizeRole("customer"), (req, res) => {
    
        /* #swagger.tags = ['Other']
            #swagger.summary = "Customer Only Route"
        */

res.json({ message: "Customer access granted!" });
});


module.exports = router;