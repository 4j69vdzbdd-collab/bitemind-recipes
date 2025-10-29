// Auto-generated TypeScript types for PrepPal recipe dataset
export interface Ingredient {
  quantity: number;
  unit: string;
  item: string;
  prep: string;
}

export interface Nutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  course: string;
  tags: string[];
  dietary_tags: string[];
  servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  total_time_minutes: number;
  difficulty: string;
  ingredients: Ingredient[];
  steps: string[];
  equipment: string[];
  allergens: string[];
  nutrition_per_serving: Nutrition;
  author: string;
  source: string | null;
  date_added: string;
  notes: string;
}

export interface DatasetMeta {
  version: string;
  created_utc: string;
  records: number;
  notes: string;
  cuisine_distribution?: Record<string, number>;
}

export interface RecipeDataset {
  _meta: DatasetMeta;
  recipes: Recipe[];
}
