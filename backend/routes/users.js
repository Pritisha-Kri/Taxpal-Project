const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const { fullName, country, incomeBracket, profile } = req.body;
    
    const updateData = {};
    
    // Only update provided fields
    if (fullName !== undefined) updateData.fullName = fullName;
    if (country !== undefined) updateData.country = country;
    if (incomeBracket !== undefined) updateData.incomeBracket = incomeBracket;
    
    // Handle nested profile updates
    if (profile) {
      if (profile.businessType !== undefined) {
        updateData['profile.businessType'] = profile.businessType;
      }
      if (profile.taxYear !== undefined) {
        updateData['profile.taxYear'] = profile.taxYear;
      }
      if (profile.currency !== undefined) {
        updateData['profile.currency'] = profile.currency;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
