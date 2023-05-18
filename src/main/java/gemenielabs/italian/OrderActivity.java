package gemenielabs.italian;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.app.NavUtils;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

import gemenielabs.italian.Adapters.AllMenuItemsAdapter;
import gemenielabs.italian.Adapters.SpinnerAdapter;



public class OrderActivity extends Activity
    implements SpinnerAdapter.ItemSelectedListener{

    public static final String TAG = "TAG";
    private String listTitle;
    private String description;
    private int image;
    private int position;
    private TextView orderSummary;
    private TextView orderTotal;
    private EditText comments;
    private int orderTotalNumber;
    private int sizeHolder;
    private int mId;
    public ArrayList<String> spinnerItems = new ArrayList<>();
    public ArrayList<Integer> spinnerADDNO = new ArrayList<>();
    public ArrayList<Integer> spinnerPrice = new ArrayList<>();
    public int[] spinnerPosition = new int[20];
    public static final String ITEM_ORDER = "item_order";
    public static final String ITEM_COST = "item_cost";
    public static final String COMMENTS = "comments";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_order);
        Intent intent = getIntent();
        mId = intent.getIntExtra(AllMenuItemsAdapter.ID, 0);
        position = intent.getIntExtra(AllMenuItemsAdapter.POSITION, 0);
        listTitle = intent.getStringExtra(AllMenuItemsAdapter.TITLE);
        description = intent.getStringExtra(AllMenuItemsAdapter.DESCRIPTION);
        image = intent.getIntExtra(AllMenuItemsAdapter.IMAGE, 0);
        findViewById(R.id.half_pizza_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                halfPizza(view);
            }
        });
        findViewById(R.id.checkout_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkOut(view);
            }
        });
        findViewById(R.id.button_subtract).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                spinnerADD(view);
            }
        });
        findViewById(R.id.button_add).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                spinnerADD(view);
            }
        });
        getActionBar().setDisplayHomeAsUpEnabled(true);
        orderTotalNumber = 0;
        for (int i = 0; i < 10; i++) {
            spinnerItems.add("ID");
            spinnerPrice.add(0);
        }
        setData();
        if(mId == R.id.pizza_menu){
            addNewSpinner(R.id.pizza_menu);
            createSpinner();
             addNewSpinner(R.id.pizza_menu);
            createSpinner();
        } else if(mId == R.string.action_calzones){
            addNewSpinner(R.string.action_calzones);
            createSpinner();
            addNewSpinner(R.string.order_STUFFING);
            createSpinner();
            addNewSpinner(R.string.order_STUFFING);
            createSpinner();
            addNewSpinner(R.string.order_STUFFING);
            createSpinner();
        } else if(mId == R.id.sandwiches_menu) {
            addNewSpinner(mId);
            sizeSelector(R.id.sandwiches_menu, listTitle, 0, position);
        } else {
            addNewSpinner(mId);
            createSpinner();
        }
    }

    @Override
    public void onAdapterItemSelected(Object id, String item, int spinnerNumber, int clickedPosition) {
        Log.i("TAG: adapterItemSelect", id + "");
        Log.i("TAG: adapterItemSelect", item + "");
        Log.i("TAG: adapterItemSelect", spinnerNumber + "");
        Log.i("TAG: adapterItemSelect", clickedPosition + "");
            spinnerPosition[spinnerNumber] = clickedPosition;
            sizeSelector((int) id, item, spinnerNumber, clickedPosition);

    }

    public void setData() {
        ImageView imageView = findViewById(R.id.item_image);
        TextView descriptionView = findViewById(R.id.item_description);
        TextView titleView = findViewById(R.id.item_title);
        orderSummary = findViewById(R.id.order_summary);
        orderTotal = findViewById(R.id.order_total);
        comments = findViewById(R.id.comments);
        imageView.setImageResource(image);
        descriptionView.setText(description);
        titleView.setText(listTitle);
        buttonVisibility();
    }

    public void buttonVisibility(){
        Button add = findViewById(R.id.button_add);
        Button subtract = findViewById(R.id.button_subtract);
        Button half = findViewById(R.id.half_pizza_button);
        if(mId == R.id.pizza_menu || mId == R.id.salads_menu) {
            add.setVisibility(View.VISIBLE);
            subtract.setVisibility(View.VISIBLE);
            half.setVisibility(View.VISIBLE);
        }else {
            add.setVisibility(View.GONE);
            subtract.setVisibility(View.GONE);
            half.setVisibility(View.GONE);
        }
    }

    public int[] resourceHelper(int value){
        return getResources().getIntArray(value);
    }

    public int[] getPriceArray(int id, int spinnerNumber, int clickedPosition) {
        Log.i("TAG: getPriceArray", "START");
        Log.i(TAG, "getPriceArray: clickedPosition " + clickedPosition);
        Log.i(TAG, "getPriceArray: spinnerNumber " + spinnerNumber);
        Log.i(TAG, "getPriceArray: position " + position);
        spinnerPosition[spinnerNumber] = clickedPosition;
        if (id == R.string.action_calzones){
            return resourceHelper(R.array.calzone_price);
        }
        if (id == R.string.order_CRUST && spinnerNumber == 1) {
            return resourceHelper(R.array.crust_price);
        }
        if (id == R.id.pizza_menu && spinnerNumber == 0) {
            Log.i(TAG, "getPriceArray: " + spinnerNumber);
            sizeHolder = clickedPosition;
            if (position < 4) {
                return resourceHelper(R.array.signature_price);
            } else if (position > 4 || position != 21 || position != 22) {
                return resourceHelper(R.array.specialty_price);
            } else {
                return resourceHelper(R.array.create_your_own_price);
            }
        }
        if (id == R.id.sandwiches_menu) {
            return resourceHelper(R.array.sandwich_price_array);
        }
        if (id == R.id.appetizers_menu) {
            if (clickedPosition == 0) {
                return resourceHelper(R.array.appetizer_small_price);
            } else if (clickedPosition == 1) {
                return resourceHelper(R.array.appetizer_medium_price);
            } else {
                return resourceHelper(R.array.appetizer_large_price);
            }
        }
        if (id == R.id.pastas_menu) {
            if (clickedPosition == 0) {
                return resourceHelper(R.array.pasta_individual_price);
            } else {
                return resourceHelper(R.array.pasta_family_price);
            }
        }
        if (id == R.id.salads_menu) {
            return resourceHelper(R.array.salad_price_array);
        }
        if (id == R.id.deserts_menu) {
            if (position == 3) {
                return resourceHelper(R.array.cookie_price);
            } else {
                return resourceHelper(R.array.desert_price_array);
            }
        }
        if (id == R.string.order_NO) {
            return resourceHelper(R.array.topping_price_NO);
        }
        return resourceHelper(R.array.topping_price_ADD);
    }


    public void sizeSelector(int id, String item, int spinnerNumber, int clickedPosition) {

        for (int i = 0; i < spinnerADDNO.size(); i++) {

            int[] priceArray = getPriceArray(id, spinnerNumber, clickedPosition);

            if(spinnerNumber == i) {
                Log.i(TAG, "sizeSelector: If");
                spinnerItems.set(i, item);
                if (id == R.id.appetizers_menu) {
                    spinnerPrice.set(i, priceArray[position]);
                } else if(spinnerADDNO.get(i) != R.string.order_ADD && spinnerADDNO.get(i) != R.string.order_STUFFING &&
                        spinnerADDNO.get(i) != R.string.order_NO && spinnerADDNO.get(i) != R.string.pizza_right && spinnerADDNO.get(i) != R.string.pizza_left) {
                    Log.i(TAG, "sizeSelector: " + getResources().getString(spinnerADDNO.get(i)));

                    spinnerPrice.set(i, priceArray[clickedPosition]);
                }
            }else if(spinnerADDNO.get(i) == R.string.order_ADD || spinnerADDNO.get(i) == R.string.order_STUFFING ||
                    spinnerADDNO.get(i) == R.string.pizza_right || spinnerADDNO.get(i) == R.string.pizza_left) {
                Log.i(TAG, "sizeSelector: else");

                if(spinnerADDNO.get(i) == R.string.order_ADD ||
                        spinnerADDNO.get(i) == R.string.pizza_right || spinnerADDNO.get(i) == R.string.pizza_left) {
                    priceArray = resourceHelper(R.array.topping_price_ADD);
                } else {
                    priceArray = resourceHelper(R.array.topping_price_NO);
                }
                Log.i(TAG, "sizeSelector: " + sizeHolder);
                spinnerPrice.set(i, priceArray[sizeHolder]);
            }
        }
        buildStrings(id);
    }



    public void buildStrings(int id){
        Log.i(TAG, "buildStrings: Start");
        String orderString = "ORDER SUMMARY:" + "\n";
        String directions = " ";
        String itemCost = "";
        for (int i = 0; i < spinnerADDNO.size(); i++) {
            Log.i(TAG, "buildStrings: " + getString(spinnerADDNO.get(i)) + spinnerItems.get(i) + spinnerPrice.get(i).toString());
            if(spinnerADDNO.get(i) == R.string.order_ADD || spinnerADDNO.get(i) == R.string.order_NO ||
                    spinnerADDNO.get(i) == R.string.pizza_right || spinnerADDNO.get(i) == R.string.pizza_left){
                directions =  getString(spinnerADDNO.get(i)) + " ";
            }
            if(spinnerPrice.get(i) != 0){
                itemCost =  buildTotalString(spinnerPrice.get(i));
            }
            orderString += "\n" + directions + spinnerItems.get(i) + itemCost;
            itemCost = " ";
            directions= " ";
            Log.i(TAG, "buildStrings: " + orderString);
        }
        String totalString = "TOTAL:" + buildTotalString(totalItems());
        orderTotal.setText(totalString);
        orderSummary.setText(orderString);
    }

    public int totalItems(){
        int total = 0;
        for (int i = 0; i < spinnerPrice.size(); i++) {
            total += spinnerPrice.get(i);
        }
        orderTotalNumber = total;
        return total;
    }

    public String buildTotalString(int value){
        String string = String.valueOf(value);
        if(string.length() > 2) {
            String centsString = string.substring(string.length() - 2);
            String dollarString = string.substring(0, string.length() - 2);
            string = dollarString + "." + centsString;
            return "     $" + string;
        }
        return "     $0." + string;
    }

    public void addNewSpinner(int id){
        spinnerADDNO.add(id);
    }

    public void checkOut(View v){
        Intent intent = new Intent(this, CheckoutActivity.class);
        intent.putExtra(ITEM_ORDER, orderSummary.getText().toString());
        Log.i(TAG, "checkOut: " + orderSummary.getText().toString());
        intent.putExtra(ITEM_COST, orderTotalNumber);
        intent.putExtra(COMMENTS, comments.getText().toString());
        intent.putExtra(AllMenuItemsAdapter.TITLE, listTitle);
        intent.putExtra(AllMenuItemsAdapter.ID, getIntent().getIntExtra(AllMenuItemsAdapter.ID, 0));
        startActivity(intent);
    }
    public void spinnerADD(View v){
        if (v.getTag().equals("ADD")) {
            addNewSpinner(R.string.order_ADD);
        } else {
            addNewSpinner(R.string.order_NO);
        }
        createSpinner();
    }

    public void createSpinner() {
        Log.i("TAG: CREATESPINNER ", "START");
        RecyclerView spinnerRecyclerView = findViewById(R.id.spinner_recyclerview);
        SpinnerAdapter spinnerAdapter = new SpinnerAdapter(this, this, spinnerADDNO, spinnerPosition, position);
        spinnerRecyclerView.setAdapter(spinnerAdapter);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        spinnerRecyclerView.setLayoutManager(layoutManager);
    }

    public void halfPizza(View v){
        if(mId == R.id.pizza_menu) {
            spinnerADDNO.add(R.string.pizza_left);
            createSpinner();
            spinnerADDNO.add(R.string.pizza_right);
            createSpinner();
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                NavUtils.navigateUpFromSameTask(this);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

}
