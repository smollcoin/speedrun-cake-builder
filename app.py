# backend for scores and leaderboard
from flask import Flask, render_template, jsonify, request
from db import create_run, finalize_run, get_leaderboard, init_db
import uuid

app = Flask(__name__)
init_db()

@app.route("/")
def index(): 
    return render_template("index.html")

# post start run
@app.post("/api/run/start")
def start_run():
    round_id = uuid.uuid4().hex
    create_run(round_id)
    
    # pass ts to the front
    return jsonify(
        {
            "round_id": round_id,
            "message": "Run started"
        }
    ), 201 
    
    

@app.post("/api/run/finish")
def finish_run():
    data = request.get_json(silent=True) or {}
    
    # grab round id
    round_id = data.get("round_id", "")
    name = data.get("name", "").strip()
    
    # validation
    if not round_id:
        return jsonify({"error": "round_id is required"}), 400
    
    if not name:
        return jsonify({"error": "name is required"}), 400
    
    if len(name) > 30:
        return jsonify({"error": "Name must be less than 30 characters"}), 400
    
    ## check for valid run 
    score, error = finalize_run(round_id, name)
    
    if error:
        if error == "Round not found":
            return jsonify({"error": error}), 404
        return jsonify({"error": error}), 409
    
    return jsonify(
        {
            "message": "Score saved",
            "score": {
                "round_id": score["round_id"],
                "name": score["name"],
                "elapsed_ms": score["elapsed_ms"],
                "completed_at": score["completed_at"].isoformat()
            }
        }
    ), 201
    

@app.get("/api/leaderboard")
def leaderboard():
    limit = request.args.get("limit", default=10, type=int)
    if limit is None:
        limit = 10
    limit = max(1, min(limit, 100))
    scores = get_leaderboard(limit=limit)
    
    leaderboard_data = []
    for score in scores:
        leaderboard_data.append(
            {
                "name": score["name"],
                "elapsed_ms": score["elapsed_ms"],
                "completed_at": score.get("completed_at", "-")             
            }
            
        )
    return jsonify({"leaderboard": leaderboard_data}), 200


if __name__ == "__main__":
    app.run(debug=True)



