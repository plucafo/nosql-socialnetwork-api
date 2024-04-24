const mongoose = require('mongoose');

// Wrap Mongoose around local connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/departmentsDB')
.then(() => {
    console.log('MongoDB connected successfully!');
})
.catch(err => {
    console.error(err)
});

// Export connection 
module.exports = mongoose.connection;