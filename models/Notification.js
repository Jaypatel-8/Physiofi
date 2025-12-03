const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel'
  },
  userModel: {
    type: String,
    required: true,
    enum: ['Patient', 'Doctor', 'Admin']
  },
  type: {
    type: String,
    enum: [
      'appointment_request',
      'appointment_confirmed',
      'appointment_cancelled',
      'appointment_rescheduled',
      'appointment_reminder',
      'treatment_update',
      'progress_update',
      'system_announcement'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, userModel: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to create appointment notification for all statuses
notificationSchema.statics.createAppointmentNotification = async function(
  userId,
  userModel,
  appointmentId,
  patientData,
  appointmentData,
  status
) {
  const appointmentType = appointmentData.type === 'Home Visit' ? 'Home Visit' : appointmentData.type === 'Online Consultation' ? 'Tele Consultation' : 'Clinic Visit';
  
  let type, title, message, priority;
  
  // Helper function to format date safely
  const formatDate = (date) => {
    try {
      if (!date) return 'N/A';
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      return 'N/A';
    }
  };

  switch(status) {
    case 'Pending':
      type = 'appointment_request';
      title = `New ${appointmentType} Appointment Request`;
      message = `${patientData.name || 'Patient'} has requested a ${appointmentType.toLowerCase()} appointment on ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime || 'N/A'}`;
      priority = 'high';
      break;
    case 'Confirmed':
      type = 'appointment_confirmed';
      title = `Appointment Confirmed - ${appointmentType}`;
      message = `Your ${appointmentType.toLowerCase()} appointment on ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime || 'N/A'} has been confirmed`;
      priority = 'medium';
      break;
    case 'Cancelled':
      type = 'appointment_cancelled';
      title = `Appointment Cancelled - ${appointmentType}`;
      message = `Your ${appointmentType.toLowerCase()} appointment on ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime || 'N/A'} has been cancelled`;
      priority = 'medium';
      break;
    case 'Rescheduled':
      type = 'appointment_rescheduled';
      title = `Appointment Rescheduled - ${appointmentType}`;
      message = `Your ${appointmentType.toLowerCase()} appointment has been rescheduled to ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime || 'N/A'}`;
      priority = 'medium';
      break;
    case 'In Progress':
      type = 'appointment_reminder';
      title = `Appointment In Progress - ${appointmentType}`;
      message = `Your ${appointmentType.toLowerCase()} appointment is now in progress`;
      priority = 'high';
      break;
    case 'Completed':
      type = 'treatment_update';
      title = `Appointment Completed - ${appointmentType}`;
      message = `Your ${appointmentType.toLowerCase()} appointment on ${formatDate(appointmentData.appointmentDate)} has been completed`;
      priority = 'low';
      break;
    default:
      type = 'appointment_request';
      title = `Appointment Update - ${appointmentType}`;
      message = `Your ${appointmentType.toLowerCase()} appointment status has been updated`;
      priority = 'medium';
  }

  const notificationData = {
    patient: {
      name: patientData.name,
      age: patientData.age,
      phone: patientData.phone,
      email: patientData.email,
      gender: patientData.gender,
      address: patientData.address || {}
    },
    appointment: {
      date: appointmentData.appointmentDate,
      time: appointmentData.appointmentTime,
      type: appointmentData.type,
      status: status,
      symptoms: appointmentData.symptoms || [],
      address: appointmentData.address || {},
      medicalHistory: appointmentData.medicalHistory,
      currentMedications: appointmentData.currentMedications || [],
      allergies: appointmentData.allergies || []
    }
  };

  return this.create({
    user: userId,
    userModel: userModel,
    type: type,
    title: title,
    message: message,
    data: notificationData,
    appointment: appointmentId,
    priority: priority
  });
};

module.exports = mongoose.model('Notification', notificationSchema);
