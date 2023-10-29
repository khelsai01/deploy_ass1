const jwt = require("jsonwebtoken");
const {blacklistModel} = require("../Blacklist/blacklist.model")
const auth = async (req, res, next) => {


    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            let existToken = await blacklistModel.find({ blacklist: { $in: token } })
            if(existToken.length>0){
                return res.status(400).send({err:"login again token has beeb expire"})
            }
            let decode = jwt.verify(token,"authtoken");
            req.body.userId = decode.userId,
            req.body.username = decode.username
            return next();

        }  else{
            return res.status(400).send("please login first")
        } 
    } catch (error) {

    }
}

module.exports ={auth}