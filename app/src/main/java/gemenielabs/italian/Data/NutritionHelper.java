package gemenielabs.italian.Data;

public class NutritionHelper {

    public String mTitle;
    public String calories;
    public String fat;
    public String saturatedFat;
    public String sodium;
    public String carbohydrates;
    public String sugars;
    public String protien;
    public int mIndex;
    NutritionInfo nutritionInfo = new NutritionInfo();

    public NutritionHelper (String title) {
        mTitle = title;
    }
    public String getCalories() {
        return calories;
    }
    public String getFat() {
        return fat;
    }
    public String getSaturatedFat() {
        return saturatedFat;
    }
    public String getSodium() {
        return sodium;
    }
    public String getCarbohydrates() {
        return carbohydrates;
    }
    public String getSugars() {
        return sugars;
    }
    public String getProtien() {
        return protien;
    }

    public void parseString() {
        for (int i = 0; i < nutritionInfo.getNutritionInfoArray().size(); i++) {
            if ((nutritionInfo.getNutritionInfoArray().get(i).equals(mTitle))) {
                mIndex = i;
            }
        }
    }

    public void searchForNutritionInfo () {
        parseString();
        calories = nutritionInfo.getNutritionInfoArray().get(mIndex + 1);
        fat = nutritionInfo.getNutritionInfoArray().get(mIndex + 3);
        saturatedFat = nutritionInfo.getNutritionInfoArray().get(mIndex + 4);
        sodium = nutritionInfo.getNutritionInfoArray().get(mIndex + 7);
        carbohydrates = nutritionInfo.getNutritionInfoArray().get(mIndex + 8);
        sugars = nutritionInfo.getNutritionInfoArray().get(mIndex + 10);
        protien = nutritionInfo.getNutritionInfoArray().get(mIndex + 11);
    }
}
