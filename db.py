import os 
from datetime import datetime, timezone

from pymongo import MongoClient, ASCENDING, ReturnDocument
from dotenv import load_dotenv


load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")


client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# access collection
runs_collection = db["runs"]

def init_db():
    runs_collection.create_index("round_id", unique = True)
    runs_collection.create_index([("completed", ASCENDING), ("elapsed_ms", ASCENDING)])
    runs_collection.create_index("created_at")


# backend timer
def create_run(round_id):
    now = datetime.now(timezone.utc)
    
    # create the document
    run_doc = {
        "round_id": round_id,
        "name": None,
        "started_at": now,
        "completed_at": None,
        "elapsed_ms": None,
        "completed": False,
        "created_at": now,
        "updated_at": now
    }
    
    runs_collection.insert_one(run_doc)
    return run_doc


def finalize_run(round_id, name):
    now = datetime.now(timezone.utc)
    
    # find a valid run
    run = runs_collection.find_one({"round_id": round_id})
    if run is None:
        return None, "Round not found"
    
    # completed run 
    if run["completed"]:
        return None, "This score has already been submitted"
    
    
    # Align timezone awareness before subtraction.
    started_at = run["started_at"]
    if started_at.tzinfo is None:
        now = datetime.utcnow()

    # convert s to ms
    elapsed_ms = int((now - started_at).total_seconds() * 1000)

    updated_run = runs_collection.find_one_and_update(
        {"round_id": round_id, "completed": False},
        {
            "$set":{
                "name": name,
                "completed_at": now,
                "elapsed_ms": elapsed_ms,
                "completed": True,
                "updated_at": now
            }
        },
        # return document after update has been applied to get values immediately
        return_document=ReturnDocument.AFTER
    )
    
    if updated_run is None:
        return None, "This score has already been submitted"
    
    return {
        "round_id": updated_run["round_id"],
        "name": updated_run["name"],
        "elapsed_ms": updated_run["elapsed_ms"],
        "completed_at": updated_run["completed_at"]
    }, None
    
# leaderboard 
    
def get_leaderboard(limit=10):
    limit = int(limit)
    return list(
        runs_collection.find({"completed": True})
        .sort("elapsed_ms", ASCENDING)
        .limit(limit)
    )
