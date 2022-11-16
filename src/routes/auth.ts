import { UsersMongoDao } from "../dao/models/mongo//UsersMongoDao";
import { verify } from "argon2";
import jwt from "jsonwebtoken"
const users = new UsersMongoDao();
import { Router } from "express";
const router = Router();
import passport from "passport";
import { Strategy as Auth0Strategy,  } from "passport-auth0";
import { Strategy as LocalStrategy } from "passport-local";

declare global {
  namespace Express{
    interface User{
      id:string
      email:string
      name:string
    }
  }
}

passport.use(
  "signin",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, cb) => {
      try {
        const user = await users.findOne({ email });
        if (!user) {
          return cb(null, false, { message: "Incorrent email or password" });
        }
        const valid = await verify(user.password, password);
        if (!valid) {
          return cb(null, false, { message: "Incorrent email or password" });
        }
        return cb(null, { id:user._id,email:user.email,name:user.name });
      } catch (error) {
        cb(error);
      }
    }
  )
);
passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
      passReqToCallback: true,
      state:false
    },
    async (req,accessToken,refreshToken,extraParams,profile, done) => {
      try {
        console.log({accessToken,refreshToken,extraParams,profile});
        
        done(null,profile);
      } catch (error) {
        console.log(error);
        done(error, false);
      }
    }
  )
);
router.post(
  "/signin", 
  passport.authenticate("auth0", {scope:"openid email profile"}),
  (req,res)=>{
  res.json({profile:req.user})
});
passport.use(
  "signup",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email,password,cb) => {
      try {
        const {insertedId:id} = await users.signup({password,email})
       cb(null,{email,id}) 
      } catch (error) {
       cb(error) 
      }

    }
  )
);
router.post("/signup",passport.authenticate('signup',{session:false}), async (req, res) => {
  const token = jwt.sign(({sub:req.user.id}),process.env.JWT_ACCESS_SECRET,{expiresIn:"15m"})
  res.json({token})
});


router.get(
  "/callback",
  (req, res) => {
    res.json({ msg: "callback" });
  }
);


export default router;
