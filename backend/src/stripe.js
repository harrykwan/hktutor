const stripe = require('stripe')('sk_test_CRl2Sto6lG7ZEjnvDIfJxtZx00uRtS3tJx');



async function getclientsecret(callback) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 400,
        currency: 'hkd',
        // Verify your integration in this guide by including this parameter
        metadata: {
            integration_check: 'accept_a_payment'
        },
    });
    console.log(paymentIntent)
    callback(paymentIntent.client_secret)
}


exports.getclientsecret = getclientsecret