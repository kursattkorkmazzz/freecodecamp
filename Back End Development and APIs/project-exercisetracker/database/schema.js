import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({ 
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: String,
    }
  ]
});


