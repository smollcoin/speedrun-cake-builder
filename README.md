# Speedrun Cake Builder

A silly little web game where you speedrun baking a cake.

Drag ingredients into the bowl, whisk like your leaderboard ranking depends on it, pour into the tin, bake, and submit your time.

## Demo here:
Render might take a moment to wake up, but you can try it out here:
https://speedrun-cake-builder.onrender.com/ 

## What it does

- Starts a timed run when you press Start.
- Tracks your run with a backend-generated `round_id`.
- Saves your finish time to MongoDB.
- Shows a leaderboard of the fastest bakers.

## Run it locally

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `.env` file with:

```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=your_database_name
```

3. Start the app:

```bash
python app.py
```

4. Open `http://127.0.0.1:5000` and try to become the Greatest Baker of all time.

## Tech

- Flask
- HTML, CSS, JavaScript
- MongoDB (PyMongo)
