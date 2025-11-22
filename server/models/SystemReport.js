const mongoose = require('mongoose');

const SystemReportSchema = new mongoose.Schema({
    system: Object, // Store the full system object
    cpu: Object,    // Store the full cpu object
    memory: Object, // Store the full memory object (was ram)
    gpu: Array,     // Store the full gpu array
    disk: Array,    // Store the full disk array
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Auto-delete after 24 hours
    }
});

module.exports = mongoose.model('SystemReport', SystemReportSchema);
