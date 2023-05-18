package gemenielabs.italian;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.app.NavUtils;
import androidx.fragment.app.FragmentActivity;


import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.squareup.picasso.Callback;
import com.squareup.picasso.Picasso;


public class MapFragmentActivity extends FragmentActivity
        implements OnMapReadyCallback, GoogleMap.OnInfoWindowClickListener {

    private static final String TAG = "TAG";
    private SupportMapFragment mapFragment;
    private View mWindow;
    private TextView title;
    private TextView address;
    private TextView openCloseTextView;
    private ImageView imageView;
    public static final String HOURS = "hours";
    public static final String PHONENUMBER = "phonenumber";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map_fragment);
        mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.this_gd_map);
        mWindow = getLayoutInflater().inflate(R.layout.info_window_layout, null);
        title = mWindow.findViewById(R.id.map_title);
        address = mWindow.findViewById(R.id.map_address);
        openCloseTextView = mWindow.findViewById(R.id.map_open_close);
        imageView = mWindow.findViewById(R.id.map_gp_logo);
        getActionBar().setDisplayHomeAsUpEnabled(true);
        Intent intent = getIntent();
        if(intent.getIntExtra(CheckoutActivity.StartMapFromCheckOut, 0) > 1){

        }

        mapFragment.getMapAsync(this);
    }

    @Override
    public void onMapReady(GoogleMap map) {
        LatLng latLng;

        if(MainActivity.customerLocation != null) {
            latLng = new LatLng(MainActivity.customerLocation.getLatitude(), MainActivity.customerLocation.getLongitude());
        }else {
            latLng = new LatLng(37.61,-97.24);
        }
        GoogleMap.InfoWindowAdapter infoWindowAdapter = null;
        //map.addMarker(new MarkerOptions().position(latLng).icon(BitmapDescriptorFactory.
        //        fromResource(R.drawable.place_icon)));
        if(DownloadLocationReceiver.localLat != null) {
            Log.i(TAG, "onMapReady: " + DownloadLocationReceiver.localLat);
            for (int i = 0; i < DownloadLocationReceiver.localLat.size() -1; i++) {
                LatLng localLatLng = new LatLng(Double.parseDouble((String) DownloadLocationReceiver.localLat.get(i)),
                        Double.parseDouble((String) DownloadLocationReceiver.localLng.get(i)));
                map.addMarker(new MarkerOptions().position(localLatLng).icon(BitmapDescriptorFactory.fromResource(R.drawable.ic_local_pizza))).setTag(i);
                map.addMarker(new MarkerOptions().position(latLng).title("Location"));
                Log.i("TAG:  CREATEMaPMarker ", String.valueOf(i));
                Log.i("TAG:  CREATEMaPMarker ", String.valueOf(DownloadLocationReceiver.localname.get(i)));
                Log.i("TAG:  CREATEMaPMarker ", String.valueOf(DownloadLocationReceiver.localAddress.get(i)));
                infoWindowAdapter = new GoogleMap.InfoWindowAdapter() {
                    @Override
                    public View getInfoWindow(Marker marker) {
                        int tag = (int) marker.getTag();
                        Log.i("TAG: TAG ", String.valueOf(tag));
                        title.setText((String) DownloadLocationReceiver.localname.get(tag));
                        Log.i("TAG: getInfoWindow ", String.valueOf(DownloadLocationReceiver.localAddress.get(tag)));
                        String string = (String) DownloadLocationReceiver.localAddress.get(tag);
                        String[] a = string.split(",");
                        address.setText(a[0]);
                        openCloseTextView.setText((String) DownloadLocationReceiver.localOpenClose.get(tag));

                        Picasso.get().load("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
                                DownloadLocationReceiver.photoList.get(tag) + "&key=AIzaSyACUQsBoQ4Fx5eogS0fZN_6nd7Gwtv7IZU")
                                .placeholder(R.drawable.ic_pizza_logo).into(imageView, new MarkerCallback(marker));

                        return mWindow;
                    }

                    @Override
                    public View getInfoContents(Marker marker) {
                        return null;
                    }
                };
            }
        }
        Log.i("TAG: ", String.valueOf(MainActivity.customerLocation));
        LatLng closeLatLng = new LatLng(Double.parseDouble((String) DownloadLocationReceiver.localLat.get(0)),Double.parseDouble((String) DownloadLocationReceiver.localLng.get(0)));
        map.moveCamera(CameraUpdateFactory.newLatLngZoom(closeLatLng, 13));
        map.setInfoWindowAdapter(infoWindowAdapter);
        map.setOnInfoWindowClickListener(this);
    }

    @Override
    public void onInfoWindowClick(Marker marker) {
        Intent intent = new Intent(this, ContactActvity.class);
        int tag = (int) marker.getTag();
        intent.putExtra(HOURS, (String) DownloadLocationReceiver.hours.get(tag));
        intent.putExtra(PHONENUMBER, (String) DownloadLocationReceiver.phone.get(tag));
        startActivity(intent);
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

    private class MarkerCallback implements Callback {
        Marker marker = null;
        public MarkerCallback(Marker marker) {
            this.marker=marker;
        }

        @Override
        public void onSuccess(){
            if (marker != null && marker.isInfoWindowShown()){
                marker.hideInfoWindow();
                marker.showInfoWindow();
            }
        }

        @Override
        public void onError(Exception e) {
            Log.e(getClass().getSimpleName(), "Error loading image");
        }
    }
}
