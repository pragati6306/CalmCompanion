import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client for storage
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Create storage bucket on startup for photos
const bucketName = "make-98afb243-memories";
async function initStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log(`Created storage bucket: ${bucketName}`);
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
}
initStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-98afb243/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ MOOD TRACKER ENDPOINTS ============

// Get all mood entries
app.get("/make-server-98afb243/moods", async (c) => {
  try {
    const moods = await kv.getByPrefix("mood:");
    return c.json({ success: true, moods });
  } catch (error) {
    console.error("Error fetching moods:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add a new mood entry
app.post("/make-server-98afb243/moods", async (c) => {
  try {
    const body = await c.req.json();
    const { emoji, note, timestamp } = body;
    
    if (!emoji || !timestamp) {
      return c.json({ success: false, error: "Emoji and timestamp are required" }, 400);
    }
    
    const moodId = `mood:${timestamp}`;
    await kv.set(moodId, { emoji, note, timestamp });
    
    return c.json({ success: true, moodId });
  } catch (error) {
    console.error("Error adding mood entry:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ REMINDERS ENDPOINTS ============

// Get all reminders
app.get("/make-server-98afb243/reminders", async (c) => {
  try {
    const reminders = await kv.getByPrefix("reminder:");
    return c.json({ success: true, reminders });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add a new reminder
app.post("/make-server-98afb243/reminders", async (c) => {
  try {
    const body = await c.req.json();
    const { title, time, type, enabled } = body;
    
    if (!title || !time) {
      return c.json({ success: false, error: "Title and time are required" }, 400);
    }
    
    const reminderId = `reminder:${Date.now()}`;
    await kv.set(reminderId, { 
      title, 
      time, 
      type: type || "task", 
      enabled: enabled !== false,
      createdAt: Date.now()
    });
    
    return c.json({ success: true, reminderId });
  } catch (error) {
    console.error("Error adding reminder:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update reminder (toggle enabled or edit)
app.put("/make-server-98afb243/reminders/:id", async (c) => {
  try {
    const reminderId = c.req.param("id");
    const body = await c.req.json();
    
    const existing = await kv.get(reminderId);
    if (!existing) {
      return c.json({ success: false, error: "Reminder not found" }, 404);
    }
    
    await kv.set(reminderId, { ...existing, ...body });
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating reminder:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete reminder
app.delete("/make-server-98afb243/reminders/:id", async (c) => {
  try {
    const reminderId = c.req.param("id");
    await kv.del(reminderId);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ PHOTO MEMORIES ENDPOINTS ============

// Get all photo memories
app.get("/make-server-98afb243/memories", async (c) => {
  try {
    const memories = await kv.getByPrefix("memory:");
    
    // Generate signed URLs for photos
    const memoriesWithUrls = await Promise.all(
      memories.map(async (memory: any) => {
        if (memory.photoPath) {
          const { data } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(memory.photoPath, 3600); // 1 hour expiry
          
          return { ...memory, photoUrl: data?.signedUrl };
        }
        return memory;
      })
    );
    
    return c.json({ success: true, memories: memoriesWithUrls });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Upload photo memory
app.post("/make-server-98afb243/memories", async (c) => {
  try {
    const body = await c.req.json();
    const { caption, photoBase64, timestamp } = body;
    
    if (!caption && !photoBase64) {
      return c.json({ success: false, error: "Caption or photo is required" }, 400);
    }
    
    const memoryId = `memory:${timestamp || Date.now()}`;
    let photoPath = null;
    
    // Upload photo to Supabase Storage if provided
    if (photoBase64) {
      const base64Data = photoBase64.split(",")[1]; // Remove data:image/xxx;base64, prefix
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      photoPath = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(photoPath, buffer, {
          contentType: "image/jpeg",
          upsert: false
        });
      
      if (uploadError) {
        console.error("Error uploading photo:", uploadError);
        return c.json({ success: false, error: "Failed to upload photo" }, 500);
      }
    }
    
    await kv.set(memoryId, {
      caption,
      photoPath,
      timestamp: timestamp || Date.now()
    });
    
    return c.json({ success: true, memoryId });
  } catch (error) {
    console.error("Error adding memory:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete memory
app.delete("/make-server-98afb243/memories/:id", async (c) => {
  try {
    const memoryId = c.req.param("id");
    const memory = await kv.get(memoryId);
    
    // Delete photo from storage if exists
    if (memory?.photoPath) {
      await supabase.storage.from(bucketName).remove([memory.photoPath]);
    }
    
    await kv.del(memoryId);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting memory:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);