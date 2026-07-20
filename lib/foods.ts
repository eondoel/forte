// Catálogo de alimentos. kcal y protein son por 1 unidad indicada en "unit".
// Para gramos/ml, los valores son por 1 g/ml (se multiplican por la cantidad).
export type Food = {
  name: string;
  unit: "g" | "ml" | "pieza" | "rebanada" | "cucharada" | "lata" | "taza" | "porción";
  kcal: number;
  protein: number;
};

// Para alimentos por gramo/ml escribimos el valor por 100 g/ml dividido entre 100
// (así se lee fácil: 165/100 = 165 kcal por 100 g). Los primeros 6 son tus básicos.
export const FOODS: Food[] = [
  // --- Tus básicos ---
  { name: "Pechuga de pollo asada", unit: "g", kcal: 165 / 100, protein: 31 / 100 },
  { name: "Verduras (mezcla congelada)", unit: "g", kcal: 42 / 100, protein: 2 / 100 },
  { name: "Frijoles de la lata", unit: "g", kcal: 90 / 100, protein: 6 / 100 },
  { name: "Queso (panela / manchego)", unit: "g", kcal: 320 / 100, protein: 24 / 100 },
  { name: "Pan de caja", unit: "rebanada", kcal: 75, protein: 3 },
  { name: "Tortilla de maíz", unit: "pieza", kcal: 65, protein: 1.5 },

  // --- Proteínas ---
  { name: "Huevo", unit: "pieza", kcal: 70, protein: 6 },
  { name: "Clara de huevo", unit: "pieza", kcal: 17, protein: 3.6 },
  { name: "Muslo de pollo con piel", unit: "g", kcal: 210 / 100, protein: 26 / 100 },
  { name: "Carne de res molida (cocida)", unit: "g", kcal: 250 / 100, protein: 26 / 100 },
  { name: "Bistec de res asado", unit: "g", kcal: 220 / 100, protein: 29 / 100 },
  { name: "Lomo de cerdo", unit: "g", kcal: 210 / 100, protein: 27 / 100 },
  { name: "Tilapia / pescado blanco", unit: "g", kcal: 128 / 100, protein: 26 / 100 },
  { name: "Salmón", unit: "g", kcal: 208 / 100, protein: 20 / 100 },
  { name: "Atún en agua", unit: "g", kcal: 116 / 100, protein: 26 / 100 },
  { name: "Camarón", unit: "g", kcal: 99 / 100, protein: 24 / 100 },
  { name: "Jamón de pavo", unit: "g", kcal: 105 / 100, protein: 17 / 100 },
  { name: "Salchicha", unit: "pieza", kcal: 90, protein: 5 },
  { name: "Chorizo", unit: "g", kcal: 350 / 100, protein: 17 / 100 },
  { name: "Milanesa de pollo empanizada", unit: "g", kcal: 220 / 100, protein: 20 / 100 },

  // --- Lácteos ---
  { name: "Leche entera", unit: "ml", kcal: 62 / 100, protein: 3.2 / 100 },
  { name: "Leche light", unit: "ml", kcal: 42 / 100, protein: 3.4 / 100 },
  { name: "Yogur griego natural", unit: "g", kcal: 60 / 100, protein: 10 / 100 },
  { name: "Yogur bebible", unit: "ml", kcal: 70 / 100, protein: 2.5 / 100 },
  { name: "Queso Oaxaca", unit: "g", kcal: 300 / 100, protein: 20 / 100 },
  { name: "Queso crema", unit: "g", kcal: 340 / 100, protein: 6 / 100 },
  { name: "Requesón", unit: "g", kcal: 98 / 100, protein: 11 / 100 },
  { name: "Crema", unit: "g", kcal: 290 / 100, protein: 2 / 100 },

  // --- Granos y carbohidratos ---
  { name: "Arroz cocido", unit: "g", kcal: 130 / 100, protein: 2.7 / 100 },
  { name: "Frijoles refritos", unit: "g", kcal: 130 / 100, protein: 6 / 100 },
  { name: "Pasta cocida", unit: "g", kcal: 158 / 100, protein: 6 / 100 },
  { name: "Avena (cruda)", unit: "g", kcal: 380 / 100, protein: 13 / 100 },
  { name: "Papa cocida", unit: "g", kcal: 87 / 100, protein: 2 / 100 },
  { name: "Papa frita (casera)", unit: "g", kcal: 190 / 100, protein: 3 / 100 },
  { name: "Cereal de caja", unit: "g", kcal: 380 / 100, protein: 7 / 100 },
  { name: "Tortilla de harina", unit: "pieza", kcal: 140, protein: 4 },
  { name: "Pan integral", unit: "rebanada", kcal: 70, protein: 4 },
  { name: "Bolillo", unit: "pieza", kcal: 180, protein: 6 },
  { name: "Pan dulce (concha)", unit: "pieza", kcal: 300, protein: 6 },
  { name: "Tostada", unit: "pieza", kcal: 60, protein: 1 },
  { name: "Hot cake", unit: "pieza", kcal: 90, protein: 3 },

  // --- Verduras ---
  { name: "Brócoli", unit: "g", kcal: 34 / 100, protein: 2.8 / 100 },
  { name: "Zanahoria", unit: "g", kcal: 41 / 100, protein: 0.9 / 100 },
  { name: "Jitomate", unit: "g", kcal: 18 / 100, protein: 0.9 / 100 },
  { name: "Lechuga", unit: "g", kcal: 15 / 100, protein: 1.4 / 100 },
  { name: "Espinaca", unit: "g", kcal: 23 / 100, protein: 2.9 / 100 },
  { name: "Nopal", unit: "g", kcal: 16 / 100, protein: 1.3 / 100 },
  { name: "Calabaza", unit: "g", kcal: 17 / 100, protein: 1.2 / 100 },
  { name: "Pepino", unit: "g", kcal: 15 / 100, protein: 0.7 / 100 },
  { name: "Cebolla", unit: "g", kcal: 40 / 100, protein: 1.1 / 100 },
  { name: "Elote", unit: "g", kcal: 96 / 100, protein: 3.4 / 100 },
  { name: "Champiñones", unit: "g", kcal: 22 / 100, protein: 3.1 / 100 },
  { name: "Ejotes", unit: "g", kcal: 31 / 100, protein: 1.8 / 100 },
  { name: "Aguacate", unit: "g", kcal: 160 / 100, protein: 2 / 100 },

  // --- Frutas ---
  { name: "Manzana", unit: "pieza", kcal: 95, protein: 0.5 },
  { name: "Plátano", unit: "pieza", kcal: 105, protein: 1.3 },
  { name: "Naranja", unit: "pieza", kcal: 62, protein: 1.2 },
  { name: "Mandarina", unit: "pieza", kcal: 40, protein: 0.6 },
  { name: "Mango", unit: "pieza", kcal: 200, protein: 2.8 },
  { name: "Pera", unit: "pieza", kcal: 100, protein: 0.6 },
  { name: "Durazno", unit: "pieza", kcal: 60, protein: 1.4 },
  { name: "Papaya", unit: "g", kcal: 43 / 100, protein: 0.5 / 100 },
  { name: "Sandía", unit: "g", kcal: 30 / 100, protein: 0.6 / 100 },
  { name: "Melón", unit: "g", kcal: 34 / 100, protein: 0.8 / 100 },
  { name: "Fresa", unit: "g", kcal: 32 / 100, protein: 0.7 / 100 },
  { name: "Uva", unit: "g", kcal: 69 / 100, protein: 0.7 / 100 },
  { name: "Piña", unit: "g", kcal: 50 / 100, protein: 0.5 / 100 },

  // --- Grasas y frutos secos ---
  { name: "Aceite (oliva / vegetal)", unit: "cucharada", kcal: 120, protein: 0 },
  { name: "Mantequilla", unit: "cucharada", kcal: 100, protein: 0.1 },
  { name: "Crema de cacahuate", unit: "cucharada", kcal: 95, protein: 4 },
  { name: "Cacahuate", unit: "g", kcal: 567 / 100, protein: 26 / 100 },
  { name: "Almendra", unit: "g", kcal: 579 / 100, protein: 21 / 100 },
  { name: "Nuez", unit: "g", kcal: 654 / 100, protein: 15 / 100 },

  // --- Comida rápida y mexicana ---
  { name: "Taco al pastor", unit: "pieza", kcal: 170, protein: 9 },
  { name: "Taco de carne asada", unit: "pieza", kcal: 150, protein: 10 },
  { name: "Quesadilla", unit: "pieza", kcal: 250, protein: 10 },
  { name: "Sincronizada", unit: "pieza", kcal: 300, protein: 14 },
  { name: "Torta de jamón", unit: "pieza", kcal: 450, protein: 20 },
  { name: "Torta de milanesa", unit: "pieza", kcal: 600, protein: 28 },
  { name: "Hamburguesa sencilla", unit: "pieza", kcal: 300, protein: 15 },
  { name: "Hamburguesa doble", unit: "pieza", kcal: 550, protein: 30 },
  { name: "Hot dog", unit: "pieza", kcal: 290, protein: 10 },
  { name: "Pizza (rebanada)", unit: "rebanada", kcal: 285, protein: 12 },
  { name: "Papas fritas (orden mediana)", unit: "porción", kcal: 380, protein: 4 },
  { name: "Pollo frito (pieza)", unit: "pieza", kcal: 320, protein: 22 },
  { name: "Nuggets de pollo (6)", unit: "porción", kcal: 280, protein: 15 },
  { name: "Burrito", unit: "pieza", kcal: 450, protein: 20 },
  { name: "Enchiladas (3)", unit: "porción", kcal: 400, protein: 15 },
  { name: "Chilaquiles (plato)", unit: "porción", kcal: 450, protein: 15 },
  { name: "Tamal", unit: "pieza", kcal: 250, protein: 5 },
  { name: "Pozole (plato)", unit: "porción", kcal: 300, protein: 20 },
  { name: "Sopa de fideo (plato)", unit: "porción", kcal: 180, protein: 5 },
  { name: "Comida rápida (genérica)", unit: "porción", kcal: 900, protein: 30 },

  // --- Snacks y dulces ---
  { name: "Galleta María", unit: "pieza", kcal: 25, protein: 0.5 },
  { name: "Galleta con chispas", unit: "pieza", kcal: 80, protein: 1 },
  { name: "Chocolate amargo 70% (2 cuadros)", unit: "porción", kcal: 110, protein: 2 },
  { name: "Papas fritas (bolsa 45 g)", unit: "porción", kcal: 240, protein: 3 },
  { name: "Palomitas naturales", unit: "taza", kcal: 30, protein: 1 },
  { name: "Dona", unit: "pieza", kcal: 250, protein: 4 },
  { name: "Barra de granola", unit: "pieza", kcal: 120, protein: 2 },
  { name: "Gelatina", unit: "porción", kcal: 70, protein: 1.5 },
  { name: "Flan", unit: "porción", kcal: 220, protein: 6 },
  { name: "Helado", unit: "g", kcal: 207 / 100, protein: 3.5 / 100 },

  // --- Bebidas ---
  { name: "Coca-Cola normal", unit: "ml", kcal: 42 / 100, protein: 0 },
  { name: "Refresco de sabor", unit: "ml", kcal: 44 / 100, protein: 0 },
  { name: "Coca-Cola Zero / light", unit: "ml", kcal: 0.4 / 100, protein: 0 },
  { name: "Jugo de naranja", unit: "ml", kcal: 45 / 100, protein: 0.7 / 100 },
  { name: "Agua fresca (con azúcar)", unit: "ml", kcal: 40 / 100, protein: 0 },
  { name: "Cerveza", unit: "ml", kcal: 43 / 100, protein: 0.5 / 100 },
  { name: "Café con leche y azúcar", unit: "ml", kcal: 40 / 100, protein: 1.5 / 100 },
  { name: "Café negro", unit: "ml", kcal: 2 / 100, protein: 0 },
  { name: "Leche con chocolate", unit: "ml", kcal: 83 / 100, protein: 3.3 / 100 },
];

// Resultado de búsqueda (catálogo local u Open Food Facts).
export type FoodResult = {
  name: string;
  unit: Food["unit"];
  kcal: number; // por 1 unidad
  protein: number; // por 1 unidad
  source: "local" | "off";
};

// Cantidad inicial sugerida según la unidad.
export function defaultQty(unit: Food["unit"]): number {
  if (unit === "g") return 150;
  if (unit === "ml") return 250;
  return 1;
}
