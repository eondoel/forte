// Catálogo de alimentos. kcal y protein son por 1 unidad indicada en "unit".
// Para gramos/ml, los valores son por 1 g/ml (se multiplican por la cantidad).
export type Food = {
  name: string;
  unit: "g" | "ml" | "pieza" | "rebanada" | "cucharada" | "lata" | "taza" | "porción";
  kcal: number;
  protein: number;
};

export const FOODS: Food[] = [
  { name: "Pechuga de pollo asada", unit: "g", kcal: 1.65, protein: 0.31 },
  { name: "Verduras (mezcla congelada)", unit: "g", kcal: 0.42, protein: 0.02 },
  { name: "Frijoles de la lata", unit: "g", kcal: 0.9, protein: 0.06 },
  { name: "Queso (panela / manchego)", unit: "g", kcal: 3.2, protein: 0.24 },
  { name: "Pan de caja", unit: "rebanada", kcal: 75, protein: 3 },
  { name: "Tortilla de maíz", unit: "pieza", kcal: 65, protein: 1.5 },
  { name: "Tortilla de harina", unit: "pieza", kcal: 140, protein: 4 },
  { name: "Huevo", unit: "pieza", kcal: 70, protein: 6 },
  { name: "Arroz cocido", unit: "g", kcal: 1.3, protein: 0.027 },
  { name: "Yogur griego natural", unit: "g", kcal: 0.6, protein: 0.1 },
  { name: "Atún en agua", unit: "g", kcal: 1.16, protein: 0.26 },
  { name: "Aguacate", unit: "g", kcal: 1.6, protein: 0.02 },
  { name: "Crema de cacahuate", unit: "cucharada", kcal: 95, protein: 4 },
  { name: "Manzana", unit: "pieza", kcal: 95, protein: 0.5 },
  { name: "Plátano", unit: "pieza", kcal: 105, protein: 1.3 },
  { name: "Leche", unit: "ml", kcal: 0.5, protein: 0.033 },
  { name: "Coca-Cola normal", unit: "ml", kcal: 0.42, protein: 0 },
  { name: "Comida rápida", unit: "porción", kcal: 900, protein: 30 },
];

// Cantidad inicial sugerida según la unidad.
export function defaultQty(unit: Food["unit"]): number {
  if (unit === "g") return 150;
  if (unit === "ml") return 250;
  return 1;
}
