const express = require('express');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Get all notifications for a user (role-based filtering)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { isRead, limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      user: req.user.userId,
      userModel: req.user.role === 'patient' ? 'Patient' : req.user.role === 'doctor' ? 'Doctor' : 'Admin'
    };

    // Role-based notification filtering
    const userRole = req.user.role;
    
    // Patients should only see: confirmed, cancelled, rescheduled, completed, accepted, rejected notifications
    // NOT appointment_request (that's for doctors/admin only)
    if (userRole === 'patient') {
      query.type = {
        $in: [
          'appointment_confirmed',
          'appointment_cancelled',
          'appointment_rescheduled',
          'appointment_reminder',
          'treatment_update',
          'progress_update',
          'reschedule_accepted',
          'reschedule_declined',
          'appointment_status_change',
          'admin_announcement',
          'payment_reminder'
        ]
      };
    }
    
    // Doctors and Admins should see: appointment_request and all other notifications
    // They should NOT see appointment_confirmed for their own appointments (only patients see those)
    if (userRole === 'doctor' || userRole === 'admin') {
      // Show appointment requests, system notifications (approval, admin message), and other relevant notifications
      query.type = {
        $in: [
          'appointment_request',
          'appointment_cancelled',
          'appointment_rescheduled',
          'appointment_reminder',
          'treatment_update',
          'progress_update',
          'reschedule_request',
          'reschedule_accepted',
          'reschedule_declined',
          'appointment_status_change',
          'system_announcement',
          'doctor_approval',
          'admin_message_to_doctor',
          'admin_announcement'
        ]
      };
    }

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('appointment')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get unread notifications count (role-based filtering)
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    let query = {
      user: req.user.userId,
      userModel: userRole === 'patient' ? 'Patient' : userRole === 'doctor' ? 'Doctor' : 'Admin',
      isRead: false
    };

    // Apply same role-based filtering as main notifications endpoint
    if (userRole === 'patient') {
      query.type = {
        $in: [
          'appointment_confirmed',
          'appointment_cancelled',
          'appointment_rescheduled',
          'appointment_reminder',
          'treatment_update',
          'progress_update',
          'reschedule_accepted',
          'reschedule_declined',
          'appointment_status_change'
        ]
      };
    } else if (userRole === 'doctor' || userRole === 'admin') {
      query.type = {
        $in: [
          'appointment_request',
          'appointment_cancelled',
          'appointment_rescheduled',
          'appointment_reminder',
          'treatment_update',
          'progress_update',
          'reschedule_request',
          'reschedule_accepted',
          'reschedule_declined',
          'appointment_status_change',
          'system_announcement'
        ]
      };
    }

    const count = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (notification.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mark all notifications as read
router.patch('/read-all', verifyToken, async (req, res) => {
  try {
    const userModel = req.user.role === 'patient' ? 'Patient' : req.user.role === 'doctor' ? 'Doctor' : 'Admin';
    
    await Notification.updateMany(
      {
        user: req.user.userId,
        userModel: userModel,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete notification
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (notification.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await notification.deleteOne();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;













