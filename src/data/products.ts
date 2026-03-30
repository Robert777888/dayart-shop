export interface BaseProduct {
  id: string;
  name: string;
  type: "tshirt" | "sweatshirt";
  color: "black" | "white";
  colorHex: string;
  colorLabel: string;
  price: number;
  sizes: string[];
  material: string;
  fit: string;
  description: string;
}

export const BASE_PRODUCTS: BaseProduct[] = [
  {
    id: "tshirt-black",
    name: "Prémium Póló – Fekete",
    type: "tshirt",
    color: "black",
    colorHex: "#1a1a1a",
    colorLabel: "Fekete",
    price: 8990,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Organikus pamut, 180g/m²",
    fit: "Regular fit",
    description: "Prémium minőségű, 100% organikus pamut alapanyag. A sötét alap tökéletesen kiemeli az AI-tervezett grafikai designokat.",
  },
  {
    id: "tshirt-white",
    name: "Prémium Póló – Fehér",
    type: "tshirt",
    color: "white",
    colorHex: "#FFFFFF",
    colorLabel: "Fehér",
    price: 8990,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Organikus pamut, 180g/m²",
    fit: "Regular fit",
    description: "Hófehér alap, amely minden színes designt ragyogóan mutat. Klasszikus, időtálló választás.",
  },
  {
    id: "sweatshirt-black",
    name: "Prémium Pulóver – Fekete",
    type: "sweatshirt",
    color: "black",
    colorHex: "#1a1a1a",
    colorLabel: "Fekete",
    price: 14990,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "80% Pamut, 20% Poliészter, 320g/m²",
    fit: "Regular fit",
    description: "Vastag, meleg pulóver prémium pamut-poliészter keverékből. Tökéletes őszi-téli egyedi ajándéknak.",
  },
  {
    id: "sweatshirt-white",
    name: "Prémium Pulóver – Fehér",
    type: "sweatshirt",
    color: "white",
    colorHex: "#FFFFFF",
    colorLabel: "Fehér",
    price: 14990,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "80% Pamut, 20% Poliészter, 320g/m²",
    fit: "Regular fit",
    description: "Fehér pulóver, melyen minden egyedi design különleges karakterrel jelenik meg.",
  },
];

export const SHIPPING_INFO = {
  standard: {
    name: "Standard szállítás",
    price: 990,
    days: "3-5 munkanap",
    description: "Magyar Posta / GLS",
  },
  express: {
    name: "Express szállítás",
    price: 1990,
    days: "1-2 munkanap",
    description: "GLS Express (munkanap 14:00-ig leadott rendelés)",
  },
};

export const FREE_SHIPPING_THRESHOLD = 20000;

// ─── Bővített Product típus (ShopGrid + termékoldal) ───────────────────────

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: "tshirt" | "sweatshirt" | "custom" | "limited";
  price: number;
  originalPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  material: string;
  fit: string;
  printArea: string;
  description: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isBestseller?: boolean;
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "tshirt-black",
    name: "Prémium Póló – Fekete",
    category: "tshirt",
    price: 8990,
    colors: [
      { name: "Fekete", hex: "#1a1a1a" },
      { name: "Fehér", hex: "#FFFFFF" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Organikus pamut, 180g/m²",
    fit: "Regular fit",
    printArea: "30 × 35 cm (mellkas)",
    description: "Prémium minőségű, 100% organikus pamut alapanyag. A sötét alap tökéletesen kiemeli az AI-tervezett grafikai designokat.",
    rating: 4.8,
    reviewCount: 124,
    stock: 50,
    isBestseller: true,
    tags: ["póló", "fekete", "organikus", "prémium"],
  },
  {
    id: "tshirt-white",
    name: "Prémium Póló – Fehér",
    category: "tshirt",
    price: 8990,
    colors: [
      { name: "Fehér", hex: "#FFFFFF" },
      { name: "Fekete", hex: "#1a1a1a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Organikus pamut, 180g/m²",
    fit: "Regular fit",
    printArea: "30 × 35 cm (mellkas)",
    description: "Hófehér alap, amely minden színes designt ragyogóan mutat. Klasszikus, időtálló választás.",
    rating: 4.7,
    reviewCount: 98,
    stock: 45,
    isNew: true,
    tags: ["póló", "fehér", "organikus", "prémium"],
  },
  {
    id: "sweatshirt-black",
    name: "Prémium Pulóver – Fekete",
    category: "sweatshirt",
    price: 14990,
    originalPrice: 17990,
    colors: [
      { name: "Fekete", hex: "#1a1a1a" },
      { name: "Fehér", hex: "#FFFFFF" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "80% Pamut, 20% Poliészter, 320g/m²",
    fit: "Regular fit",
    printArea: "30 × 35 cm (mellkas)",
    description: "Vastag, meleg pulóver prémium pamut-poliészter keverékből. Tökéletes őszi-téli egyedi ajándéknak.",
    rating: 4.9,
    reviewCount: 67,
    stock: 18,
    isBestseller: true,
    tags: ["pulóver", "fekete", "meleg", "ajándék"],
  },
  {
    id: "sweatshirt-white",
    name: "Prémium Pulóver – Fehér",
    category: "sweatshirt",
    price: 14990,
    colors: [
      { name: "Fehér", hex: "#FFFFFF" },
      { name: "Fekete", hex: "#1a1a1a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "80% Pamut, 20% Poliészter, 320g/m²",
    fit: "Regular fit",
    printArea: "30 × 35 cm (mellkas)",
    description: "Fehér pulóver, melyen minden egyedi design különleges karakterrel jelenik meg.",
    rating: 4.6,
    reviewCount: 43,
    stock: 30,
    isNew: true,
    tags: ["pulóver", "fehér", "meleg", "prémium"],
  },
  {
    id: "custom-tshirt",
    name: "AI Egyedi Design Póló",
    category: "custom",
    price: 11990,
    colors: [
      { name: "Fekete", hex: "#1a1a1a" },
      { name: "Fehér", hex: "#FFFFFF" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Organikus pamut, 180g/m²",
    fit: "Regular fit",
    printArea: "30 × 35 cm (mellkas)",
    description: "Tervezd meg a saját pólódat AI segítségével! Egyedi minta, amelyet te álmodsz meg.",
    rating: 5.0,
    reviewCount: 12,
    stock: 999,
    isNew: true,
    tags: ["egyedi", "ai", "custom", "ajándék"],
  },
];

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", label: "Összes", icon: "🛍️" },
  { id: "tshirt", label: "Pólók", icon: "👕" },
  { id: "sweatshirt", label: "Pulóverek", icon: "🧥" },
  { id: "custom", label: "AI Design", icon: "✨" },
  { id: "limited", label: "Limitált", icon: "🔥" },
];
