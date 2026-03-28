import requests
import time
import os
import json

# --- CONFIGURATION ---
API_BASE_URL = "https://hazel-ten-psi.vercel.app/api" 
ROBOT_SECRET = "4aba04ec-2ff1-4ac9-a987-62bf6a25d905" 
CHECK_INTERVAL = 5 

HEADERS = {
    "Content-Type": "application/json",
    "x-robot-secret": ROBOT_SECRET
}

# Use absolute paths relative to THIS script's location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CMD_FILE    = os.path.join(SCRIPT_DIR, "robot_commands.txt")
STATUS_FILE = os.path.join(SCRIPT_DIR, "sensor_data.json")

def sync():
    try:
        # 1. SEND TELEMETRY
        # Check if the sensor data file exists
        if os.path.exists(STATUS_FILE):
            with open(STATUS_FILE, "r") as f:
                payload = json.load(f)
            
            res = requests.post(f"{API_BASE_URL}/environment/log", 
                           json=payload, headers=HEADERS, timeout=5)
            print(f"📡 [POST /log] Status: {res.status_code}")
        else:
            print(f"ℹ️ [SKIP] No sensor_data.json found. Skipping telemetry upload.")

        # 2. GET COMMANDS
        res = requests.get(f"{API_BASE_URL}/aroma", headers=HEADERS, timeout=5)
        print(f"📡 [GET /aroma] Status: {res.status_code}")
        
        if res.status_code == 200:
            data = res.json()
            for aroma in data:
                if aroma.get("isActive"):
                    scent = aroma.get("scent_name", "DEFAULT").upper()
                    with open(CMD_FILE, "w") as f:
                        f.write(f"AROMA_{scent}")
                    print(f"✨ [ROBOT] Aroma Command Received: {scent}")
                    break

    except Exception as e:
        print(f"📡 Sync Error: {e}")

if __name__ == "__main__":
    print(f"🚀 Hazel DB Sync Worker Active (Connecting to Vercel...)")
    print(f"   Secret: {ROBOT_SECRET[:8]}...")
    while True:
        sync()
        time.sleep(CHECK_INTERVAL)
