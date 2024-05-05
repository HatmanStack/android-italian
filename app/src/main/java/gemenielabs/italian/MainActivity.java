package gemenielabs.italian;

import android.Manifest;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.*;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.location.LocationManagerCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationAvailability;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;

import gemenielabs.italian.Adapters.AllMenuItemsAdapter;
import gemenielabs.italian.Data.ItemLists;
import gemenielabs.italian.Data.LocationHelper;
import gemenielabs.italian.Data.NutritionInfo;


import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    private AllMenuItemsAdapter myadapter;
    private RecyclerView menuItemDisplay;
    private DownloadLocationReceiver locationReceiver;
    public static List<String> titleList;
    public static List<Integer> imageList;
    public static List<String> descriptionList;
    public static Location customerLocation;
    public static double custLat;
    public static double custLong;
    public static final String LOCATIONDATA = "locationdata";
    public static final String BROADCASTACTION = "broadcastaction";
    private static final String CUSTOMERLOCATION = "customerlocation";
    public static final String PHONE = "phone", ADDRESS = "address", OPENCLOSE = "open_close",
            HOURS = "hours", LAT = "lat", LNG = "lng", PHOTOS = "photo", NAME = "name";
    private Boolean newSave;
    int mId;
    ViewGroup storeInformation, mainFrame;
    public String[] permissions = {Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.CALL_PHONE};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_ACTION_BAR);
        setContentView(R.layout.main);

        // Load nutrition information
        new NutritionInfo().loadNutritionInformation();

        locationInformation();  // Initialize location services

        // Get the selected menu item ID
        mId = getIntent().getIntExtra(AllMenuItemsAdapter.ID, R.id.pizza_menu);

        getLists(); // Get the lists based on the selected menu item
        getAdapter(); // Set up the adapter for the RecyclerView

        storeInformation = findViewById(R.id.store_information);
        mainFrame = findViewById(R.id.main_frame);
        setupTransitions(); // Set up the animation transitions
    }

    public void getAdapter() {
        menuItemDisplay = findViewById(R.id.recyclerview);
        myadapter = new AllMenuItemsAdapter(mId, this);
        menuItemDisplay.setAdapter(myadapter);
        menuItemDisplay.setLayoutManager(new LinearLayoutManager(this));
    }

    public void getPermissions() {
        if (Build.VERSION.SDK_INT > 22 && (checkSelfPermission(permissions[0]) != PackageManager.PERMISSION_GRANTED ||
                checkSelfPermission(permissions[1]) != PackageManager.PERMISSION_GRANTED)) {
            requestPermissions(permissions, 1);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    public void showMap() {
        LocationHelper locationHelper = new LocationHelper();

        if (DownloadLocationReceiver.localAddress != null) {
            startActivity(new Intent(getApplicationContext(), MapFragmentActivity.class));
        }
    }

    public void locationInformation() {
        if (Build.VERSION.SDK_INT > 22 && (checkSelfPermission(permissions[0]) != PackageManager.PERMISSION_GRANTED ||
                checkSelfPermission(permissions[1]) != PackageManager.PERMISSION_GRANTED)) {
            getPermissions();
        } else {
            requestLocationUpdates();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission was granted. You can now run your task that requires this permission.
                requestLocationUpdates();
            } else {
                // Permission was denied. You can notify the user and disable the functionality that depends on this permission.
                Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void requestLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        LocationManager locationManager = (LocationManager) getSystemService(this.LOCATION_SERVICE);

        LocationListener locationListener = new LocationListener() {
            public void onLocationChanged(Location location) {
                // Called when a new location is found by the network location provider.
                custLat = location.getLatitude();
                custLong = location.getLongitude();
                // Do something with the location data here
            }

            public void onStatusChanged(String provider, int status, Bundle extras) {}

            public void onProviderEnabled(String provider) {}

            public void onProviderDisabled(String provider) {}
        };

        Log.i("TAG: custLat", String.valueOf(custLat));
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);
        }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int itemId = item.getItemId();
        mId = itemId;
        getLists(); // Update the lists based on the selected menu item
        getAdapter(); // Update the adapter for the RecyclerView
        return super.onOptionsItemSelected(item);
    }
    
    public void getLists() {
        // Clear previous lists
        titleList = new ArrayList<>();
        imageList = new ArrayList<>();
        descriptionList = new ArrayList<>();
    
        // Update lists based on the selected menu item
        switch (mId) {
            case R.id.pizza_menu:
                titleList = ItemLists.getPizzaTitleList();
                imageList = ItemLists.getPizzaList();
                descriptionList = ItemLists.getPizzaDescriptionList();
                break;
            case R.id.appetizers_menu:
                titleList = ItemLists.getAppetizerTitleList();
                imageList = ItemLists.getAppetizersList();
                descriptionList = ItemLists.getAppetizerDescriptionList();
                break;
            case R.id.sandwiches_menu:
                titleList = ItemLists.getSandwichesTitleList();
                imageList = ItemLists.getSandwichesList();
                descriptionList = ItemLists.getSandwichesDescriptionList();
                break;
            case R.id.pastas_menu:
                titleList = ItemLists.getPastaTitleList();
                imageList = ItemLists.getPastasList();
                descriptionList = ItemLists.getPastaDescriptionList();
                break;
            case R.id.salads_menu:
                titleList = ItemLists.getSaladsAndCalzoneTitleList();
                imageList = ItemLists.getSaladsAndCalzoneList();
                descriptionList = ItemLists.getSaladsAndCalzoneDescriptionList();
                break;
            case R.id.deserts_menu:
                titleList = ItemLists.getDesertTitleList();
                imageList = ItemLists.getDesertsList();
                descriptionList = ItemLists.getDesertDescriptionList();
                break;
            case R.id.order_menu:
                startActivity(new Intent(this, CheckoutActivity.class));
                break;
            case R.id.show_map:
                showMap();
                break;
            default:
                break;
        }
    }
    
    private void setupTransitions() {
        // Set up animation transitions
        ObjectAnimator animateTranslation = ObjectAnimator.ofFloat(storeInformation, "translationY", 0f);
        ObjectAnimator animateAlpha = ObjectAnimator.ofFloat(mainFrame, "alpha", 1f);
        mainFrame.setAlpha(0f);
        storeInformation.setY(-800f);
        AnimatorSet set = new AnimatorSet();
        set.setDuration(500);
        set.playSequentially(animateTranslation, animateAlpha);
        set.start();
    }
    
    public void saveData() {
        SharedPreferences sharedPreferences = getSharedPreferences(LOCATIONDATA, MODE_PRIVATE);
        String string = sharedPreferences.getString(NAME, "");
        String teststring = String.valueOf(DownloadLocationReceiver.localname);
        if (!string.equals(teststring)) {
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.putString(PHONE, String.valueOf(DownloadLocationReceiver.phone));
            editor.putString(ADDRESS, String.valueOf(DownloadLocationReceiver.localAddress));
            editor.putString(OPENCLOSE, String.valueOf(DownloadLocationReceiver.localOpenClose));
            editor.putString(HOURS, String.valueOf(DownloadLocationReceiver.hours));
            editor.putString(LAT, String.valueOf(DownloadLocationReceiver.localLat));
            editor.putString(LNG, String.valueOf(DownloadLocationReceiver.localLng));
            editor.putString(PHOTOS, String.valueOf(DownloadLocationReceiver.photoList));
            editor.putString(NAME, String.valueOf(DownloadLocationReceiver.localname));
            editor.putString(CUSTOMERLOCATION, String.valueOf(customerLocation));
            editor.apply();
    
            Log.i("TAG saveDATA", String.valueOf(customerLocation));
            Log.i("TAG saveDATA", String.valueOf(DownloadLocationReceiver.localname));
        }
    }
    
}