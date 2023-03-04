const mongoose = require('mongoose')

const connectDB = async(url) => {
  try {
    const con = await mongoose.connect(url)
    console.log('Database connected..')
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDB