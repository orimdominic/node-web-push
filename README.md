# node-web-push

A mini node app to work with push notifications

## Instructions

1. Clone the repository and install dependencies with your preferred package manager
2. Generate your VAPID keys by running `npm run vapid`
3. Run the server with `npm run dev`

## Endpoints

Root endpoint is `http://localhost:3000`

> To subscribe a client device

Endpoint - `POST /notifications/subscriptions`

**PAYLOAD** - See 'Subscribing To Push Notification' section at this [Web push tutorial](https://blog.mensaiah.com/How-to-Implement-Push-Notification-with-Nodejs-and-Service-Worker-FkEm8H)

```json
{
  "endpoint": "endpoint URL",
  "expirationTime": null,
  "keys": {
    "p256dh": "p256dh",
    "auth": "auth string"
  }
}
```

> To trigger a notification from any client device

Endpoint - `POST /notifications`

**PAYLOAD**

```json
{
  "title": "Push Test",
  "body": "Push Notification Message",
  "icon": "url_to_an_online_image"
}
```
