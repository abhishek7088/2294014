
# 🔗 URL Shortener Microservice

A compact and efficient microservice to shorten URLs, log usage, and track statistics, built with **Node.js**, **Express**, and **MongoDB**. Developed for the Campus Hiring Evaluation challenge.

---

## 🚀 Features

- ✅ **Shorten URLs** with either custom or auto-generated shortcodes.
- 🕒 **Expiry support** — default: 30 minutes (can be customized).
- 🔁 **Redirect** to the original URL via the shortened link.
- 📊 **URL statistics** including:
  - Total clicks
  - Expiry
  - Created timestamp
  - Last accessed time
- 🧾 **Logging Middleware** integrated with AffordMed’s Evaluation Logging API.
- ❌ Proper **error handling** with HTTP codes.

---

## 📁 Directory Structure

```
url-shortener/
├── controllers/
│   └── shorturl.js         # Core logic: create, redirect, stats
├── models/
│   └── url.js              # MongoDB schema for short URLs
├── routes/
│   └── shorturl.js         # API endpoints
├── utils/
│   ├── logger.js           # Reusable logging middleware
│   └── auth.js             # AffordMed authentication
├── config/
│   └── constants.js        # Config values (IDs, secrets, URLs)
├── app.js                  # Express server + Mongo connection
├── .env                    # Environment variables
└── README.md
```

---

## 📦 API Endpoints

### `POST /shorturls`
**Create a short URL**

**Body:**
```json
{
  "url": "https://example.com",
  "validity": 60,
  "shortcode": "custom123"
}
```

**Response:**
```json
{
  "shortLink": "http://localhost:3000/custom123",
  "expiry": "2025-07-15T07:52:14.808Z"
}
```

---

### `GET /shorturls/:shortcode`
**Get statistics for a short URL**

**Response:**
```json
{
  "originalUrl": "https://example.com",
  "shortLink": "http://localhost:3000/custom123",
  "createdAt": "2025-07-15T07:22:14.808Z",
  "expiry": "2025-07-15T07:52:14.808Z",
  "accessCount": 5,
  "lastAccessed": "2025-07-15T07:48:30.001Z"
}
```

---

## 🛡️ Error Handling

- `400 Bad Request`: Invalid input (e.g. malformed URL, duplicate shortcode)
- `404 Not Found`: Shortcode not found or expired
- `500 Internal Server Error`: Server failure or DB issue

---

## 🔐 Logging API Integration

All logs are sent to:  
```
POST http://20.244.56.144/evaluation-service/logs
```

**Sample Log Call:**
```js
log("backend", "info", "handler", "Short URL created successfully");
```

> Headers include `Authorization: Bearer <token>` set via `auth.js`.

---

## ⚙️ Environment Setup

Create a `.env` file:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/urlshortener
PORT=3000
BASE_URL=http://localhost:3000
```

---

## ✅ Run Locally

```bash
git clone https://github.com/your-username/url-shortener
cd url-shortener
npm install
node app.js
```

---

## 📝 Design Decisions

- **MongoDB** used for flexible expiry and analytics.
- **Custom logging middleware** connects to evaluation server for full-stack observability.
- **Shortcode uniqueness** ensured with retries.
- **Bearer auth** handled with token renewal on startup.

---

## 📚 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Axios** (for external API calls)
- **Dotenv**

---

## ✍️ Author

- **Name**: Abhishek Singh  
- **Email**: abhi7088721935@gmail.com  
- **Roll No**: 2294014  
- **GitHub**: [github.com/abhisingh7088](https://github.com/abhisingh7088)
