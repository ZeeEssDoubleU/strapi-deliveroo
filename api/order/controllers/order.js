"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

// *** load stripe api key and initiate stripe connection
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const calcCostOfDishes = (dishes) => {
  // figure price of dishes
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const amount =
    dishes && dishes.map((dish) => dish.price * dish.quantity).reduce(reducer);

  // calc in cents for stripe (x100 to get dollars)
  return amount * 100;
};

// ******************
// create payment intent
// ******************
const paymentIntent_create = async (ctx) => {
  const dishes = ctx.request.body;

  const amount = calcCostOfDishes(dishes);

  try {
    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      // Verify your integration in this guide by including this parameter
      metadata: { integration_check: "accept_a_payment" },
    });
    console.log("creating payment intent...");

    return { id: paymentIntent.id, client_secret: paymentIntent.client_secret };
  } catch (error) {
    console.error(error);
  }
};

// ******************
// get payment intent (possibly update)
// ******************
const paymentIntent_retrieve = async (ctx) => {
  const { paymentIntent_id, items: dishes } = ctx.request.body;

  const amount = calcCostOfDishes(dishes);

  try {
    // retrieve payment intent
    let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntent_id);
    console.log("retrieving payment intent...");

    // if current cart $ amount differs from retrieved $ amount, update payment intent
    if (paymentIntent.amount !== amount) {
      paymentIntent = await stripe.paymentIntents.update(paymentIntent_id, {
        amount,
      });
      console.log("updating payment intent...");
    }

    return { id: paymentIntent.id, client_secret: paymentIntent.client_secret };
  } catch (error) {
    console.error(error);
  }
};

// ******************
// update payment intent
// ******************
const paymentIntent_update = async (ctx) => {
  const { paymentIntent_id, items: dishes } = ctx.request.body;

  const amount = calcCostOfDishes(dishes);

  try {
    const paymentIntent = await stripe.paymentIntents.update(
      paymentIntent_id,
      amount
    );

    return { id: paymentIntent.id, client_secret: paymentIntent.client_secret };
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  paymentIntent_create,
  paymentIntent_retrieve,
  paymentIntent_update,
};
