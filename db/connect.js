const mongoose = require('mongoose')
var connection=null;

const connectDB = async(url) => {
  try {
    connection = await mongoose.connect(url)
    console.log('Database connected..')
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDB