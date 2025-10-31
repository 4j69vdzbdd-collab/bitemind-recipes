# ðŸ½ï¸ BiteMind Recipe Dataset â€” 10,000 Structured Recipes

A globally balanced dataset of **10,000 fully structured recipes**, designed for use in food apps, AI training, data analysis, and nutrition tools.

Each recipe includes detailed ingredients, steps, nutrition data, equipment, and comprehensive **dietary tags** such as *Vegan*, *Low-Sodium*, *Diabetic-Friendly*, *Paleo-Style*, *Whole30*, and more.

---

## ðŸ“‚ Dataset Structure

| File | Records | Description |
|------|----------|-------------|
| `all_recipes_10000.json` | 10,000 | Complete merged dataset |
| `recipes_001_with_diet.json` â†’ `recipes_010.json` | 1,000 each | Split-friendly recipe batches |
| `recipes_index.json` | â€” | JSON index referencing all batches |
| `recipes_summary.csv` | â€” | Cuisine counts and course nutrition averages |
| `recipes.d.ts` | â€” | TypeScript type definitions for developers |

---

## ðŸ§  Features

- ðŸŒŽ Global cuisines (Asian, European, African, Middle Eastern, American, and more)  
- ðŸ½ï¸ Balanced courses (Breakfast, Lunch, Dinner, Snack, Dessert, Drink)  
- ðŸ·ï¸ Advanced dietary tagging: Vegan, Keto-Friendly, Low-Sodium, Diabetic-Friendly, Paleo-Style, Whole30, Low-FODMAP, etc.  
- ðŸ“Š Nutrition data per serving (Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium)  
- ðŸ§© Split-friendly design for API or incremental loading  
- ðŸ’¾ JSON format + CSV summary for easy analysis  

---

## ðŸ§© Schema Overview

Each batch JSON (`recipes_###.json`) follows this structure:

```json
{
  "_meta": {
    "version": "1.3",
    "created_utc": "2025-10-29T00:00:00Z",
    "records": 1000,
    "notes": "Auto-generated dataset with dietary tagging"
  },
  "recipes": [
    {
      "id": "uuid",
      "title": "Garlic-Herb Chicken with Lemon Rice",
      "description": "...",
      "cuisine": "Greek",
      "course": "Dinner",
      "tags": ["Greek", "Dinner", "Garlic-Herb"],
      "dietary_tags": ["High-Protein", "Gluten-Free", "Halal-Style"],
      "servings": 4,
      "prep_time_minutes": 25,
      "cook_time_minutes": 40,
      "total_time_minutes": 65,
      "difficulty": "Medium",
      "ingredients": [
        {"quantity": 250, "unit": "g", "item": "Chicken", "prep": "sliced"},
        {"quantity": 1.5, "unit": "cup", "item": "Rice", "prep": "rinsed"}
      ],
      "steps": ["Prep ingredients...", "Cook chicken...", "Serve warm..."],
      "equipment": ["Pan", "Knife", "Mixing bowl"],
      "nutrition_per_serving": {
        "calories": 320,
        "protein_g": 28,
        "carbs_g": 35,
        "fat_g": 10,
        "fiber_g": 4,
        "sugar_g": 3,
        "sodium_mg": 550
      },
      "author": "Auto-generated dataset",
      "source": null,
      "date_added": "2025-10-29",
      "notes": ""
    }
  ]
}

