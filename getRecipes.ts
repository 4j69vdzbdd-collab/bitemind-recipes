import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Polyfill __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import OpenAI from "openai";
import type { RecipeDataset, Recipe } from "./recipes.d.ts"; // ✅ fixed import
import { v4 as uuidv4 } from "uuid";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// File paths
const DATA_PATH = path.join(__dirname, "all_recipes_10000.json");
const NEW_RECIPES_DIR = path.join(__dirname, "new_recipes");

/**
 * Ensure subfolder exists
 */
function ensureDir() {
  if (!fs.existsSync(NEW_RECIPES_DIR)) {
    fs.mkdirSync(NEW_RECIPES_DIR);
    console.log("📁 Created folder: /new_recipes");
  }
}

/**
 * Load local dataset safely
 */
function loadLocal(): RecipeDataset {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  } catch (err) {
    console.error("❌ Could not load local dataset:", err);
    return {
      _meta: {
        version: "1.0",
        created_utc: new Date().toISOString(),
        records: 0,
        notes: "Empty dataset created automatically",
      },
      recipes: [],
    } as RecipeDataset;
  }
}

/**
 * Save dataset back to file
 */
function saveLocal(data: RecipeDataset) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  console.log("💾 Saved updated dataset to all_recipes_10000.json");
}

/**
 * Save a backup of new AI recipes in /new_recipes/
 */
function saveNewBatch(recipes: Recipe[], query: string) {
  ensureDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `recipes_${query.replace(/\s+/g, "_")}_${timestamp}.json`;
  const filePath = path.join(NEW_RECIPES_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(recipes, null, 2), "utf-8");
  console.log(`🗂️  Saved new batch to /new_recipes/${filename}`);
}

/**
 * Search for recipes locally
 */
function searchLocal(query: string, data: RecipeDataset): Recipe[] {
  const q = query.toLowerCase();
  return data.recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.dietary_tags.some((t) => t.toLowerCase().includes(q))
  );
}

/**
 * Fetch recipes from ChatGPT
 */
async function fetchFromChatGPT(query: string): Promise<Recipe[]> {
  console.log(`🧠 Fetching new recipes from ChatGPT for: "${query}"`);

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a recipe assistant that outputs structured JSON following the RecipeDataset schema.",
      },
      {
        role: "user",
        content: `Generate 3 new ${query} recipes. Return only JSON with keys: title, description, cuisine, course, dietary_tags, ingredients, steps, nutrition_per_serving.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = completion.choices[0].message?.content || "{}";
  const parsed = JSON.parse(result);

  const recipes: Recipe[] = Array.isArray(parsed.recipes)
    ? parsed.recipes
    : Array.isArray(parsed)
    ? parsed
    : [parsed];

  const now = new Date().toISOString().split("T")[0];
  return recipes.map((r) => ({
    ...r,
    id: uuidv4(),
    author: "AI-generated",
    date_added: now,
  }));
}

/**
 * Main: search → fetch → save
 */
async function getRecipes(query: string) {
  const dataset = loadLocal();
  const localResults = searchLocal(query, dataset);

  if (localResults.length > 0) {
    console.log(`✅ Found ${localResults.length} local recipes for "${query}"`);
    return localResults;
  }

  const aiResults = await fetchFromChatGPT(query);
  console.log(`✨ Retrieved ${aiResults.length} new recipes from ChatGPT`);

  dataset.recipes.push(...aiResults);
  dataset._meta.records = dataset.recipes.length;
  saveLocal(dataset);
  saveNewBatch(aiResults, query);

  return aiResults;
}

// 🔹 Example usage
getRecipes("vegan Italian dinner").then((results) => {
  console.log(JSON.stringify(results, null, 2));
});

