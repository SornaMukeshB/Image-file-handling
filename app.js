const express=require('express');
const app=express();
const path=require('path');
const multer=require('multer');

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

let storage=multer.diskStorage({    //disk storage engine
    destination:function(req,file,cb){    //destination folder
        //some work
        cb(null,'uploads');   //destination folder name
    },
    filename:function(req,file,cb){            //filename
        cb(null,file.originalname.replace(/\.[^/.]+$/,"")+'_'+Date.now()+path.extname(file.originalname)); //create unique name for file
    }
})

let maxsize=2*1000*1000;

let upload=multer({     //multer function is used to upload files
    storage:storage,
    limits:{
        fileSize:maxsize
    },
    fileFilter:function(req,file,cb){       //file filter function
        let filetypes=/jpeg|jpg|png/;          //file types
        let mimetype=filetypes.test(file.mimetype);     //check file type
        let extname=filetypes.test(path.extname(file.originalname).toLowerCase());    //check file extension

        if(mimetype && extname){
            return cb(null,true);
        }

        cb("Error: File upload only supports the following filetypes: "+filetypes)    //if file type is not valid
    }
}).single('image');   //it is used to upload single file if we want to upload multiple files then we can use .array('image',3) where 3 is the number of files


app.get('/',(req,res)=>{
    res.render('signup');
})

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send("Upload Successfully");
        }
    })
})

app.listen(8000,()=>{
    console.log("Server is Runing");
})