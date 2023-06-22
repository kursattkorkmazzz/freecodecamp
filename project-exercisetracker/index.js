import express from 'express';
import cors from 'cors';
import DBM from './database/database.js'

const app = express();

DBM.init();

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded());


app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html')
});


app.route('/api/users')
  .post((req,res)=>{
  
  DBM.addNewUser(req.body.username).then(data=>{
    console.log("New user added.");
    res.json({username: data.username, _id: data._id});
  }).catch(err=>{
    console.log("Error occured when adding new user.");
  });
  
  })
  .get((req,res)=>{
      DBM.getListOfUsers().then(data=>{
        console.log("All users listed.");
        res.status(200).json(data);
      }).catch(err=>{
        //console.log("En error occured when listing all users.\n" + err);
      });
  });



app.route("/api/users/:_id/exercises")
  .post((req,res)=>{
    DBM.addNewExcercise(req.params._id,
      {
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date
      }).then(data=>{
      
        res.json({
          _id: data._id,
          username: data.username,
          date: data.date,
          duration: parseInt(data.duration),
          description: data.description
        });  
      })
    .catch(err=>{
      res.send("User couldn't find! ->"+ err);
    });
    
  });

app.get("/api/users/:_id/logs",(req,res)=>{
    const params = {
      from: req.query.from,
      to: req.query.to,
      limit: req.query.limit
    };
    
    DBM.findUserById(req.params._id, params).then(data=>{
      res.json(data);
    }).catch(err=>{
      console.log("Error occured while getting logs: " + err);
    });

  
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
