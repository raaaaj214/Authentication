import  express  from "express";
import path from "path";
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
mongoose.connect("mongodb://127.0.0.1:27017", {dbName : "backend"}).then(
    () => { console.log("db connected")}
).catch(e=>{console.log(e)})

const userSchema = mongoose.Schema({
    name : String,
    password : String,
})
const user = mongoose.model("users", userSchema);
const app = express();



// middleware
// app.use(express.static(path.join(path.resolve(),'./public')))/
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());


const isAuthorized = async (req,res,next) => {
    const {token} = req.cookies;
    if(token)
    {
        
        next();
    }
    else
    res.render("login.ejs")
}




app.get('/', isAuthorized ,  (req,res,next) => {
    res.render("logout.ejs")
})

app.get("/logout" , (req,res) =>{
    res.render("logout.ejs")
})


app.get("/logingout" , (req,res) =>{
    res.cookie("token", null , {
        expires : new Date(Date.now())
    })
    res.redirect("/")
})

app.post("/login" , async (req,res,next) =>{
    const {name , password} = req.body;
    let userdata = await user.findOne({name})
    if(!userdata)
    {
        res.redirect("/register")
        
    }
    else
    {
        console.log(userdata)
        const isPresent = await bcrypt.compare(password , userdata.password)
        if(isPresent === false)
        {
            res.send("<h1>Password Incorrect</h1>")
        }
        else
        {
        const token = jwt.sign({id : userdata._id},"1234");
        res.cookie("token",token , {
            httpOnly : true
        })
        console.log(userdata)
        res.redirect("/logout")
    }
    } 
   
})
app.get("/register", (req,res) =>{
    res.render("register.ejs")
})
app.post("/register" , async (req,res) => {
    const {name,password} = req.body
    const User = await user.findOne({name})
    console.log(User)
    if(User)
    {
        const isPresent = await bcrypt.compare(password, User.password);
        if(isPresent === true)
        {
        res.send("<h1>User already exist</h1>")
        }
    }
    else
    {
        const hashPass = await bcrypt.hash(password, 12)
        await user.create({name,password : hashPass});
        res.redirect("/")
    }
})




app.listen(3000)