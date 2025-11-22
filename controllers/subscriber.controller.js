const Subscriber = require("../models/Subscriber");
const { createError } = require("../utils/createError");

exports.subscribe = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(createError(400, "email is required."));
  }

  try {
    const subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return next(createError(400, "email is already subscribed."));
    }

    subscriber = new Subscriber({ email });
    await subscriber.save();
  } catch (err) {
    next(err);
  }
};
