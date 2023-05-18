package gemenielabs.italian.Data;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Scanner;

import gemenielabs.italian.MainActivity;

public class LocationHelper extends IntentService {

    ArrayList<String> phoneNumber = new ArrayList<>();
    ArrayList<String> photos = new ArrayList<>();
    ArrayList<String> hours = new ArrayList<>();
    ArrayList<String> openClose = new ArrayList<>();
    ArrayList<String> placeId = new ArrayList<>();
    ArrayList<String> addressString = new ArrayList<>();
    ArrayList<String> latString = new ArrayList<>();
    ArrayList<String> lngString = new ArrayList<>();
    ArrayList<String> name = new ArrayList<>();
    double lat;
    double lng;

    public LocationHelper() {
        super("LocationHelperThread");
        setIntentRedelivery(true);
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        getLocation();
    }


    public void getLocation () {
        Log.i("TAG:  ", "getLocation START");
        String searchLatLng;
        if(MainActivity.customerLocation != null) {
            String lat = String.valueOf(MainActivity.customerLocation.getLatitude());
            String lng = String.valueOf(MainActivity.customerLocation.getLongitude());
            searchLatLng = lat + "," + lng;
        }else {
            Toast.makeText(this, "Turn on Location Services", Toast.LENGTH_SHORT).show();
            searchLatLng = "37.7749,-122.4194";
        }
        URL url = null;
        try {
            url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
                    searchLatLng + "&radius=10000&type=restaurant&keyword=Pizza&key=AIzaSyACUQsBoQ4Fx5eogS0fZN_6nd7Gwtv7IZU");
            Log.i("TAG:  ", String.valueOf(url));
        } catch (Exception e) {
            e.printStackTrace();
        }
        HttpURLConnection urlConnection = null;
        String mapJson = "";
        try {
            urlConnection = (HttpURLConnection) url.openConnection();
            InputStream in = urlConnection.getInputStream();
            Scanner scanner = new Scanner(in);
            scanner.useDelimiter("\\A");
            boolean hasInput = scanner.hasNextLine();
            while (hasInput) {
                mapJson += scanner.nextLine().replace(" ", "");
                hasInput = scanner.hasNextLine();
            }

            JSONObject mapData = new JSONObject(mapJson);
            JSONArray arr = mapData.getJSONArray("results");
            Log.i("TAG: ", String.valueOf(arr));
            for (int i = 0; i < arr.length(); i++) {
                lat = arr.getJSONObject(i).getJSONObject("geometry").getJSONObject("location").getDouble("lat");
                lng = arr.getJSONObject(i).getJSONObject("geometry").getJSONObject("location").getDouble("lng");
                latString.add(String.valueOf(lat));
                lngString.add(String.valueOf(lng));

                String photoID = arr.getJSONObject(i).getJSONArray("photos").getJSONObject(0).getString("photo_reference");
                photos.add(photoID);
                Boolean open = arr.getJSONObject(i).getJSONObject("opening_hours").getBoolean("open_now");
                placeId.add(arr.getJSONObject(i).getString("place_id"));

                String openString = "CLOSED";
                if (open) {
                    openString = "OPEN";
                }
                openClose.add(openString);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            urlConnection.disconnect();
        }
        for (int i = 0; i < placeId.size(); i++) {
            try {

                mapJson = "";
                URL localUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json?placeid=" +
                        placeId.get(i) + "&key=AIzaSyACUQsBoQ4Fx5eogS0fZN_6nd7Gwtv7IZU");

                Log.i("TAG:  localUrl ", String.valueOf(localUrl));
                urlConnection = (HttpURLConnection) localUrl.openConnection();
                InputStream in = urlConnection.getInputStream();
                Scanner scanner = new Scanner(in);
                scanner.useDelimiter("\\A");

                boolean hasInput = scanner.hasNextLine();
                while (hasInput) {
                    mapJson += scanner.nextLine();
                    hasInput = scanner.hasNextLine();
                }
                JSONObject jsonObject = new JSONObject(mapJson);
                name.add(jsonObject.getJSONObject("result").getString("name"));
                addressString.add(jsonObject.getJSONObject("result").getString("formatted_address"));
                phoneNumber.add(jsonObject.getJSONObject("result").getString("formatted_phone_number"));
                String storeHours = jsonObject.getJSONObject("result").getJSONObject("opening_hours").getString("weekday_text");
                storeHours = storeHours.replace(",", "\n").replace("\"", "").replace("[", "").replace("]", "");
                hours.add(storeHours);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                urlConnection.disconnect();
            }
        }
        deliverResults();
    }

    public void deliverResults(){
        Intent intent = new Intent(MainActivity.BROADCASTACTION);
        intent.putStringArrayListExtra(MainActivity.LAT, latString);
        intent.putStringArrayListExtra(MainActivity.LNG, lngString);
        intent.putStringArrayListExtra(MainActivity.ADDRESS, addressString);
        intent.putStringArrayListExtra(MainActivity.OPENCLOSE, openClose);
        intent.putStringArrayListExtra(MainActivity.PHONE, phoneNumber);
        intent.putStringArrayListExtra(MainActivity.HOURS, hours);
        intent.putStringArrayListExtra(MainActivity.PHOTOS, photos);
        intent.putStringArrayListExtra(MainActivity.NAME, name);

        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }

}
