const express=require('express');
const app=express();
const dotenv=require("dotenv");
dotenv.config({ path: './config.env' });
const nodemailer=require('nodemailer');
const port=process.env.PORT || 4000
const mongoose=require('mongoose');
const path=require('path');
const Data=require('./models/dat');
const methodOverride=require('method-override');
console.log(process.env.EMAIL);


// const mongoose=require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify:false 
}).then(() => {
    console.log(`connnection successful`);
}).catch((err) => console.log(`no connection ${err}`));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


app.get('/home',async (req,res)=>{
    try{
        const data=await Data.find({});
        res.render('home',{data});

    }
    catch(e){
        console.log("yha error aarha h data dalne me" +e);
    }
})
app.get('/home/enter',(req,res)=>{
    res.render('enter');
})
app.get("/",async (req,res)=>{
    res.redirect("/home")
    })
app.post('/home',async(req,res)=>{
    try{
    const {name,email,phone,cinh,cinm}=req.body;
    // sendemail(email,cinh,cinm);

    let transporter = nodemailer.createTransport({
       
        service:"Gmail",
        auth: {
          user:process.env.EMAIL, // generated ethereal user
          pass:process.env.PASSWORD, // generated ethereal password
        },
        tls:{ 
            rejectUnauthorized:false
        }
      });    
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Building-Blocks 👻" <shikhaattar@gmail.com>',
        to: email, 
        subject: "Building block confirmation timings",
        text: `Hello welcome ${name} to BuildingBlocks 👻 you entered at ${cinh}`, 
        html: `<b>Hello welcome ${name} to BuildingBlocks 👻 you entered at ${cinh} ${cinm} </b>`, 
      });
    
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    await Data.create({name,email,phone,cinh,cinm});
    res.redirect('/home');
    }
    catch(e){
        console.log("error yha mail bhejne me h" +e);
    }
})
app.get('/home/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    const d=await Data.findById(id);
    res.render('exit',{d});
    }
    catch(e){
        console.log(e);
    }
})
app.put('/home/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    const {couth,coutm}=req.body;
    const oh=couth;
    const om=coutm;
    const d=await Data.findById(id)
    // sendexmail(d.email,oh,om)
    
    let transporter = nodemailer.createTransport({
    


        service:"Gmail",
        auth: {
          user:process.env.EMAIL, // generated ethereal user
          pass:process.env.PASSWORD, // generated ethereal password
        },
        tls:{ 
            rejectUnauthorized:false
        }
      });    
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Building-Blocks 👻" <navjot1561@gmail.com>',
        to: d.email, 
        subject: "Building block confirmation timings",
        text: `Hello welcome ${d.name} to BuildingBlocks 👻 you entered at ${cinh}`, 
        html: `<b>Thankyou  ${d.name} for visiting building blocks 👻 you left at ${oh} ${om} </b>`, 
      });
    
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    await Data.findByIdAndUpdate(id,{$set:{status:"Checked Out",couth:oh,coutm,om}});
    res.redirect('/home');
    }
    catch(e){
        console.log("error out ate hue h"+e);
    }
})


app.delete('/home/:id',async (req,res)=>{
    const {id}=req.params;
    await Data.findByIdAndDelete(id);
    res.redirect('/home');
})




app.listen(port,(req,res)=>{
    console.log("UP AT 3000");
})