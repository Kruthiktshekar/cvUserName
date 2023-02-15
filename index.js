const express = require('express')
const app = express()
app.use(express.json())
const route = express.Router()
app.use(route)

app.listen(3500,()=>{
    console.log('server is started')
})

const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  userName: String,
  cvName : String,
  count: Number
});

const Model = mongoose.model('Model', modelSchema);

// Connect to the database
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
.then(()=>{
    console.log('db is connected')
})

route.post('/cv',(req,res)=>{
    const data = req.body
    Model.findOne({userName:data.userName})
    .then((cv)=>{
        if(!cv){
         Model.create({
                userName : data.userName,
                count : 1,
                cvName : data.userName
            })
            .then((user)=>{
                user.save()
                res.json(user)   
            })
        }
         else if(cv){
           const model = cv
           model.count += 1
           model.cvName = model.userName + model.count.toString()
           model.save()
           .then((finalData)=>{
            res.json(finalData)
           })
        }
       
    })
})