package gemenielabs.italian;

import android.Manifest;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.*;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;
import gemenielabs.italian.Adapters.AllMenuItemsAdapter;
import gemenielabs.italian.Data.ItemLists;
import gemenielabs.italian.Data.LocationHelper;
import gemenielabs.italian.Data.NutritionInfo;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends Activity {


    private AllMenuItemsAdapter myadapter;
    private RecyclerView menuItemDisplay;
    private DownloadLocationReceiver locationReceiver;
    public static List titleList;
    public static List imageList;
    public static List descriptionList;
    public static Location customerLocation;
    public static final String LOCATIONDATA = "locationdata";
    public static final String BROADCASTACTION = "broadcastaction";
    private static final String CUSTOMERLOCATION = "customerlocation";
    public static final String PHONE = "phone";
    public static final String ADDRESS = "address";
    public static final String OPENCLOSE = "open_close";
    public static final String HOURS = "hours";
    public static final String LAT = "lat";
    public static final String LNG = "lng";
    public static final String PHOTOS = "photo";
    public static final String NAME = "name";
    private Boolean newSave;
    private FusedLocationProviderClient fusedLocationProviderClient;
    int mId;
    ViewGroup storeInformation;
    ViewGroup mainFrame;
    public String[] permissions = {Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.CALL_PHONE};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_ACTION_BAR);
        setContentView(R.layout.main);
        NutritionInfo nutritionInfo = new NutritionInfo();
        nutritionInfo.loadNutritionInformation();
        localLocationServices();
        //Location not being saved correctly, default Values of sharedpreferences returning null
        /**if(customerLocation != null) {
            saveData();
        }**/
        if (getIntent().hasExtra(AllMenuItemsAdapter.ID)) {
            mId = getIntent().getIntExtra(AllMenuItemsAdapter.ID, 0);
        } else {
            mId = R.id.pizza_menu;
        }
        getLists();
        getAdapter();
        storeInformation = findViewById(R.id.store_information);
        mainFrame = findViewById(R.id.main_frame);
        setupTransitions();
    }

    public void localLocationServices(){
        if(customerLocation == null) {
            Log.i("TAG: ", "localLocationServices START");
            locationReceiver = new DownloadLocationReceiver();
            IntentFilter intentFilter = new IntentFilter(BROADCASTACTION);
            LocalBroadcastManager.getInstance(this).registerReceiver(locationReceiver, intentFilter);
            fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);
            //UNCOMMENT TO ENABLE LOCATION SERVICES
            locationInformation();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    public void getAdapter() {
        menuItemDisplay = findViewById(R.id.recyclerview);
        myadapter = new AllMenuItemsAdapter(mId, this);
        menuItemDisplay.setAdapter(myadapter);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        menuItemDisplay.setLayoutManager(layoutManager);
    }

    public void getPermissions() {
        if (Build.VERSION.SDK_INT > 22) {
            if (checkSelfPermission(permissions[0]) != PackageManager.PERMISSION_GRANTED ||
                    checkSelfPermission(permissions[1]) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(permissions, 1);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (grantResults.length > 0 && grantResults[0] != PackageManager.PERMISSION_GRANTED &&
                grantResults[1] != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "Allow to Use this Application", Toast.LENGTH_SHORT).show();
            System.exit(1);
        } else {
            localLocationServices();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    public void showMap(){
        if(DownloadLocationReceiver.localAddress != null) {
            startActivity(new Intent(getApplicationContext(), MapFragmentActivity.class));
        }
    }

    public void locationInformation() {
        getPermissions();
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        fusedLocationProviderClient.getLastLocation()
                .addOnSuccessListener(this, new OnSuccessListener<Location>() {
                    @Override
                    public void onSuccess(Location location) {
                        /**SharedPreferences sharedPreferences = getSharedPreferences(LOCATIONDATA, MODE_PRIVATE);
                        Log.i("TAG onSUCCESS", sharedPreferences.getString(CUSTOMERLOCATION, "0 0,0 0"));
                        Log.i("TAG onSUCCESS", sharedPreferences.getString(OPENCLOSE, " "));
                        String[] oldLocation =  sharedPreferences.getString(CUSTOMERLOCATION, "0 0,0 0").split(" ");
                        String[] newLocation = String.valueOf(location).split(" ");
                        String oldLocationLngLat = oldLocation[1];
                        String newLocationLngLat = newLocation[1];
                        String[] oLngLat = oldLocationLngLat.split(",");
                        String[] nLngLat= newLocationLngLat.split(",");
                        Float oLng = Float.parseFloat(oLngLat[0]);
                        Float oLat = Float.parseFloat(oLngLat[1]);
                        Float nLng = Float.parseFloat(nLngLat[0]);
                        Float nLat = Float.parseFloat(nLngLat[1]);
                        Float diffLng = Math.abs(nLng) - Math.abs(oLng);
                        Float diffLat = Math.abs(nLat) - Math.abs(oLat);
                        Boolean needNewLocation = false;
                        Log.i("TAG LNG/LAT", String.valueOf(diffLng) + diffLat);
                        if(diffLng > .005 || diffLat > .005){
                            needNewLocation = true;
                        }**/

                        if(DownloadLocationReceiver.localname == null) {
                            Log.i("TAG: ", "locationInformation onSuccess START");
                            Intent intent = new Intent(MainActivity.this, LocationHelper.class);
                            customerLocation = location;
                            //sharedPreferences.edit().putString(CUSTOMERLOCATION, String.valueOf(location)).apply();
                            newSave = true;
                            startService(intent);
                        } else{
                            /**Log.i("TAG onSuccess", "ELSE");
                            DownloadLocationReceiver.phone = Arrays.asList(sharedPreferences.getString(PHONE, " ").split(","));
                            DownloadLocationReceiver.localAddress = Arrays.asList(sharedPreferences.getString(ADDRESS, " ").split("USA,"));
                            DownloadLocationReceiver.localOpenClose = Arrays.asList(sharedPreferences.getString(OPENCLOSE, " ").split(","));
                            DownloadLocationReceiver.hours = Arrays.asList(sharedPreferences.getString(HOURS, " ").split(","));
                            DownloadLocationReceiver.localLat = Arrays.asList(sharedPreferences.getString(LAT, " ").split(","));
                            DownloadLocationReceiver.localLng = Arrays.asList(sharedPreferences.getString(LNG, " ").split(","));
                            DownloadLocationReceiver.photoList = Arrays.asList(sharedPreferences.getString(PHOTOS, " ").split(","));
                            DownloadLocationReceiver.localname = Arrays.asList(sharedPreferences.getString(NAME, " ").split(","));
                            **/
                        }
                    }
                });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int itemId = item.getItemId();
        mId = itemId;
        getLists();
        getAdapter();
        return super.onOptionsItemSelected(item);
    }


    public void getLists() {
        switch (mId) {
            case (R.id.pizza_menu):
                titleList = ItemLists.getPizzaTitleList();
                imageList = ItemLists.getPizzaList();
                descriptionList = ItemLists.getPizzaDescriptionList();
                break;
            case (R.id.appetizers_menu):
                titleList = ItemLists.getAppetizerTitleList();
                imageList = ItemLists.getAppetizersList();
                descriptionList = ItemLists.getAppetizerDescriptionList();
                break;
            case (R.id.sandwiches_menu):
                titleList = ItemLists.getSandwichesTitleList();
                imageList = ItemLists.getSandwichesList();
                descriptionList = ItemLists.getSandwichesDescriptionList();
                break;
            case (R.id.pastas_menu):
                titleList = ItemLists.getPastaTitleList();
                imageList = ItemLists.getPastasList();
                descriptionList = ItemLists.getPastaDescriptionList();
                break;
            case (R.id.salads_menu):
                titleList = ItemLists.getSaladsAndCalzoneTitleList();
                imageList = ItemLists.getSaladsAndCalzoneList();
                descriptionList = ItemLists.getSaladsAndCalzoneDescriptionList();
                break;
            case (R.id.deserts_menu):
                titleList = ItemLists.getDesertTitleList();
                imageList = ItemLists.getDesertsList();
                descriptionList = ItemLists.getDesertDescriptionList();
                break;
            case (R.id.order_menu):
                startActivity(new Intent(this, CheckoutActivity.class));
                break;
            case(R.id.show_map):
                showMap();
                break;
            default:
                break;
        }
    }

    private void setupTransitions () {
        ObjectAnimator animateTranslation = ObjectAnimator.ofFloat(storeInformation, "translationY", 0f);
        ObjectAnimator animateAlpha = ObjectAnimator.ofFloat(mainFrame, "alpha", 1f);
        mainFrame.setAlpha(0f);
        storeInformation.setY(-800f);
        AnimatorSet set = new AnimatorSet();
        set.setDuration(500);
        set.playSequentially(animateTranslation, animateAlpha);
        set.start();
    }

    public void saveData(){
        SharedPreferences sharedPreferences = getSharedPreferences(LOCATIONDATA, MODE_PRIVATE);
        String string = sharedPreferences.getString(NAME, " ");
        String teststring = String.valueOf(DownloadLocationReceiver.localname);
        if(!string.equals(teststring));{
            sharedPreferences.edit().putString(PHONE, String.valueOf(DownloadLocationReceiver.phone)).apply();
            sharedPreferences.edit().putString(ADDRESS, String.valueOf(DownloadLocationReceiver.localAddress)).apply();
            sharedPreferences.edit().putString(OPENCLOSE, String.valueOf(DownloadLocationReceiver.localOpenClose)).apply();
            sharedPreferences.edit().putString(HOURS, String.valueOf(DownloadLocationReceiver.hours)).apply();
            sharedPreferences.edit().putString(LAT, String.valueOf(DownloadLocationReceiver.localLat)).apply();
            sharedPreferences.edit().putString(LNG, String.valueOf(DownloadLocationReceiver.localLng)).apply();
            sharedPreferences.edit().putString(PHOTOS, String.valueOf(DownloadLocationReceiver.photoList)).apply();
            sharedPreferences.edit().putString(NAME, String.valueOf(DownloadLocationReceiver.localname)).apply();
            sharedPreferences.edit().putString(CUSTOMERLOCATION, String.valueOf(customerLocation)).apply();
            Log.i("TAG saveDATA", String.valueOf(customerLocation));
            Log.i("TAG saveDATA", String.valueOf(DownloadLocationReceiver.localname));
        }

    }
}