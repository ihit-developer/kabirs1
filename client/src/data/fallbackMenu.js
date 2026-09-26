// Static fallback menu data
export const FALLBACK_MENU = [
  // BBQ
  { id: 1,  name: "Chicken Tikka",        category: "BBQ",       price: 450,  description: "Tender chicken marinated in spices, grilled to perfection",      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80" },
  { id: 2,  name: "Chicken Boti",          category: "BBQ",       price: 550,  description: "Juicy boneless chicken pieces marinated in yogurt & spices",      image: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=500&q=80" },
  { id: 3,  name: "Malai Boti",            category: "BBQ",       price: 650,  description: "Creamy, melt-in-mouth chicken boti with a rich malai coating",    image: "https://images.unsplash.com/photo-1633237308525-cd587cf71926?w=500&q=80" },
  { id: 4,  name: "Seekh Kebab",           category: "BBQ",       price: 400,  description: "Spiced minced meat kebabs grilled on skewers over charcoal",     image: "https://images.unsplash.com/photo-1602273660127-a0000560a4c4?w=500&q=80" },
  { id: 5,  name: "Reshmi Kebab",          category: "BBQ",       price: 500,  description: "Silky smooth chicken kebabs with cream and cashew marinade",      image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=500&q=80" },
  { id: 6,  name: "Chapli Kebab",          category: "BBQ",       price: 350,  description: "Peshawar-style flat minced beef kebabs with pomegranate seeds",   image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&q=80" },
  { id: 7,  name: "Lamb Chops",            category: "BBQ",       price: 950,  description: "Premium lamb chops marinated overnight, grilled over live coals", image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&q=80" },
  { id: 8,  name: "Mixed BBQ Platter",     category: "BBQ",       price: 1800, description: "A feast of tikka, boti, seekh kebab & naan for two",             image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80" },

  // Fast Food
  { id: 9,  name: "Zinger Burger",         category: "Fast Food", price: 550,  description: "Crispy spiced chicken fillet with lettuce & special sauce",      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
  { id: 10, name: "Beef Burger",           category: "Fast Food", price: 650,  description: "Juicy beef patty with cheese, tomato, onion & pickles",          image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80" },
  { id: 11, name: "Crispy Chicken Burger", category: "Fast Food", price: 600,  description: "Double-fried crispy chicken with coleslaw & mayo",               image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80" },
  { id: 12, name: "Club Sandwich",         category: "Fast Food", price: 450,  description: "Triple-decker with chicken, egg, lettuce, tomato & mayo",        image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&q=80" },
  { id: 13, name: "Chicken Shawarma",      category: "Fast Food", price: 350,  description: "Marinated chicken wrapped in flatbread with garlic sauce",       image: "https://images.unsplash.com/photo-1561050501-b6afdb57b0a8?w=500&q=80" },
  { id: 14, name: "French Fries",          category: "Fast Food", price: 250,  description: "Golden crispy fries seasoned with our secret spice blend",       image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80" },
  { id: 15, name: "Loaded Fries",          category: "Fast Food", price: 400,  description: "Fries topped with cheese sauce, jalapeños & crispy chicken bits",image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&q=80" },
  { id: 16, name: "Chicken Nuggets (8pc)", category: "Fast Food", price: 450,  description: "Tender chicken nuggets with sweet chilli dipping sauce",         image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80" },

  // Pizza
  { id: 17, name: "Margherita Pizza (S)",  category: "Pizza",     price: 850,  description: "Classic tomato sauce, fresh mozzarella & basil",                 image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80" },
  { id: 18, name: "Margherita Pizza (M)",  category: "Pizza",     price: 1300, description: "Classic tomato sauce, fresh mozzarella & basil",                 image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80" },
  { id: 19, name: "Margherita Pizza (L)",  category: "Pizza",     price: 1800, description: "Classic tomato sauce, fresh mozzarella & basil",                 image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80" },
  { id: 20, name: "BBQ Chicken Pizza (S)", category: "Pizza",     price: 950,  description: "Smoky BBQ sauce, grilled chicken, onions & peppers",             image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80" },
  { id: 21, name: "BBQ Chicken Pizza (M)", category: "Pizza",     price: 1450, description: "Smoky BBQ sauce, grilled chicken, onions & peppers",             image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80" },
  { id: 22, name: "BBQ Chicken Pizza (L)", category: "Pizza",     price: 1950, description: "Smoky BBQ sauce, grilled chicken, onions & peppers",             image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80" },
  { id: 23, name: "Beef & Jalapeño Pizza", category: "Pizza",     price: 1600, description: "Spicy beef mince, jalapeños, onions on a rich tomato base",      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80" },
  { id: 24, name: "Veggie Supreme Pizza",  category: "Pizza",     price: 1200, description: "Bell peppers, mushrooms, olives, corn & mozzarella",             image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=80" },

  // Chinese
  { id: 25, name: "Chicken Manchurian",    category: "Chinese",   price: 850,  description: "Crispy chicken in a tangy Manchurian sauce with spring onions",  image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&q=80" },
  { id: 26, name: "Chicken Chow Mein",     category: "Chinese",   price: 750,  description: "Stir-fried noodles with chicken, cabbage, carrots & soy sauce",  image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80" },
  { id: 27, name: "Vegetable Fried Rice",  category: "Chinese",   price: 550,  description: "Wok-tossed rice with seasonal vegetables & soy sauce",           image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80" },
  { id: 28, name: "Chicken Fried Rice",    category: "Chinese",   price: 700,  description: "Fragrant fried rice with shredded chicken & egg",                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80" },
  { id: 29, name: "Sweet & Sour Chicken",  category: "Chinese",   price: 900,  description: "Battered chicken in a vibrant sweet & sour pineapple sauce",    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&q=80" },
  { id: 30, name: "Spring Rolls (4pc)",    category: "Chinese",   price: 400,  description: "Crispy golden rolls stuffed with vegetables & glass noodles",    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80" },
  { id: 31, name: "Beef Noodle Soup",      category: "Chinese",   price: 800,  description: "Rich broth with tender beef slices, bok choy & egg noodles",    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80" },

  // Desi/Pakistani
  { id: 32, name: "Chicken Karahi",        category: "Desi",      price: 1200, description: "Slow-cooked chicken in a spiced tomato-based karahi gravy",      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80" },
  { id: 33, name: "Mutton Karahi",         category: "Desi",      price: 1800, description: "Tender mutton cooked in a rich, aromatic karahi masala",         image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80" },
  { id: 34, name: "Dal Makhani",           category: "Desi",      price: 550,  description: "Creamy black lentils slow-cooked with butter & spices",          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80" },
  { id: 35, name: "Biryani (Chicken)",     category: "Desi",      price: 750,  description: "Fragrant basmati rice layered with spiced chicken & fried onion",image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80" },
  { id: 36, name: "Biryani (Mutton)",      category: "Desi",      price: 950,  description: "Aromatic basmati with slow-cooked mutton & whole spices",        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80" },
  { id: 37, name: "Naan (Plain)",          category: "Desi",      price: 60,   description: "Soft, pillowy naan baked fresh in our clay oven",                image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&q=80" },
  { id: 38, name: "Naan (Butter)",         category: "Desi",      price: 80,   description: "Freshly baked naan generously brushed with real butter",         image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&q=80" },
  { id: 39, name: "Raita",                 category: "Desi",      price: 120,  description: "Cooling yogurt with cucumber, mint & a hint of cumin",           image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80" },

  // Desserts
  { id: 40, name: "Gulab Jamun (4pc)",     category: "Desserts",  price: 250,  description: "Soft milk-solid balls soaked in rose-flavoured sugar syrup",     image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80" },
  { id: 41, name: "Kheer",                 category: "Desserts",  price: 220,  description: "Creamy rice pudding with cardamom, saffron & crushed almonds",   image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&q=80" },
  { id: 42, name: "Chocolate Brownie",     category: "Desserts",  price: 300,  description: "Warm fudgy brownie served with a scoop of vanilla ice cream",    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80" },
  { id: 43, name: "Kulfi (Mango)",         category: "Desserts",  price: 200,  description: "Traditional Pakistani ice cream with real mango pulp",           image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&q=80" },

  // Drinks
  { id: 44, name: "Pepsi",                 category: "Drinks",    price: 120,  description: "Chilled Pepsi can",                                              image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&q=80" },
  { id: 45, name: "Coca-Cola",             category: "Drinks",    price: 120,  description: "Ice cold Coca-Cola can",                                         image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80" },
  { id: 46, name: "Mineral Water",         category: "Drinks",    price: 80,   description: "Fresh chilled mineral water bottle",                             image: "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=500&q=80" },
  { id: 47, name: "Mango Lassi",           category: "Drinks",    price: 220,  description: "Thick, creamy yogurt drink blended with fresh Chaunsa mango",   image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&q=80" },
  { id: 48, name: "Fresh Lemonade",        category: "Drinks",    price: 180,  description: "Freshly squeezed lemon juice with mint & a pinch of salt",      image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&q=80" },
  { id: 49, name: "Rooh Afza Sharbat",     category: "Drinks",    price: 150,  description: "Classic rose-flavoured Rooh Afza mixed with chilled milk",      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80" },
  { id: 50, name: "Green Tea",             category: "Drinks",    price: 130,  description: "Soothing green tea with honey & lemon",                          image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80" },
];
