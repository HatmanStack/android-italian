package gemenielabs.italian;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.app.NavUtils;

import gemenielabs.italian.Adapters.AllMenuItemsAdapter;
import gemenielabs.italian.Data.NutritionHelper;


public class NutritionInfoActivity extends Activity {

    private String listTitle;
    private String description;
    private int image;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nutritioninfo);

        // Retrieve data from intent
        Intent intent = getIntent();
        listTitle = intent.getStringExtra(AllMenuItemsAdapter.TITLE);
        description = intent.getStringExtra(AllMenuItemsAdapter.DESCRIPTION);
        image = intent.getIntExtra(AllMenuItemsAdapter.IMAGE, 0);

        // Set click listener for nutrition order button
        findViewById(R.id.nutrition_order_button).setOnClickListener(view -> nutritionOrder(view));

        // Enable back button in the action bar
        getActionBar().setDisplayHomeAsUpEnabled(true);

        // Set data for nutrition information
        setData();
    }

    public void setData() {
        // Create a new instance of NutritionHelper
        NutritionHelper nutritionHelper = new NutritionHelper(listTitle);

        // Initialize TextViews and ImageView
        TextView textViewcalories = findViewById(R.id.calories);
        TextView textViewfat = findViewById(R.id.fat);
        TextView textViewsaturatedFat = findViewById(R.id.saturatedFat);
        TextView textViewsodium = findViewById(R.id.sodium);
        TextView textViewcarbohydrates = findViewById(R.id.carbohydrates);
        TextView textViewsugars = findViewById(R.id.sugars);
        TextView textViewprotien = findViewById(R.id.protein);
        ImageView imageOfSpecificItem = findViewById(R.id.imageView);
        TextView titleOfSpecificItem = findViewById(R.id.map_title);
        TextView descriptionOfSpecificItem = findViewById(R.id.description);

        // Search for nutrition information
        nutritionHelper.searchForNutritionInfo();

        // Set nutrition data to TextViews
        if (nutritionHelper.getCalories().equals("0")) {
            textViewprotien.setText("Nutrition Information Not Available");
        } else {
            textViewcalories.setText(nutritionHelper.getCalories());
            textViewfat.setText(nutritionHelper.getFat());
            textViewsaturatedFat.setText(nutritionHelper.getSaturatedFat());
            textViewsodium.setText(nutritionHelper.getSodium());
            textViewcarbohydrates.setText(nutritionHelper.getCarbohydrates());
            textViewsugars.setText(nutritionHelper.getSugars());
            textViewprotien.setText(nutritionHelper.getProtien());
        }

        // Set title, description, and image
        titleOfSpecificItem.setText(listTitle);
        descriptionOfSpecificItem.setText(description);
        imageOfSpecificItem.setImageResource(image);

        // Define and start animations
        ObjectAnimator animateFadeCalorie = ObjectAnimator.ofFloat(textViewcalories, "alpha", 1f);
        ObjectAnimator animateFadeFat = ObjectAnimator.ofFloat(textViewfat, "alpha", 1f);
        ObjectAnimator animateFadeSaturatedFat = ObjectAnimator.ofFloat(textViewsaturatedFat, "alpha", 1f);
        ObjectAnimator animateFadeSodium = ObjectAnimator.ofFloat(textViewsodium, "alpha", 1f);
        ObjectAnimator animateFadeCarbohydrates = ObjectAnimator.ofFloat(textViewcarbohydrates, "alpha", 1f);
        ObjectAnimator animateFadeSugars = ObjectAnimator.ofFloat(textViewsugars, "alpha", 1f);
        ObjectAnimator animateFadeProtein = ObjectAnimator.ofFloat(textViewprotien, "alpha", 1f);

        AnimatorSet topSet = new AnimatorSet();
        topSet.playTogether(animateFadeCalorie, animateFadeSodium);
        AnimatorSet midSet = new AnimatorSet();
        midSet.playTogether(animateFadeProtein, animateFadeCarbohydrates, animateFadeSaturatedFat);
        AnimatorSet bottomSet = new AnimatorSet();
        bottomSet.playTogether(animateFadeSugars, animateFadeFat);
        AnimatorSet set = new AnimatorSet();
        set.setDuration(300);
        set.playSequentially(topSet, midSet, bottomSet);
        set.start();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                // Navigate up to the previous activity
                NavUtils.navigateUpFromSameTask(this);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public void nutritionOrder(View v) {
        // Check if it's a valid order
        if (getIntent().getIntExtra(AllMenuItemsAdapter.ID, 0) == R.id.deserts_menu
                && getIntent().getIntExtra(AllMenuItemsAdapter.POSITION, 0) == 4) {
            return;
        }

        // Create an intent to start the OrderActivity
        Intent intent = new Intent(this, OrderActivity.class);

        // Set extra data for the intent
        int position = getIntent().getIntExtra(AllMenuItemsAdapter.POSITION, 0);
        intent.putExtra(AllMenuItemsAdapter.ID, getIntent().getIntExtra(AllMenuItemsAdapter.ID, 0));
        intent.putExtra(AllMenuItemsAdapter.POSITION, position);
        intent.putExtra(AllMenuItemsAdapter.TITLE, (String) MainActivity.titleList.get(position));
        intent.putExtra(AllMenuItemsAdapter.DESCRIPTION, (String) MainActivity.descriptionList.get(position));
        intent.putExtra(AllMenuItemsAdapter.IMAGE, (int) MainActivity.imageList.get(position));

        // Start the OrderActivity
        startActivity(intent);
    }
}





