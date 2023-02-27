var express = require("express");
var router = express.Router();
const webpush = require("web-push");
const subscriptionStore = require("../database/subscriptions");

router.get("/", function (req, res, next) {
  res.send("notifications");
});

router.post("/", async function (req, res, next) {
  const notif = req.body;

  try {
    const subscriptions = await new Promise((res, rej) => {
      subscriptionStore.find({}, (err, docs) => {
        if (!err) {
          res(docs);
        }
        rej(err);
      });
    });

    const sendResponses = await Promise.allSettled(
      subscriptions.map((sub) => {
        return webpush.sendNotification(sub, JSON.stringify(notif));
      })
    );

    const unsubscribeds = sendResponses
      .filter((sendResponse) => {
        return (
          sendResponse.status === "rejected" &&
          sendResponse.reason.statusCode >= 400
        );
      })
      .map((unsub) => {
        return new Promise((res, rej) => {
          subscriptionStore.remove(
            {
              endpoint: unsub.reason.endpoint,
            },
            (err, numRemoved) => {
              if (!err) res(numRemoved);
              rej(err);
            }
          );
        });
      });

    await Promise.allSettled(unsubscribeds);

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.get("/subscriptions", async function (req, res, next) {
  try {
    const subscriptions = await new Promise((res, rej) => {
      subscriptionStore.find({}, (err, docs) => {
        if (!err) {
          res(docs);
        }
        rej(err);
      });
    });

    return res.json({
      data: {
        success: true,
        subscriptions,
      },
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
  }
});

router.post("/subscriptions", async function (req, res, next) {
  const sub = req.body;
  try {
    const existing = await new Promise((res, rej) => {
      subscriptionStore.findOne(
        {
          endpoint: sub.endpoint,
        },
        (err, doc) => {
          if (!err) {
            res(doc);
          }
          rej(err);
        }
      );
    });

    if (existing) {
      return res.status(200).json({
        data: {
          success: true,
          subscription: existing,
        },
      });
    }
    const subscription = await new Promise((res, rej) => {
      subscriptionStore.insert(sub, (err, doc) => {
        if (!err) {
          res(doc);
        }
        rej(err);
      });
    });

    return res.status(201).json({
      data: {
        success: true,
        subscription,
      },
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
  }
});

module.exports = router;
