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

    // Initialize views
    initializeViews();

    // Set button listeners
    setButtonListeners();

    // Enable back button in action bar
    getActionBar().setDisplayHomeAsUpEnabled(true);

    // Initialize order total number
    orderTotalNumber = 0;

    // Initialize spinner data
    initializeSpinnerData();

    // Set data for views
    setData();

    // Create spinner based on the selected menu
    createSpinnerBasedOnMenu();
}

@Override
public void onAdapterItemSelected(Object id, String item, int spinnerNumber, int clickedPosition) {
    // Update spinner position and call sizeSelector
    spinnerPosition[spinnerNumber] = clickedPosition;
    sizeSelector((int) id, item, spinnerNumber, clickedPosition);
}

public void setData() {
    // Set data for various views
    ImageView imageView = findViewById(R.id.item_image);
    TextView descriptionView = findViewById(R.id.item_description);
    TextView titleView = findViewById(R.id.item_title);
    orderSummary = findViewById(R.id.order_summary);
    orderTotal = findViewById(R.id.order_total);
    comments = findViewById(R.id.comments);

    imageView.setImageResource(image);
    descriptionView.setText(description);
    titleView.setText(listTitle);

    // Set button visibility based on menu
    setButtonVisibility();
}

public void setButtonVisibility() {
    // Show/hide buttons based on the selected menu
    Button add = findViewById(R.id.button_add);
    Button subtract = findViewById(R.id.button_subtract);
    Button half = findViewById(R.id.half_pizza_button);

    if (mId == R.id.pizza_menu || mId == R.id.salads_menu) {
        add.setVisibility(View.VISIBLE);
        subtract.setVisibility(View.VISIBLE);
        half.setVisibility(View.VISIBLE);
    } else {
        add.setVisibility(View.GONE);
        subtract.setVisibility(View.GONE);
        half.setVisibility(View.GONE);
    }
}

public int[] resourceHelper(int value) {
    // Retrieve integer array resource
    return getResources().getIntArray(value);
}

private void initializeViews() {
    // Set click listeners for buttons
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
}

private void initializeSpinnerData() {
    // Initialize spinner items and prices
    for (int i = 0; i < 10; i++) {
        spinnerItems.add("ID");
        spinnerPrice.add(0);
    }
}

private void createSpinnerBasedOnMenu() {
    // Create spinner based on the selected menu
    if (mId == R.id.pizza_menu) {
        addNewSpinner(R.id.pizza_menu);
        createSpinner();
        addNewSpinner(R.id.pizza_menu);
        createSpinner();
    } else if (mId == R.string.action_calzones) {
        addNewSpinner(R.string.action_calzones);
        createSpinner();
        addNewSpinner(R.string.order_STUFFING);
        createSpinner();
        addNewSpinner(R.string.order_STUFFING);
        createSpinner();
        addNewSpinner(R.string.order_STUFFING);
        createSpinner();
    } else if (mId == R.id.sandwiches_menu) {
        addNewSpinner(mId);
        sizeSelector(R.id.sandwiches_menu, listTitle, 0, position);
    } else {
        addNewSpinner(mId);
        createSpinner();
    }
}


public int[] getPriceArray(int id, int spinnerNumber, int clickedPosition) {
    spinnerPosition[spinnerNumber] = clickedPosition;
    
    switch (id) {
        case R.string.action_calzones:
            return resourceHelper(R.array.calzone_price);
        case R.string.order_CRUST:
            if (spinnerNumber == 1) {
                return resourceHelper(R.array.crust_price);
            }
            break;
        case R.id.pizza_menu:
            sizeHolder = clickedPosition;
            if (position < 4) {
                return resourceHelper(R.array.signature_price);
            } else if (position > 4 || position != 21 || position != 22) {
                return resourceHelper(R.array.specialty_price);
            } else {
                return resourceHelper(R.array.create_your_own_price);
            }
        case R.id.sandwiches_menu:
            return resourceHelper(R.array.sandwich_price_array);
        case R.id.appetizers_menu:
            switch (clickedPosition) {
                case 0:
                    return resourceHelper(R.array.appetizer_small_price);
                case 1:
                    return resourceHelper(R.array.appetizer_medium_price);
                default:
                    return resourceHelper(R.array.appetizer_large_price);
            }
        case R.id.pastas_menu:
            if (clickedPosition == 0) {
                return resourceHelper(R.array.pasta_individual_price);
            } else {
                return resourceHelper(R.array.pasta_family_price);
            }
        case R.id.salads_menu:
            return resourceHelper(R.array.salad_price_array);
        case R.id.deserts_menu:
            if (position == 3) {
                return resourceHelper(R.array.cookie_price);
            } else {
                return resourceHelper(R.array.desert_price_array);
            }
        case R.string.order_NO:
            return resourceHelper(R.array.topping_price_NO);
    }
    
    // Default case when no matching conditions are met
    return resourceHelper(R.array.topping_price_ADD);
}


public void sizeSelector(int id, String item, int spinnerNumber, int clickedPosition) {
    for (int i = 0; i < spinnerADDNO.size(); i++) {
        int[] priceArray = getPriceArray(id, spinnerNumber, clickedPosition);
        
        // Update spinner items and prices based on conditions
        if (spinnerNumber == i) {
            spinnerItems.set(i, item);
            
            // Update price based on specific menu ID
            if (id == R.id.appetizers_menu) {
                spinnerPrice.set(i, priceArray[position]);
            } else if (spinnerADDNO.get(i) != R.string.order_ADD && spinnerADDNO.get(i) != R.string.order_STUFFING &&
                    spinnerADDNO.get(i) != R.string.order_NO && spinnerADDNO.get(i) != R.string.pizza_right && spinnerADDNO.get(i) != R.string.pizza_left) {
                spinnerPrice.set(i, priceArray[clickedPosition]);
            }
        } else if (spinnerADDNO.get(i) == R.string.order_ADD || spinnerADDNO.get(i) == R.string.order_STUFFING ||
                spinnerADDNO.get(i) == R.string.pizza_right || spinnerADDNO.get(i) == R.string.pizza_left) {
            // Update price based on specific spinner item
            if (spinnerADDNO.get(i) == R.string.order_ADD ||
                    spinnerADDNO.get(i) == R.string.pizza_right || spinnerADDNO.get(i) == R.string.pizza_left) {
                priceArray = resourceHelper(R.array.topping_price_ADD);
            } else {
                priceArray = resourceHelper(R.array.topping_price_NO);
            }
            spinnerPrice.set(i, priceArray[sizeHolder]);
        }
    }
    
    // Build the final strings based on updated spinner items and prices
    buildStrings(id);
}


public void buildStrings(int id) {
    String orderString = "ORDER SUMMARY:" + "\n";
    String directions = " ";
    String itemCost = "";
    
    // Iterate through spinner items to build the order summary string
    for (int i = 0; i < spinnerADDNO.size(); i++) {
        if (spinnerADDNO.get(i) == R.string.order_ADD || spinnerADDNO.get(i) == R.string.order_NO ||
                spinnerADDNO.get(i) == R.string.pizza_right || spinnerADDNO.get(i) == R.string.pizza_left) {
            // Update directions based on specific spinner item
            directions = getString(spinnerADDNO.get(i)) + " ";
        }
        
        if (spinnerPrice.get(i) != 0) {
            // Build the cost string for the spinner item
            itemCost = buildTotalString(spinnerPrice.get(i));
        }
        
        // Append the spinner item details to the order string
        orderString += "\n" + directions + spinnerItems.get(i) + itemCost;
        
        // Reset itemCost and directions for the next iteration
        itemCost = " ";
        directions = " ";
    }
    
    String totalString = "TOTAL:" + buildTotalString(totalItems());
    orderTotal.setText(totalString);
    orderSummary.setText(orderString);
}

public int totalItems() {
    int total = 0;
    
    // Calculate the total cost by summing up all spinner prices
    for (int i = 0; i < spinnerPrice.size(); i++) {
        total += spinnerPrice.get(i);
    }
    
    orderTotalNumber = total;
    return total;
}

public String buildTotalString(int value) {
    String string = String.valueOf(value);
    
    if (string.length() > 2) {
        // Format the string for dollars and cents
        String centsString = string.substring(string.length() - 2);
        String dollarString = string.substring(0, string.length() - 2);
        string = dollarString + "." + centsString;
        return "     $" + string;
    }
    
    return "     $0." + string;
}

public void addNewSpinner(int id) {
    spinnerADDNO.add(id);
}

public void checkOut(View v) {
    // Prepare the intent for starting the CheckoutActivity
    Intent intent = new Intent(this, CheckoutActivity.class);
    
    // Add data to the intent as extras
    intent.putExtra(ITEM_ORDER, orderSummary.getText().toString());
    intent.putExtra(ITEM_COST, orderTotalNumber);
    intent.putExtra(COMMENTS, comments.getText().toString());
    intent.putExtra(AllMenuItemsAdapter.TITLE, listTitle);
    intent.putExtra(AllMenuItemsAdapter.ID, getIntent().getIntExtra(AllMenuItemsAdapter.ID, 0));
    
    // Start the CheckoutActivity
    startActivity(intent);
}

public void spinnerADD(View v) {
    // Check the tag of the view to determine the spinner item type to add
    if (v.getTag().equals("ADD")) {
        addNewSpinner(R.string.order_ADD);
    } else {
        addNewSpinner(R.string.order_NO);
    }
    
    // Create the spinner view
    createSpinner();
}

public void createSpinner() {
    // Find the spinner RecyclerView in the layout
    RecyclerView spinnerRecyclerView = findViewById(R.id.spinner_recyclerview);
    
    // Create a spinner adapter with the necessary data
    SpinnerAdapter spinnerAdapter = new SpinnerAdapter(this, this, spinnerADDNO, spinnerPosition, position);
    
    // Set the spinner adapter and layout manager for the RecyclerView
    spinnerRecyclerView.setAdapter(spinnerAdapter);
    LinearLayoutManager layoutManager = new LinearLayoutManager(this);
    spinnerRecyclerView.setLayoutManager(layoutManager);
}

public void halfPizza(View v) {
    // Add the left half and right half spinner items for the pizza menu
    if (mId == R.id.pizza_menu) {
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
            // Navigate up to the parent activity using NavUtils
            NavUtils.navigateUpFromSameTask(this);
            return true;
    }
    return super.onOptionsItemSelected(item);
}




}
