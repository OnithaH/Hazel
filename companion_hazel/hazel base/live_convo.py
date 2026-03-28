import os
import time
import asyncio
import pygame
import edge_tts
import google.generativeai as genai

# --- CONFIGURATION ---
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
VOICE = "en-US-EmmaMultilingualNeural"
OUTPUT_FILE = "/tmp/hazel_response.mp3"
FACE_STATUS = "/tmp/hazel_face_mood.txt" # To tell the face to change expression

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')
# System instruction to ensure she knows she is Hazel
chat = model.start_chat(history=[])

async def speak(text):
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(OUTPUT_FILE)
    pygame.mixer.init()
    pygame.mixer.music.load(OUTPUT_FILE)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        await asyncio.sleep(0.1)

def analyze_sentiment_and_chat(user_text):
    # Prompt Gemini to return both the reply and a mood
    prompt = f"User says: {user_text}. Reply as Hazel. Also, start your reply with [MOOD:HAPPY], [MOOD:SAD], or [MOOD:NEUTRAL] based on the user's vibe."
    
    response = chat.send_message(prompt)
    full_text = response.text

    # Extract Mood for the Face
    mood = "NEUTRAL"
    if "[MOOD:HAPPY]" in full_text: mood = "HAPPY"
    elif "[MOOD:SAD]" in full_text: mood = "SAD"
    
    # Save mood for face.py to read
    with open(FACE_STATUS, "w") as f:
        f.write(mood)

    # Clean the text and speak
    reply = full_text.split("]")[-1].strip()
    print(f"Hazel ({mood}): {reply}")
    asyncio.run(speak(reply))

if __name__ == "__main__":
    print("🎙️ Hazel Live Conversation Service Started...")
    # This loop waits for triggers from the main_controller or local mic
    # For testing, we'll greet the user
    analyze_sentiment_and_chat("Hello Hazel, I am here.")
    
    while True:
        time.sleep(1)