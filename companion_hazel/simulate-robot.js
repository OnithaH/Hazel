/**
 * Run this script using:  node simulate-robot.js
 * 
 * This simulates the Raspberry Pi syncing with the Next.js database.
 * It will GET the current queue, play songs from it, and POST updates.
 */

let currentTime = 0;
let currentSong = null;

async function syncWithNextJs() {
  try {
    // 1. GET current state to see the true queue and commands from the DB
    const stateRes = await fetch("http://localhost:3000/api/music/state");
    if (!stateRes.ok) return;
    const state = await stateRes.json();
    
    let queue = Array.isArray(state.queue) ? state.queue : [];
    let command = state.command;

    // Acknowledge commands
    let clearCommand = false;
    if (command === "play_pause") {
        console.log("[SIMULATOR] Received Play/Pause command!");
        clearCommand = true;
    } else if (command === "next") {
        console.log("[SIMULATOR] Received Next command! Skipping...");
        currentTime = 9999; // force skip
        clearCommand = true;
    } else if (command === "previous") {
        console.log("[SIMULATOR] Received Previous command!");
        currentTime = 0;
        clearCommand = true;
    }

    // Logic to select the song from queue if we aren't playing anything or song finished
    if (!currentSong || currentTime >= (currentSong.totalTime || 233)) {
      if (queue.length > 0) {
        // Pop the first song from the queue
        currentSong = queue.shift();
        currentTime = 0;
        
        // Let the demo progress bar look normal
        currentSong.totalTime = 233;
        console.log(`[SIMULATOR] Now playing from Queue: ${currentSong.title || currentSong.name}`);
      } else if (!currentSong) {
        // Fallback for demo video if queue is empty
        currentSong = {
          title: "Espresso",
          artist: "Sabrina Carpenter",
          videoId: "eVli-tstM5E",
          thumbnail: "https://i.ytimg.com/vi/eVli-tstM5E/maxresdefault.jpg", 
          totalTime: 233
        };
      } else {
        // Loop the fallback song
        currentTime = 0;
      }
    } else {
        // Just increment progress
        currentTime += 2;
    }

    // 2. POST updates back to the server (progress and modified queue)
    const payload = {
      nowPlaying: {
        ...currentSong,
        currentTime: currentTime,
        totalTime: currentSong.totalTime || 233
      },
      queue: queue
    };

    if (clearCommand) {
        payload.clearCommand = true;
    }

    const updateRes = await fetch("http://localhost:3000/api/music/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (updateRes.ok) {
      console.log(`[SIMULATOR] SYNCED -> Progress: ${currentTime}s | Queue size: ${queue.length}`);
    }
  } catch (error) {
    console.log("[SIMULATOR ERROR] Is your Next.js server running on localhost:3000?");
  }
}

console.log("🤖 Starting Hazel Robot Simulator...");
console.log("Synchronizing with Next.js database every 2 seconds.\n");

// Ping immediately, then every 2 seconds
syncWithNextJs();
setInterval(syncWithNextJs, 2000);
