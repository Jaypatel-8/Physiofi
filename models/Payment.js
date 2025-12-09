const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  payment_method: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet'],
    required: true
  },
  payment_status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'],
    default: 'Pending'
  },
  transaction_id: String,
  payment_gateway: String,
  paid_at: Date,
  refund_amount: Number,
  refund_reason: String,
  refunded_at: Date,
  invoice_url: String,
  receipt_url: String
}, {
  timestamps: true
});

paymentSchema.index({ patient: 1, createdAt: -1 });
paymentSchema.index({ appointment: 1 });
paymentSchema.index({ payment_status: 1 });
paymentSchema.index({ transaction_id: 1 });

module.exports = mongoose.model('Payment', paymentSchema);




