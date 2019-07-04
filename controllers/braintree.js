const User = require("../model/User");
const braintree = require("braintree");
require("dotenv").config();

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_ID,
    publicKey: process.env.BRAINTREE_PUBLIC,
    privateKey: process.env.BRAINTREE_PRIVATE
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};
exports.processPayment=(req,res)=>{
    let nonceDromTheClient=req.body.paymentMethodNonce;
    let amountFromTheClient=req.body.amount
    // charge
    gateway.transaction.sale({
        amount:amountFromTheClient,
        paymentMethodNonce: nonceDromTheClient,
        options:{
            submitForSettlement:true
        }
    },(error,result)=>{
        if(error){
            res.status(500).json(error);
        }else{
            res.json(result);
        }
    })
}