// load the stripe module pass in your secret token
// this will configure the `stripe` object for your
// account that you created earlier
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// this function will charge the user's card,
// note that `req` is the http request, we'll
// see how to connect this all up later.
module.exports = (req) => {
  // the token is generated by Stripe and POST'ed
  // to the `action` URL in our form
  var token = req.body.stripeToken;
  var email = req.body.email;
  var amount = req.body.amount;
  var notes = req.body.notes;
  
  //verify user-specified amount
  amount = amount.replace(/\$/g, '').replace(/\,/g, '')
  amount = parseFloat(amount);
  if (isNaN(amount)) {
	  throw "Charge not completed. Please enter a valid amount in USD ($)";
  }
  else if (amount < 5.00) {
	  throw "Charge not completed. Donation amount must be at least $5";
  }

  // now we create a charge which returns a `promise`
  // so we need to make sure we correctly handle
  // success and failure, but that's outside of this
  // function (and we'll see it later)
  return stripe.charges.create({
	amount: amount,
    currency: process.env.STRIPE_CCY,
    source: token,
    description: notes,
    // this metadata object property can hold any
    // extra private meta data (like IP address)
    metadata: {},
  });
}