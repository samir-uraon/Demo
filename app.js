const express=require("express")
const upload=require("express-fileupload")
const path=require("path")

const mysql=require("mysql2")
const bodyParser = require("body-parser")
 
const db=mysql.createConnection({
    "host":"localhost",
    "user":"root",
    "password":"Lenovo@2024",
    "database":"website"
})

var time=0
var id=0

//var data;
 var data=1001;

var app=express()
app.use(upload())

// app.use(express.static("public")) // any one use
var staticpath=path.join(__dirname,"public")
app.use(express.static(staticpath))

app.set("view engine","hbs")
app.set("views","templates")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.render("index.hbs",{data:false})
})



app.post("/",(req,res)=>{
  
 var male=req.body.male
 var female=req.body.female
 var password=req.body.password
 var email=req.body.email
 var name=req.body.name
 console.log(male);
 console.log(name);
 
 
if(male!=undefined && female!=undefined){
    var gander="others"
}
else if(male==undefined){
    var gander="female"
}
else{
    var gander="male"
}
// console.log(gander)
if(req.files){
    var file=req.files.fname
    var filename=file.name
    var ext=filename.substring(filename.lastIndexOf("."),filename.length)
    var ran=randomInt(1,1000)
    var image="Image"+ran+ext
    // console.log(image)
    
    file.mv("public/uploads/"+image,function(error){
      if(error){
        console.log("not move file")
      }else{
        db.connect(function(err){
            if(err){
            console.log("connect")}
         else{ 
          re=Math.floor(Math.random()*(9999-1020)+1020)
            db.query(`insert into test(id,name,email,password,gander,pic) values('${re}','${name}','${email}','${password}','${gander}','${image}')`,(err)=>{
            if(err) throw err;
              console.log("submited")
             })
            }
            
            })
}

        }) 
  
    }
 
  res.render("index.hbs",{data:true})
})
 
app.get("/login",(req,res)=>{
 res.render("login.hbs",{check:"f",p:"f"})
})

app.post("/login",(req,res)=>{
   
    var email=req.body.email
    var password=req.body.password
    
    db.connect(function(err){
      if(err){
      console.log("not connect")}
   else{ 
      db.query(`select password,id from test where email='${email}'`,(err,result)=>{
         
        // console.log(result[0])
        if(result[0]!=undefined){
         
      //  console.log(result[0])
      var pass=result[0].password
      var id=result[0].id
      
      if(password==pass){
      // res.render("home.hbs",{i:id})
      db.connect((err)=>{
        db.query(`insert into test2(id,login) values(${id},now())`,function(er){
         if(er){
           console.log("error")
         }
         
        })
       })
     
  
      setTimeout(()=>{
res.redirect("/home")
      data=id
      },1000)
      
    }
      else{
        
        res.render("login.hbs",{p:"t",check:"f"})

      }
    }
      else{
        res.render("login.hbs",{check:"t",p:"f"})
      }
   })
  
   }
})
})


app.get("/home",(req,res)=>{
   if(data!=undefined){
    var i=data

    db.connect((err)=>{
     if(err) throw err;
     db.query(`select name,pic from test where id=${i}`,(err,result)=>{

     if(err) throw err;
     var na=result[0].name
     var im=result[0].pic
     res.render("home.hbs",{name:na,id:i,image:im})
   
    })
  
})

   }
else{
  res.redirect("/login")
}
})


app.get("/logout",(req,res)=>{
  if(data!=undefined){
   var i=data
    
   db.connect((err)=>{
    if(err) throw err;
  
    db.query(`insert into test2(id,logout) values(${i},now())`,function(er){
     if(er){
       console.log("error")
     }
     else{
        res.redirect("/login")
     }
    })
   })
 
}
else{
 res.redirect("/login")
}})

app.post("/home",(req,res)=>{
  var text=req.body.text
  var i=data
  // console.log(text,i)
  
    db.connect((err)=>{
      if(err) throw err;
    db.query(`select * from test where id=${i}`,(err,result)=>{
      if(err) throw err;
      var na=result[0].name
      var im=result[0].pic
      // console.log(na,im)
    
      db.query(`insert into test3(id,text,time) values(${i},'${text}',now())`,function(er){
       if(er){
        console.log("error")
        res.render("home.hbs",{name:na,id:i,image:im})
       }
       else{
        console.log("okey")
        res.render("home.hbs",{name:na,id:i,image:im})
       }
      })
    })
})
    

})
app.listen(3000)
console.log("Server starting http://localhost:3000")


