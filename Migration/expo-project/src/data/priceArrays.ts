import { PriceArrays } from '../types/menu.types';

/**
 * Price arrays migrated from Android res/values/arrays.xml
 * All prices are in cents (integers)
 * Arrays correspond to size indices: [mini/small, small/medium, medium/large, large/xlarge, xlarge/crazy]
 */
export const priceArrays: PriceArrays = {
  // Pizza prices
  signature_price: [799, 1399, 1749, 1999, 2399], // Mini, Small, Medium, Large, Crazy
  specialty_price: [699, 1249, 1599, 1849, 2249],
  create_your_own_price: [349, 699, 999, 1199, 1599],

  // Topping prices (by size)
  topping_price_add: [69, 169, 199, 225, 225], // Mini, Small, Medium, Large, Crazy
  topping_price_remove: [0, 0, 0, 0, 0], // Android charges $0 for removing toppings

  // Crust prices
  crust_price: [0, 0, 100], // Original, Thin, Sicilian

  // Sandwich prices (single price per item)
  sandwich_price: [
    799, // Chicken Bacon Ranch
    799, // Italian Sausage
    799, // Gambino Club
    729, // Italian Chicken
    799, // Italian Sub
    729, // Meaty Meatball
    799, // Reuben
    729, // Roast Beef
    699, // Spicy Pepperoni
    699, // Super Ham and Cheese
    699, // Turkey Deluxe
    899, // Super Italian Sub
  ],

  // Appetizer prices (by size: small, medium, large)
  appetizer_small_price: [
    599,  // Buffalo Wings
    599,  // Buffalo Blasters
    399,  // Breadsticks
    599,  // Breadsticks with Cheese
    599,  // Bruschetta
    799,  // Cheese Stick Pizza
    799,  // Italian Cheese Stick Pizza
    399,  // Garlic Bread
    599,  // Garlic Bread with Cheese
    649,  // Mozzarella Sticks
    649,  // Toasted Jalapeño Cheese Ravioli
  ],
  appetizer_medium_price: [
    999,  // Buffalo Wings
    999,  // Buffalo Blasters
    599,  // Breadsticks
    799,  // Breadsticks with Cheese
    0,    // Bruschetta (no medium)
    999,  // Cheese Stick Pizza
    999,  // Italian Cheese Stick Pizza
    599,  // Garlic Bread
    799,  // Garlic Bread with Cheese
    0,    // Mozzarella Sticks (no medium)
    0,    // Toasted Jalapeño Cheese Ravioli (no medium)
  ],
  appetizer_large_price: [
    1699, // Buffalo Wings
    0,    // Buffalo Blasters (no large)
    0,    // Breadsticks (no large)
    0,    // Breadsticks with Cheese (no large)
    0,    // Bruschetta (no large)
    1299, // Cheese Stick Pizza
    1299, // Italian Cheese Stick Pizza
    0,    // Garlic Bread (no large)
    0,    // Garlic Bread with Cheese (no large)
    0,    // Mozzarella Sticks (no large)
    0,    // Toasted Jalapeño Cheese Ravioli (no large)
  ],

  // Pasta prices (Individual vs Family)
  pasta_individual_price: [
    799,  // Spaghetti with Meatballs
    849,  // Deluxe Spaghetti
    799,  // Lasagna
    949,  // Southwest Fettuccini Alfredo
    949,  // California Fettuccini Alfredo
    799,  // Fettuccini Alfredo
    899,  // Chicken Fettuccini Alfredo
    799,  // Tortellini Alfredo
    899,  // Chicken Tortellini Alfredo
    749,  // Manicotti
    799,  // Manicotti with Sliced Italian Sausage
    749,  // Spaghetti
    899,  // Shrimp Fettuccini Alfredo
  ],
  pasta_family_price: [
    2049, // Spaghetti with Meatballs
    2049, // Deluxe Spaghetti
    2049, // Lasagna
    2299, // Southwest Fettuccini Alfredo
    2299, // California Fettuccini Alfredo
    2049, // Fettuccini Alfredo
    2199, // Chicken Fettuccini Alfredo
    2049, // Tortellini Alfredo
    2199, // Chicken Tortellini Alfredo
    1949, // Manicotti
    2049, // Manicotti with Sliced Italian Sausage
    1949, // Spaghetti
    2199, // Shrimp Fettuccini Alfredo
  ],

  // Dessert prices (by size: mini, small, medium, large)
  desert_price: [399, 699, 999, 1299],

  // Normous Cookie price (single size)
  cookie_price: 999,

  // Calzone prices (Personal, Large)
  calzone_price: [899, 1499],

  // Salad prices
  salad_price: [299, 799], // Garden Salad, Italian Salad
};

/**
 * Available toppings list
 * Migrated from Android res/values/arrays.xml
 */
export const availableToppings = [
  'Pepperoni',
  'Beef',
  'Pork Sausage',
  'Italian Sausage',
  'Sliced Italian Sausage',
  'Shrimp',
  'Fresh Tomato',
  'Mushroom',
  'White Onion',
  'Red Onion',
  'Green Pepper',
  'Jalapeno',
  'Pepperoncini Pepper',
  'Meatballs',
  'Italian Chicken',
  'Roasted Red Pepper',
  'Black Olive',
  'Real Bacon Pieces',
  'Canadian Bacon',
  'Salami',
  'Green Olive',
  'Pineapple',
  'Sauerkraut',
  'Spinach',
  'Extra Cheese',
  'Extra Dressing',
];

/**
 * Crust types
 * Migrated from Android res/values/arrays.xml
 */
export const crustTypes = [
  'Original Crust',
  'Thin Crust',
  'Sicilian Crust',
];

/**
 * Size arrays for different categories
 */
export const sizeArrays = {
  pizza: ['Mini 7"', 'Small 10"', 'Medium 12"', 'Large 14"', 'Crazy 18"'],
  appetizer_large: ['Small', 'Medium', 'Large'],
  appetizer_medium: ['Small', 'Large'],
  appetizer_small: ['Single'],
  pasta: ['Individual (4)', 'Family (8)'],
  desert: ['Mini', 'Small', 'Medium', 'Large'],
  sandwich: ['Regular'], // Sandwiches have only one size
  salad: ['Regular'], // Salads have only one size
};
