import mongoose from 'mongoose';
import {userSchema} from './schema.js'


const userModel = mongoose.model('users',userSchema);

let isConnected = false;

export default {
  
  init: async function (){
    if(isConnected){
      console.log("MongoDB connection already open. First trying to close.");
      await mongoose.connection.close();
    }
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
      isConnected = true;
      console.log("MongoDB connection success");
    }).catch((err)=>{
      isConnected = false;
      console.log("MongoDB connection failed...");
    });
  },
  
  addNewUser: async function(username){
    const user = new userModel({username: username, count: 0});
    await user.save();
    return user;
  },

  getListOfUsers: async function(){
    const users = userModel.find({}).select("_id username");
    return users;
  },
  
  addNewExcercise: async function(id, exerciseObj){
    try{
      
      const user = await userModel.findOne({_id: id});
      
      let date = new Date(exerciseObj.date);
      if(exerciseObj.date == "" || !exerciseObj.date){
        date = new Date();
      }
      
      const exercise = {
        description: exerciseObj.description,
        duration: exerciseObj.duration,
        date: date.toDateString(),
      };
      
      user.log.push(exercise);
      user.count = user.log.length;
      await user.save();
      exercise.username = user.username;
      exercise._id = user._id;
      return exercise;
      
    }catch(err){
      console.log(err);
      return Promise.reject(new Error("User couldn't find"));
    }
  },

  findUserById: async function(id, params){
    try{
      const user = await userModel.findById(id);
      
      let limit = 0;
      
      const filteredLog = user.log.filter(exercise =>{
        
        const dLog = (new Date(exercise.date)).getTime();
        
        if(params.from){

          const fLog = (new Date(params.from)).getTime();
          
          if(dLog < fLog){
            return false;
          }
        }
        
        if(params.to){
          const tLog = new Date(params.to).getTime();
          if(dLog >= tLog){
            return false;
          }
        }

        if(params.limit){
          if(limit >= params.limit){
            return false;
          }
        }
        limit++;
        return true;
      });
      
      user.log = filteredLog;
      return user;
    }catch(err){
      return Promise.reject(err);
    }
  }

};