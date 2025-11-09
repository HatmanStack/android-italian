import { MenuItem, MenuCategory } from '../types/menu.types';

/**
 * Pizza menu items
 * Migrated from Android ItemLists.java
 */
export const pizzaItems: MenuItem[] = [
  {
    id: 'pizza-mobster',
    title: 'Mobster',
    description: 'Beef, Pork Sausage, Mushroom, Pepperoni, Italian Sausage, Green Pepper, Onion, Black Olive, Canadian Style Bacon, Salami, and Extra Cheese.',
    image: require('../../assets/images/menu/mobster.png'),
    category: MenuCategory.PIZZA,
    position: 0,
  },
  {
    id: 'pizza-taco',
    title: 'TACO',
    description: 'Beef, Onion, Cheese Blend, Lettuce, Refried Beans, Fresh Tomato, and Taco Sauce.',
    image: require('../../assets/images/menu/taco.png'),
    category: MenuCategory.PIZZA,
    position: 1,
  },
  {
    id: 'pizza-chicken-teriyaki',
    title: 'Chicken Teriyaki',
    description: 'Teriyaki Sauce, Chicken, Onion, Green Pepper, Pineapple, Cheese Blend, and Real Bacon Pieces.',
    image: require('../../assets/images/menu/teriyaki.png'),
    category: MenuCategory.PIZZA,
    position: 2,
  },
  {
    id: 'pizza-alfredo',
    title: 'The Alfredo Pizza',
    description: 'Alfredo Sauce with Cheese Blend, and your choice of three toppings.',
    image: require('../../assets/images/menu/alfredo.png'),
    category: MenuCategory.PIZZA,
    position: 3,
  },
  {
    id: 'pizza-chicken-alfredo',
    title: 'Chicken Alfredo',
    description: 'Alfredo Sauce, Chicken, Mushroom, Real Bacon Pieces, and Cheese Blend.',
    image: require('../../assets/images/menu/chickenalfredo.png'),
    category: MenuCategory.PIZZA,
    position: 4,
  },
  {
    id: 'pizza-southwest-chicken-alfredo',
    title: 'Southwest Chicken Alfredo',
    description: 'Alfredo Sauce, Chicken, Onion, Cheese Blend, and Roasted Red Pepper.',
    image: require('../../assets/images/menu/southwestchickenalfredo.png'),
    category: MenuCategory.PIZZA,
    position: 5,
  },
  {
    id: 'pizza-deluxe',
    title: 'Deluxe',
    description: 'Beef, Pork Sausage, Mushroom, Pepperoni, Green Pepper, Mozzarella Cheese, and Onion.',
    image: require('../../assets/images/menu/deluxe.png'),
    category: MenuCategory.PIZZA,
    position: 6,
  },
  {
    id: 'pizza-bacon-cheeseburger',
    title: 'Bacon Cheeseburger',
    description: 'Beef, Real Bacon Pieces, Onion, Cheese Blend.',
    image: require('../../assets/images/menu/baconcheeseburger.png'),
    category: MenuCategory.PIZZA,
    position: 7,
  },
  {
    id: 'pizza-meat-cravers',
    title: 'Meat Cravers',
    description: 'Beef, Pork Sausage, Pepperoni, Canadian Style Bacon, Real Bacon Pieces, Italian Sausage, Salami, and Mozzarella Cheese.',
    image: require('../../assets/images/menu/meatcravers.png'),
    category: MenuCategory.PIZZA,
    position: 8,
  },
  {
    id: 'pizza-bbq',
    title: 'BBQ',
    description: 'Choice of Roast Beef or Chicken, BBQ Sauce, Onion, and Cheese Blend.',
    image: require('../../assets/images/menu/bbq.png'),
    category: MenuCategory.PIZZA,
    position: 9,
  },
  {
    id: 'pizza-veggie-cravers',
    title: 'Veggie Cravers',
    description: 'Mushroom, Green Pepper, Onion, Fresh Tomato, Mozzarella Cheese, and Black Olive.',
    image: require('../../assets/images/menu/veggie.png'),
    category: MenuCategory.PIZZA,
    position: 10,
  },
  {
    id: 'pizza-pepperoni-cravers',
    title: 'Pepperoni Cravers',
    description: 'Extra Pepperoni and Extra Mozzarella Cheese.',
    image: require('../../assets/images/menu/pepperonicravers.png'),
    category: MenuCategory.PIZZA,
    position: 11,
  },
  {
    id: 'pizza-german-pie',
    title: 'German Pie',
    description: 'Canadian Style Bacon, Sauerkraut, and Mozzarella Cheese. Some stores may add Sliced Italian Sausage and Onion.',
    image: require('../../assets/images/menu/german.png'),
    category: MenuCategory.PIZZA,
    position: 12,
  },
  {
    id: 'pizza-hawaiian-pie',
    title: 'Hawaiian Pie',
    description: 'Canadian Style Bacon, Pineapple, and Mozzarella Cheese.',
    image: require('../../assets/images/menu/hawaiian.png'),
    category: MenuCategory.PIZZA,
    position: 13,
  },
  {
    id: 'pizza-capone',
    title: 'Capone',
    description: 'Beef, Italian Sausage, Pepperoni, Onion, Jalapeno, and Mozzarella.',
    image: require('../../assets/images/menu/capone.png'),
    category: MenuCategory.PIZZA,
    position: 14,
  },
  {
    id: 'pizza-polynesian',
    title: 'Polynesian',
    description: 'Canadian Style Bacon, Pineapple, Green Pepper, Fresh Tomato, Real Bacon Pieces, and Cheese Blend.',
    image: require('../../assets/images/menu/polynesian.png'),
    category: MenuCategory.PIZZA,
    position: 15,
  },
  {
    id: 'pizza-buffalo-wing',
    title: 'Buffalo Wing',
    description: 'Wing Sauce, Chicken, Onion, Green Pepper, Real Bacon Pieces, and Cheese Blend.',
    image: require('../../assets/images/menu/buffalowing.png'),
    category: MenuCategory.PIZZA,
    position: 16,
  },
  {
    id: 'pizza-chicken-bacon-ranch',
    title: 'Chicken Bacon Ranch',
    description: 'Ranch Dressing, Chicken, Real Bacon Pieces, Cheese Blend.',
    image: require('../../assets/images/menu/chickenbaconranch.png'),
    category: MenuCategory.PIZZA,
    position: 17,
  },
  {
    id: 'pizza-classic-italian',
    title: 'Classic Italian',
    description: 'Pepperoni, Italian Sausage, Salami, Pepperoncini Pepper, Onion, Cheese Blend, and Italian Spices.',
    image: require('../../assets/images/menu/classicitalian.png'),
    category: MenuCategory.PIZZA,
    position: 18,
  },
  {
    id: 'pizza-sausage-cravers',
    title: 'Sausage Cravers',
    description: 'Pork Sausage, Italian Sausage, Sliced Italian Sausage, and Mozzarella Cheese.',
    image: require('../../assets/images/menu/sausagecravers.png'),
    category: MenuCategory.PIZZA,
    position: 19,
  },
  {
    id: 'pizza-meatball-pie',
    title: 'Meatball Pie',
    description: 'Marinara Sauce, Meatballs, Onion, Green Pepper, Mozzarella Cheese.',
    image: require('../../assets/images/menu/meatballpie.png'),
    category: MenuCategory.PIZZA,
    position: 20,
  },
  {
    id: 'pizza-create-your-own',
    title: 'Create Your Own',
    description: 'Your choice toppings.',
    image: require('../../assets/images/menu/alfredo.png'),
    category: MenuCategory.PIZZA,
    position: 21,
  },
  {
    id: 'pizza-calzone',
    title: 'Calzone',
    description: 'Our Pizza Dough folded and stuffed with Creamy Italian Sauce, Blended Cheeses and your choice of any 3 Pizza Toppings.',
    image: require('../../assets/images/menu/calzone.png'),
    category: MenuCategory.PIZZA,
    position: 22,
  },
];

/**
 * Sandwich menu items
 * Migrated from Android ItemLists.java
 */
export const sandwichItems: MenuItem[] = [
  {
    id: 'sandwich-chicken-bacon-ranch',
    title: 'Chicken Bacon Ranch',
    description: 'Chicken, Real Bacon Pieces, Cheese Blend, Lettuce, Tomato and Ranch Dressing.',
    image: require('../../assets/images/menu/sandchickenbaconranch.png'),
    category: MenuCategory.SANDWICHES,
    position: 0,
  },
  {
    id: 'sandwich-italian-sausage',
    title: 'Italian Sausage',
    description: 'Sliced Italian Sausage, Marinara Sauce, Green Pepper, Onion, and Mozzarella Cheese.',
    image: require('../../assets/images/menu/sanditaliansausage.png'),
    category: MenuCategory.SANDWICHES,
    position: 1,
  },
  {
    id: 'sandwich-gambino-club',
    title: 'Gambino Club',
    description: 'Ham, Turkey, Bacon, Mozzarella Cheese, Lettuce, Tomato, and Mayo.',
    image: require('../../assets/images/menu/sandgambinosclub.png'),
    category: MenuCategory.SANDWICHES,
    position: 2,
  },
  {
    id: 'sandwich-italian-chicken',
    title: 'Italian Chicken',
    description: 'Chicken, Mozzarella Cheese, Lettuce, Tomato, and Italian Dressing.',
    image: require('../../assets/images/menu/sanditalianchicken.png'),
    category: MenuCategory.SANDWICHES,
    position: 3,
  },
  {
    id: 'sandwich-italian-sub',
    title: 'Italian Sub',
    description: 'Ham, Salami, Pepperoni, Mozzarella Cheese, Lettuce, Tomato, and Italian Dressing.',
    image: require('../../assets/images/menu/sanditaliansub.png'),
    category: MenuCategory.SANDWICHES,
    position: 4,
  },
  {
    id: 'sandwich-meaty-meatball',
    title: 'Meaty Meatball',
    description: 'Meatballs, Marinara Sauce, and Mozzarella Cheese.',
    image: require('../../assets/images/menu/sandmeatymeatball.png'),
    category: MenuCategory.SANDWICHES,
    position: 5,
  },
  {
    id: 'sandwich-reuben',
    title: 'Reuben',
    description: 'Marble Rye, Corned Beef, Swiss American Cheese, Sauerkraut, and 1000 Island Dressing.',
    image: require('../../assets/images/menu/sandreuben.png'),
    category: MenuCategory.SANDWICHES,
    position: 6,
  },
  {
    id: 'sandwich-roast-beef',
    title: 'Roast Beef',
    description: 'Roast Beef, Cheese Blend, Lettuce, Tomato, and Mayo.',
    image: require('../../assets/images/menu/sandroastbeef.png'),
    category: MenuCategory.SANDWICHES,
    position: 7,
  },
  {
    id: 'sandwich-spicy-pepperoni',
    title: 'Spicy Pepperoni',
    description: 'Pepperoni, Mozzarella Cheese, Lettuce, Tomato, and Italian Dressing.',
    image: require('../../assets/images/menu/sandspicypepperoni.png'),
    category: MenuCategory.SANDWICHES,
    position: 8,
  },
  {
    id: 'sandwich-super-ham-and-cheese',
    title: 'Super Ham and Cheese',
    description: 'Ham, Mozzarella Cheese, Lettuce, Tomato, and Italian Dressing.',
    image: require('../../assets/images/menu/sandsuperhamandcheese.png'),
    category: MenuCategory.SANDWICHES,
    position: 9,
  },
  {
    id: 'sandwich-turkey-deluxe',
    title: 'Turkey Deluxe',
    description: 'Turkey, Mozzarella Cheese, Lettuce, Tomato, and Mayo.',
    image: require('../../assets/images/menu/sandturkeydeluxe.png'),
    category: MenuCategory.SANDWICHES,
    position: 10,
  },
  {
    id: 'sandwich-super-italian-sub',
    title: 'Super Italian Sub',
    description: 'Italian Sausage, Ham, Salami, Onion, Green Pepper, Pepperoni, Mozzarella, Lettuce, Tomato, Jalapenos, Italian Dressing.',
    image: require('../../assets/images/menu/sandsuperitaliansub.png'),
    category: MenuCategory.SANDWICHES,
    position: 11,
  },
];

/**
 * Pasta menu items
 * Migrated from Android ItemLists.java
 */
export const pastaItems: MenuItem[] = [
  {
    id: 'pasta-spaghetti-with-meatballs',
    title: 'Spaghetti with Meatballs',
    description: 'Spaghetti with Meatballs',
    image: require('../../assets/images/menu/pastaspaghettiwmeatballs.png'),
    category: MenuCategory.PASTA,
    position: 0,
  },
  {
    id: 'pasta-deluxe-spaghetti',
    title: 'Deluxe Spaghetti',
    description: 'Beef, Sausage, Pepperoni, Mushroom, Onion, and Green Pepper.',
    image: require('../../assets/images/menu/pastadeluxespaghetti.png'),
    category: MenuCategory.PASTA,
    position: 1,
  },
  {
    id: 'pasta-lasagna',
    title: 'Lasagna',
    description: 'Lasagna',
    image: require('../../assets/images/menu/pastalasagna.png'),
    category: MenuCategory.PASTA,
    position: 2,
  },
  {
    id: 'pasta-southwest-fettuccini-alfredo',
    title: 'Southwest Fettuccini Alfredo',
    description: 'Chicken, Onion, and Roasted Red Pepper.',
    image: require('../../assets/images/menu/pastasouthwestalfredo.png'),
    category: MenuCategory.PASTA,
    position: 3,
  },
  {
    id: 'pasta-california-fettuccini-alfredo',
    title: 'California Fettuccini Alfredo',
    description: 'Chicken, Mushroom, Fresh Tomato, and Real Bacon Pieces.',
    image: require('../../assets/images/menu/pastacaliforniaalfredo.png'),
    category: MenuCategory.PASTA,
    position: 4,
  },
  {
    id: 'pasta-fettuccini-alfredo',
    title: 'Fettuccini Alfredo',
    description: 'Fettuccini Alfredo',
    image: require('../../assets/images/menu/pastafettuccinialfredo.png'),
    category: MenuCategory.PASTA,
    position: 5,
  },
  {
    id: 'pasta-chicken-fettuccini-alfredo',
    title: 'Chicken Fettuccini Alfredo',
    description: 'Chicken Fettuccini Alfredo',
    image: require('../../assets/images/menu/pastachickenfettuccinialfredo.png'),
    category: MenuCategory.PASTA,
    position: 6,
  },
  {
    id: 'pasta-tortellini-alfredo',
    title: 'Tortellini Alfredo',
    description: 'Tortellini Alfredo',
    image: require('../../assets/images/menu/pastatortellinialfredo.png'),
    category: MenuCategory.PASTA,
    position: 7,
  },
  {
    id: 'pasta-chicken-tortellini-alfredo',
    title: 'Chicken Tortellini Alfredo',
    description: 'Chicken Tortellini Alfredo',
    image: require('../../assets/images/menu/pastachickenrortellinialfredo.png'),
    category: MenuCategory.PASTA,
    position: 8,
  },
  {
    id: 'pasta-manicotti',
    title: 'Manicotti',
    description: 'Manicotti',
    image: require('../../assets/images/menu/pastamanicotti.png'),
    category: MenuCategory.PASTA,
    position: 9,
  },
  {
    id: 'pasta-manicotti-with-sausage',
    title: 'Manicotti with Sliced Italian Sausage',
    description: 'Manicotti with Sliced Italian Sausage',
    image: require('../../assets/images/menu/pastamanicottiwsausage.png'),
    category: MenuCategory.PASTA,
    position: 10,
  },
  {
    id: 'pasta-spaghetti',
    title: 'Spaghetti',
    description: 'Spaghetti',
    image: require('../../assets/images/menu/pastaspaghetti.png'),
    category: MenuCategory.PASTA,
    position: 11,
  },
  {
    id: 'pasta-shrimp-fettuccini-alfredo',
    title: 'Shrimp Fettuccini Alfredo',
    description: 'Shrimp Fettuccini Alfredo',
    image: require('../../assets/images/menu/pastashrimpalfredo.png'),
    category: MenuCategory.PASTA,
    position: 12,
  },
];

/**
 * Appetizer menu items
 * Migrated from Android ItemLists.java
 */
export const appetizerItems: MenuItem[] = [
  {
    id: 'appetizer-buffalo-wings',
    title: 'Buffalo Wings',
    description: 'Bone-In, Buffalo-Style Chicken Wings tossed with your choice of sauce. Available in Hot, Teriyaki, BBQ, Ranch, Parmesan Garlic or Oven Roasted.',
    image: require('../../assets/images/menu/appwings.png'),
    category: MenuCategory.APPETIZERS,
    position: 0,
  },
  {
    id: 'appetizer-buffalo-blasters',
    title: 'Buffalo Blasters',
    description: 'Boneless Wings made with all white meat chicken. Choose from Hot, Teriyaki, BBQ, Ranch, Parmesan Garlic or Oven Roasted.',
    image: require('../../assets/images/menu/appblasters.png'),
    category: MenuCategory.APPETIZERS,
    position: 1,
  },
  {
    id: 'appetizer-breadsticks',
    title: 'Breadsticks',
    description: 'With Marinara',
    image: require('../../assets/images/menu/appbreadsticks.png'),
    category: MenuCategory.APPETIZERS,
    position: 2,
  },
  {
    id: 'appetizer-breadsticks-with-cheese',
    title: 'Breadsticks with Cheese',
    description: 'With Marinara',
    image: require('../../assets/images/menu/appbreadstickswcheese.png'),
    category: MenuCategory.APPETIZERS,
    position: 3,
  },
  {
    id: 'appetizer-bruschetta',
    title: 'Bruschetta',
    description: 'Fresh Tomato, Onion, Mozzarella Cheese, and Italian Spices, toasted on Garlic Bread.',
    image: require('../../assets/images/menu/appbruschetta.png'),
    category: MenuCategory.APPETIZERS,
    position: 4,
  },
  {
    id: 'appetizer-cheese-stick-pizza',
    title: 'Cheese Stick Pizza',
    description: 'Pizza Dough covered in Garlic Butter, Blended Cheeses and Italian Spices. Served with a side of Marinara.',
    image: require('../../assets/images/menu/appcheesesticks.png'),
    category: MenuCategory.APPETIZERS,
    position: 5,
  },
  {
    id: 'appetizer-italian-cheese-stick-pizza',
    title: 'Italian Cheese Stick Pizza',
    description: 'Our original Cheese Stick Pizza combined with Creamy Italian Sauce. Served with a side of Marinara.',
    image: require('../../assets/images/menu/appcheesesticks.png'),
    category: MenuCategory.APPETIZERS,
    position: 6,
  },
  {
    id: 'appetizer-garlic-bread',
    title: 'Garlic Bread',
    description: 'Garlic Bread',
    image: require('../../assets/images/menu/appgarlicbread.png'),
    category: MenuCategory.APPETIZERS,
    position: 7,
  },
  {
    id: 'appetizer-garlic-bread-with-cheese',
    title: 'Garlic Bread with Cheese',
    description: 'Garlic Bread with Cheese',
    image: require('../../assets/images/menu/appgarlicbreadwcheese.png'),
    category: MenuCategory.APPETIZERS,
    position: 8,
  },
  {
    id: 'appetizer-mozzarella-sticks',
    title: 'Mozzarella Sticks',
    description: 'With Marinara',
    image: require('../../assets/images/menu/appmozzarellasticks.png'),
    category: MenuCategory.APPETIZERS,
    position: 9,
  },
  {
    id: 'appetizer-toasted-jalapeno-cheese-ravioli',
    title: 'Toasted Jalapeño Cheese Ravioli',
    description: 'Served with Ranch Dressing',
    image: require('../../assets/images/menu/appravioli.png'),
    category: MenuCategory.APPETIZERS,
    position: 10,
  },
];

/**
 * Dessert menu items
 * Migrated from Android ItemLists.java
 */
export const dessertItems: MenuItem[] = [
  {
    id: 'dessert-dutch-apple',
    title: 'Dutch Apple',
    description: 'Dutch Apple',
    image: require('../../assets/images/menu/desertapple.png'),
    category: MenuCategory.DESSERTS,
    position: 0,
  },
  {
    id: 'dessert-very-cherry',
    title: 'Very Cherry',
    description: 'Very Cherry',
    image: require('../../assets/images/menu/desertcherry.png'),
    category: MenuCategory.DESSERTS,
    position: 1,
  },
  {
    id: 'dessert-cinnamon-streusel',
    title: 'Cinnamon Streusel',
    description: 'Cinnamon Streusel',
    image: require('../../assets/images/menu/desertcinnamon.png'),
    category: MenuCategory.DESSERTS,
    position: 2,
  },
  {
    id: 'dessert-normous-cookie',
    title: 'Normous Chocolate Chip Cookie',
    description: 'Normous Chocolate Chip Cookie',
    image: require('../../assets/images/menu/desertnormouscookie.png'),
    category: MenuCategory.DESSERTS,
    position: 3,
  },
  {
    id: 'dessert-heart-shaped',
    title: 'Heart Shaped',
    description: 'Any pizza may be ordered in the heart shape.',
    image: require('../../assets/images/menu/desertcherryheart.png'),
    category: MenuCategory.DESSERTS,
    position: 4,
  },
];

/**
 * Salad menu items
 * Migrated from Android ItemLists.java
 */
export const saladItems: MenuItem[] = [
  {
    id: 'salad-garden',
    title: 'Garden Salad',
    description: 'Garden Salad',
    image: require('../../assets/images/menu/saladgarden.png'),
    category: MenuCategory.SALADS,
    position: 0,
  },
  {
    id: 'salad-italian',
    title: 'Italian Salad',
    description: 'Italian Salad',
    image: require('../../assets/images/menu/saladitalian.png'),
    category: MenuCategory.SALADS,
    position: 1,
  },
];

/**
 * Get all menu items for a specific category
 */
export function getMenuItemsByCategory(category: MenuCategory): MenuItem[] {
  switch (category) {
    case MenuCategory.PIZZA:
      return pizzaItems;
    case MenuCategory.SANDWICHES:
      return sandwichItems;
    case MenuCategory.PASTA:
      return pastaItems;
    case MenuCategory.APPETIZERS:
      return appetizerItems;
    case MenuCategory.DESSERTS:
      return dessertItems;
    case MenuCategory.SALADS:
      return saladItems;
    default:
      return [];
  }
}

/**
 * Get all menu items across all categories
 */
export function getAllMenuItems(): MenuItem[] {
  return [
    ...pizzaItems,
    ...sandwichItems,
    ...pastaItems,
    ...appetizerItems,
    ...dessertItems,
    ...saladItems,
  ];
}

/**
 * Get a menu item by ID
 */
export function getMenuItemById(id: string): MenuItem | undefined {
  return getAllMenuItems().find((item) => item.id === id);
}
