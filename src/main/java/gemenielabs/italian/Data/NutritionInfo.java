package gemenielabs.italian.Data;



import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class NutritionInfo {

    public static ArrayList<String> nutritionInfoArray = new ArrayList<>();
    public static ArrayList<String> addOns = new ArrayList<>();

    public void NutritionInfo(){}

    public void loadNutritionInformation() {
        String nutritionData = "Cheese 260 60 7 3.5 0 15 420 36 1 2 12 Beef 280 70 8 4 0 15 610 37 2 3 15 Pork 300 90 10 4.5 0 20 630 37 2 3 15" +
                " Italian 320 100 12 5 0 25 620 37 2 2 15 Sliced Italian Sausage 330 110 12 5 0 30 690 37 2 2 16 Pepperoni 280 80 9 4.5 0 20 510 36 1 2 13" +
                " Mobster 370 130 15 7 0 30 920 39 2 3 20 Deluxe 310 90 10 4.5 0 20 690 38 2 3 16 Hawaiian Pie 280 60 7 3.5 0 15 570 39 2 5 15" +
                " Meatball Pie 320 100 11 5 0 30 590 38 2 2 16 Taco 320 90 9 5 0 10 790 42 3 4 17 Veggie Cravers 270 70 8 3.5 0 15 490 38 2 3 13" +
                " Pepperoni Cravers 320 100 12 6 0 25 600 36 1 2 16 Meat Cravers 350 130 14 6 0 30 880 38 2 3 18 Sausage Cravers 360 130 15 6 0 30 830 38 2 3 18" +
                " German Pie 300 80 9 4 0 20 790 38 2 3 16 Capone 310 90 11 5 0 20 810 38 2 3 15 Polynesian 290 80 8 5 0 15 560 39 2 5 15" +
                " Polynesian 290 80 8 5 0 15 560 39 2 5 15 Bacon Cheeseburger 300 90 10 6 0 15 670 37 2 3 16 BBQ Chicken Pizza 320 70 7 4.5 0 15 860 49 1 10 15" +
                " BBQ 280 70 7 4.5 0 15 610 41 1 5 14 Chicken Teriyaki 300 80 8 5 0 20 1100 40 1 5 17 Classic Italian 310 110 12 6 0 20 810 36 2 2 15" +
                " Buffalo Wing Pizza 320 120 13 6 0 25 690 37 1 3 16 Chicken Bacon Ranch 350 140 16 6 0 25 680 36 1 2 16 Chicken Alfredo 330 120 13 8 0 40 670 36 1 2 17" +
                " The Alfredo Pizza 0 0 0 0 0 0 0 0 0 0 0 Garden Alfredo 300 110 12 7 0 25 470 36 2 2 13 Meaty Alfredo 350 140 16 8 0 35 640 36 1 2 15" +
                " Cinnamon Streusel 320 40 8 2 0 0 300 55 2 14 7 Dutch Apple 370 40 8 2 0 0 330 66 2 22 7 Very Cherry 360 40 8 2 0 0 310 65 2 22 7" +
                " Cheese Stick Pizza 100 30 3.5 2 0 5 140 12 0 <1 5" +
                " Italian Cheese Stick Pizza 110 45 5 2 0 0 220 13 0 1 5 Normous Chocolate Chip Cookie 0 0 0 0 0 0 0 0 0 0 0" +
                " Italian Sub 710 370 42 13 0 80 2490 50 3 5 33 Italian Chicken 640 290 33 8 0 70 2350 50 3 5 40" +
                " Spicy Pepperoni 670 380 43 13 0 60 2000 49 3 4 26 Super Ham and Cheese 580 230 26 7 0 55 2200 48 3 4 34" +
                " Meaty Meatball 750 360 40 14 1 125 2160 60 4 7 39 Chicken Bacon Ranch 660 310 35 10 0 75 2150 50 3 6 41" +
                " Gambino Club 630 300 33 9 0 80 1920 48 3 4 34 Turkey Deluxe 590 260 29 8 0 75 1570 52 3 5 31" +
                " Roast Beef 590 300 32 10 0 70 1510 47 3 4 31 Reuben 640 340 37 12 0 80 2500 45 4 7 27" +
                " Italian Sausage 600 260 29 10 0 70 1870 56 4 7 31 Super Italian Sub 810 450 50 15 0 95 3300 54 4 6 37" +
                " Spaghetti 560 120 13 4 0 15 1050 89 8 18 20 Spaghetti with Meatballs 790 270 30 10 0 75 1750 94 8 18 32" +
                " Deluxe Spaghetti 680 190 21 7 0 30 1720 92 9 20 28" +
                " Lasagna 630 280 31 13 0 60 1910 63 8 18 28 Manicotti 550 260 29 16 0 115 1410 46 3 13 26 Deluxe Manicotti 0 0 0 0 0 0 0 0 0 0 0" +
                " Manicotti with Sliced Italian Sausage 730 370 41 19 0 145 2180 55 5 17 34 Beef Ravioli 0 0 0 0 0 0 0 0 0 0 0" +
                " Tortellini Alfredo 1190 700 78 34 12 325 1940 75 4 2 39 Chicken Tortellini Alfredo 1240 710 79 34 12 345 2320 75 4 2 47" +
                " Shrimp Tortellini Alfredo 1230 700 78 34 12 400 2260 75 4 2 46 Fettuccini Aflredo 970 530 60 34 0 215 960 72 4 5 24" +
                " Chicken Fettuccini Alfredo 1020 550 61 34 0 235 1330 73 4 6 32 Shrimp Fettuccini Alfredo 1040 540 61 34 0 335 1490 73 4 5 37" +
                " Southwest Fettuccini Alfredo 1030 550 61 34 0 235 1590 74 4 6 32 California Fettuccini Alfredo 1050 570 63 35 0 240 1430 75 4 7 33" +
                " Breadsticks with Cheese  1060 420 48 17 0 55 2460 115 9 12 40" +
                " Breadsticks 1780 640 71 20 0 45 4180 227 18 24 52 Garlic Bread 1240 890 100 19 0 20 1810 62 4 3 26" +
                " Garlic Bread with Cheese 1410 990 112 26 0 55 2180 64 4 3 41" +
                " Bruschetta 1420 1000 112 28 0 40 2200 69 5 5 41" +
                " Buffalo Wings 350 220 24 7 0 90 560 3 0 0 27 Cheese Stick Pizza 100 30 3.5 2 0 5 140 12 0 <1 5" +
                " Buffalo Blasters 570 260 29 5 0 95 1360 33 2 0 43 Italian Cheese Stick Pizza 110 45 5 2 0 0 220 13 0 1 5" +
                " Beef Ravioli 950 580 67 12 0 70 1800 71 3 4 22 Toasted Jalapeño Cheese Ravioli 0 0 0 0 0 0 0 0 0 0 0" +
                " Toasted Ravioli WJal. & Cheese 1000 630 72 17 0 70 1720 71 3 5 17 Mozzarella Sticks 410 210 23 0.5 0 25 940 40 10 15 18" +
                " Potato Wedges wCheese & Ranch 510 230 25 12 0 20 1450 53 5 0 20 Garden Salad 110 60 6 4.5 0 10 200 7 2 3 9 Italian Salad 50 15 3 1 0 <5 310 5 2 2 2" +
                " Calzone 2030 620 69 22 0 30 3620 283 10 18 69";
        Pattern p = Pattern.compile("\\S+");
        Matcher m = p.matcher(nutritionData);
        String x = null;
        while (m.find()) {
            String s = m.group();
            if (s.matches("[A-Za-z]+")) {
                if (x != null) {
                    x = x + " " + s;
                } else {
                    x = s;
                }
            } else {
                if (x != null) {
                    nutritionInfoArray.add(x);
                    x = null;
                }
                nutritionInfoArray.add(s);
            }
        }

        String adds = "Pepperoni ,Beef ,Pork Sausage ,Italian Sausage ,Sliced Italian Sausage ,Meatballs ,Italian Chicken ,Real Bacon Pieces ,Canadian Bacon ,Salami ," +
        "Shrimp ,Fresh Tomato ,Mushroom ,White Onion ,Red Onion ,Green Pepper ,Jalapeno ,Pepperoncini Pepper ,Roasted Red Pepper ,Black Olive ," +
        "Green Olive ,Pineapple ,Sauerkraut ,Spinach ,Extra Cheese ,Extra Dressing";
        for (String string : adds.split(",")){
            addOns.add(string);
        }
    }

    public ArrayList<String> getNutritionInfoArray () {
        return nutritionInfoArray;
    }
}
