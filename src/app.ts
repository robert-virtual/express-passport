if (process.env.NODE_ENV != "production") {
 require("dotenv").config()
}
import express from "express"
import passport from "passport"
import usersRouter from "./routes/users"
import authRouter from "./routes/auth"
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/",authRouter)
app.use("/users",passport.authenticate("jwt",{session:false}),usersRouter)

app.listen(port,()=>{
  console.log(`Server running on port ${port}...`);
})
