import { UsersMongoDao } from "../dao/models/mongo//UsersMongoDao";
import { verify } from "argon2";
import jwt from "jsonwebtoken"
const users = new UsersMongoDao();
import { Router } from "express";
const router = Router();
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
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
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    },
    async (jsonPayload, done) => {
      try {
        console.log({jsonPayload});
        
        const user = await users.findOne({ _id: jsonPayload.sub });
        if (!user) {
          console.log("no se encontro el usuario");
          return done(null, false);
        }
        done(null, {id:user._id,name:user.name,email:user.email});
      } catch (error) {
        console.log(error);
        done(error, false);
      }
    }
  )
);
router.post(
  "/signin", 
  passport.authenticate("signin", { session: false }),
  (req,res)=>{
  const token = jwt.sign(({sub:req.user.id}),process.env.JWT_ACCESS_SECRET,{expiresIn:"15m"})
  res.json({token})
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

router.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

export default router;
