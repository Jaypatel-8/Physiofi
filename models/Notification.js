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
      'system_announcement',
      'reschedule_request',
      'reschedule_accepted',
      'reschedule_declined',
      'appointment_status_change',
      'doctor_approval',
      'admin_message_to_doctor',
      'admin_announcement',
      'payment_reminder'
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
  status,
  doctorData
) {
  // Return null if userId is not provided
  if (!userId) {
    return null;
  }

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

  // Helper function to format time
  const formatTime = (time) => {
    if (!time) return 'N/A';
    return time;
  };

  switch(status) {
    case 'Pending':
      // Appointment request notifications ONLY for doctors and admins
      type = 'appointment_request';
      if (userModel === 'Doctor' || userModel === 'Admin') {
        title = `New ${appointmentType} Appointment Request`;
        message = `${patientData.name || 'Patient'} (${patientData.phone || 'N/A'}) has requested a ${appointmentType.toLowerCase()} appointment on ${formatDate(appointmentData.appointmentDate)} at ${formatTime(appointmentData.appointmentTime)}. Symptoms: ${(appointmentData.symptoms || []).join(', ') || 'None'}`;
        priority = 'high';
      } else {
        // Patients don't get appointment_request notifications
        // They'll get appointment_confirmed when doctor accepts
        return null; // Don't create notification for patients on request
      }
      break;
    case 'Confirmed':
      // Confirmed notifications ONLY for patients (doctor already knows they confirmed it)
      type = 'appointment_confirmed';
      if (userModel === 'Patient') {
        title = `Appointment Confirmed - ${appointmentType}`;
        message = `Your ${appointmentType.toLowerCase()} appointment with Dr. ${doctorData?.name || 'Doctor'} is confirmed for ${formatDate(appointmentData.appointmentDate)} at ${formatTime(appointmentData.appointmentTime)}.`;
        priority = 'medium';
      } else {
        // Doctors/Admins don't need confirmation notification (they're the ones confirming)
        return null; // Don't create notification for doctors/admins on confirmation
      }
      break;
    case 'Cancelled':
      // Cancelled notifications for both patient and doctor
      type = 'appointment_cancelled';
      if (userModel === 'Patient') {
        title = `Appointment Cancelled - ${appointmentType}`;
        message = `Your ${appointmentType.toLowerCase()} appointment on ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime || 'N/A'} has been cancelled`;
      } else {
        title = `Appointment Cancelled - ${appointmentType}`;
        message = `Appointment with ${patientData.name || 'Patient'} on ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime || 'N/A'} has been cancelled`;
      }
      priority = 'medium';
      break;
    case 'Rescheduled':
      // Rescheduled notifications for both patient and doctor
      type = 'appointment_rescheduled';
      if (userModel === 'Patient') {
        title = `Appointment Rescheduled - ${appointmentType}`;
        message = `Your ${appointmentType.toLowerCase()} appointment has been rescheduled to ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime || 'N/A'}`;
      } else {
        title = `Appointment Rescheduled - ${appointmentType}`;
        message = `Appointment with ${patientData.name || 'Patient'} has been rescheduled to ${formatDate(appointmentData.appointmentDate)} at ${appointmentData.appointmentTime || 'N/A'}`;
      }
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
    doctor: doctorData ? {
      name: doctorData.name,
      specialization: doctorData.specialization || []
    } : null,
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
