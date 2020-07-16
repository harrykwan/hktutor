// const stripe = require('stripe')('sk_test_CRl2Sto6lG7ZEjnvDIfJxtZx00uRtS3tJx');
const stripe = require('stripe')('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');



async function getclientsecret(amount, callback) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
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