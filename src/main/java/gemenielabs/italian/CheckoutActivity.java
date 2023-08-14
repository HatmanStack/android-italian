package gemenielabs.italian;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;

import java.util.ArrayList;
import java.util.Locale;

import gemenielabs.italian.Adapters.AllMenuItemsAdapter;
import gemenielabs.italian.Adapters.OrderSummaryAdapter;


public class CheckoutActivity extends Activity implements OrderSummaryAdapter.ListViewClickListener {

    SharedPreferences sharedPreferences;
    OrderSummaryAdapter myadapter;
    private final ArrayList<String> itemList = new ArrayList<>();
    private final ArrayList<Integer> costList = new ArrayList<>();
    private String comment;
    private String item;
    private String listItem;
    private TextView total;
    private int cost;

    public static final String StartMapFromCheckOut = "StartMapFromCheckOut";
    private static final int StartMapFromCheckOutID = 9001;
    public static final String ITEM_STRING = "item_strings";
    public static final String ITEM_COST = "item_cost";
    public static final String NUMBER_OF_ITEMS = "number_of_items";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_checkout);

        // Retrieve intent data and find views
        Intent intent = getIntent();
        total = findViewById(R.id.summary_total);

        // Set click listeners for buttons
        findViewById(R.id.clear_list_button).setOnClickListener(this::clearList);
        findViewById(R.id.checkout_order_button).setOnClickListener(this::startDeliveryCarryOut);

        // Retrieve data from SharedPreferences
        sharedPreferences = this.getSharedPreferences("prototype.prototype.gambinos", MODE_PRIVATE);
        int itemNumber = sharedPreferences.getInt(NUMBER_OF_ITEMS, 0);
        for (int i = 0; i < itemNumber ; i++) {
            costList.add(sharedPreferences.getInt(ITEM_COST + i, 0));
            itemList.add(sharedPreferences.getString(ITEM_STRING + i, ""));
        }

        // Check if intent has extra data
        if (intent.hasExtra(OrderActivity.COMMENTS)) {
            if (intent.getStringExtra(OrderActivity.COMMENTS).length() > 1) {
                comment = intent.getStringExtra(OrderActivity.COMMENTS);
            }
            listItem = intent.getStringExtra(AllMenuItemsAdapter.TITLE);
            item = intent.getStringExtra(OrderActivity.ITEM_ORDER);
            cost = intent.getIntExtra(OrderActivity.ITEM_COST, 0);
            costList.add(cost);
            buildString();
        }

        // Build and display total string
        totalString(buildTotal());

        // Set adapter for RecyclerView
        getAdapter();
    }

    public void buildString() {
        Log.i("TAG", String.valueOf(listItem));
        String orderString = (comment != null) ?
                listItem.toUpperCase(Locale.getDefault()) + item.toLowerCase(Locale.getDefault()) + "\n" + comment :
                listItem.toUpperCase(Locale.getDefault()) + item.toLowerCase(Locale.getDefault());
        orderString = orderString.replace("order summary", "");
        itemList.add(orderString);
    }

    public int buildTotal() {
        int total = 0;
        for (int i = 0; i < costList.size(); i++) {
            total += costList.get(i);
        }
        return total;
    }

    public void totalString(int value) {
        String string = String.valueOf(value);
        if (string.length() > 2) {
            String centsString = string.substring(string.length() - 2);
            String dollarString = string.substring(0, string.length() - 2);
            string = dollarString + "." + centsString;
        }
        String totalNumber = "Total :   $" + string;
        total.setText(totalNumber);
    }

    public void getAdapter() {
        RecyclerView recyclerView = findViewById(R.id.order_summary_recyclerview);
        myadapter = new OrderSummaryAdapter(this, itemList);
        recyclerView.setAdapter(myadapter);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);
    }

    @Override
    protected void onStop() {
        saveLists();
        super.onStop();
    }

    public void saveLists() {
        sharedPreferences.edit().putInt(NUMBER_OF_ITEMS, itemList.size()).apply();
        for (int i = 0; i < itemList.size(); i++) {
            sharedPreferences.edit().putInt(ITEM_COST + i, costList.get(i)).apply();
            sharedPreferences.edit().putString(ITEM_STRING + i, itemList.get(i)).apply();
        }
    }

    @Override
    public void onListItemClicked(int clickedPosition) {
        itemList.remove(clickedPosition);
        costList.remove(clickedPosition);
        totalString(buildTotal());
        myadapter.notifyDataSetChanged();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.checkout, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int itemId = item.getItemId();
        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtra(AllMenuItemsAdapter.ID, itemId);
        startActivity(intent);
        return super.onOptionsItemSelected(item);
    }

    public void startDeliveryCarryOut(View v) {
        startActivity(new Intent(getApplicationContext(), MapFragmentActivity.class));
    }

    public void clearList(View v) {
        for (int i = 0; i < itemList.size(); i++) {
            sharedPreferences.edit().putInt(ITEM_COST + i, 0).apply();
            sharedPreferences.edit().putString(ITEM_STRING + i, "").apply();
        }
        sharedPreferences.edit().putInt(NUMBER_OF_ITEMS, 0).apply();
        itemList.clear();
        costList.clear();
        totalString(0);
        myadapter.notifyDataSetChanged();
    }
}

