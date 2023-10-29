const express = require("express");
const { userModel } = require("../model/user.mode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { blacklistModel } = require("../Blacklist/blacklist.model");

const userRouter = express();

userRouter.post("/register", async (req, res) => {

    const { username, email, password } = req.body;

    try {
        const existuser = await userModel.find({ email });
        if (existuser.length) {
            return res.status(400).send({ error: "Registration failed , user already registed" })
        }
        if (checkPassword(password)) {
           const hashpas= bcrypt.hashSync(password,5)
            // bcrypt.hash(password, 5, async (err, hash) => {
            //     if (err) {
            //         return res.status(200).send({ msg: err.message })
            //     }
            //     else {
                    const user = new userModel({
                        username,
                        email,
                        password:hashpas
                    })
                    await user.save();
                    return  res.status(200).send({ msg: "new uesr has been register successful!" });
                // }
            // })
        }
       return res.status(400).send({ msg: 'password criteria not matech' })

    } catch (error) {
     return res.status(400).send(error)
    }
});

userRouter.post("/login", async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ username: user.username, userId: user._id }, "authtoken");
                    const refrsh = jwt.sign({ course: 'nem111' }, "refreshtoken");

                    return res.status(200).send({ msg: "You are login successful", "authtToken": token, "refresh": refrsh });
                }
                else return res.status(400).send({ err: err.message })
            })
        }

    } catch (error) {
        return  res.status(400).send(error)
    }
});

userRouter.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]||null;
    try {
        await blacklistModel.updateMany({},{$push:{blacklist:[token]}});
        
        return res.status(200).send({ msg: "user has beeb logout successful!@" })

    } catch (error) {
        return res.status(400).send(error)

    }
});

userRouter.get("/refresh",async(req,res)=>{

    try {
        const token = req.headers.authorization?.split(" ")[1];
        let decode = jwt.verify(token,"refreshtoken")
        let newToken = jwt.sign({username: decode.username, userId: decode._id},"authtoken");
        return res.status(200).send({"newToken":newToken})
    } catch (error) {
        return res.status(400).send(error)
        
    }
})
function checkPassword(password) {
    if (password.length < 8) {
        return false
    }
    let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let num = "0123456789";
    let special = "[]{}!@#$%^&*()-_=+~";
    let flag1 = false;
    let flag2 = false;
    let flag3 = false;

    for (let i = 0; i < password.length; i++) {
        if (alpha.includes(password[i])) {
            flag1 = true;
        }
        if (num.includes(password[i])) {
            flag2 = true;
        }
        if (special.includes(password[i])) {
            flag3 = true;
        }

    }
    return flag1 && flag2 && flag3 ? true : false;

}
module.exports = { userRouter }