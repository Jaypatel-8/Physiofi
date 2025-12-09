const express = require('express');
const router = express.Router();
const { isPatient, isDoctor, isAdmin, isAdminOrDoctor } = require('../middleware/rbac');
const Payment = require('../models/Payment');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Get all payments (Admin can see all, Doctor/Patient see their own)
router.get('/', isAdminOrDoctor, async (req, res) => {
  try {
    const { patientId, appointmentId, payment_status } = req.query;
    const query = {};
    
    if (patientId) query.patient = patientId;
    if (appointmentId) query.appointment = appointmentId;
    if (payment_status) query.payment_status = payment_status;

    // If doctor, only show payments for their appointments
    if (req.user.role === 'doctor') {
      const appointments = await Appointment.find({ doctor: req.user.userId }).select('_id');
      const appointmentIds = appointments.map(a => a._id);
      query.appointment = { $in: appointmentIds };
    }

    const payments = await Payment.find(query)
      .populate('patient', 'full_name name email phone')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { payments }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient's own payment history
router.get('/my-payments', isPatient, async (req, res) => {
  try {
    const payments = await Payment.find({ patient: req.user.userId })
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { payments }
    });
  } catch (error) {
    console.error('Get my payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single payment
router.get('/:id', isAdminOrDoctor, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('patient', 'full_name name email phone')
      .populate('appointment');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if patient is accessing their own payment
    if (req.user.role === 'patient' && payment.patient._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create payment record
router.post('/', isAdminOrDoctor, async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      amount,
      payment_method,
      transaction_id,
      payment_gateway
    } = req.body;

    if (!patientId || !amount || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, amount, and payment method'
      });
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Verify appointment if provided
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }
    }

    const payment = new Payment({
      patient: patientId,
      appointment: appointmentId || null,
      amount,
      payment_method,
      payment_status: 'Pending',
      transaction_id: transaction_id || null,
      payment_gateway: payment_gateway || null
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      data: { payment }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Update payment status (Admin or payment gateway webhook)
router.put('/:id/status', isAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const { payment_status, transaction_id, paid_at, refund_amount, refund_reason } = req.body;

    if (payment_status) payment.payment_status = payment_status;
    if (transaction_id) payment.transaction_id = transaction_id;
    if (paid_at) payment.paid_at = paid_at;
    if (refund_amount !== undefined) {
      payment.refund_amount = refund_amount;
      payment.refunded_at = new Date();
      payment.refund_reason = refund_reason || '';
    }

    await payment.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: { payment }
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Get payment statistics (Admin only)
router.get('/stats/overview', isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalPayments = await Payment.countDocuments(query);
    const totalAmount = await Payment.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paymentsByStatus = await Payment.aggregate([
      { $match: query },
      { $group: { _id: '$payment_status', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    const paymentsByMethod = await Payment.aggregate([
      { $match: query },
      { $group: { _id: '$payment_method', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalPayments,
        totalAmount: totalAmount[0]?.total || 0,
        paymentsByStatus,
        paymentsByMethod
      }
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;




