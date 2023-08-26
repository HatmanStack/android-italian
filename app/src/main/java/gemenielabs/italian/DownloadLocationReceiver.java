package gemenielabs.italian;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;


import java.util.List;

public class DownloadLocationReceiver extends BroadcastReceiver {

    public static List localLat;
    public static List localLng;
    public static List localAddress;
    public static List localOpenClose;
    public static List phone;
    public static List hours;
    public static List photoList;
    public static List localname;


    DownloadLocationReceiver(){}
    @Override
    public void onReceive(Context context, Intent intent) {
        localLat = intent.getStringArrayListExtra(MainActivity.LAT);
        localLng = intent.getStringArrayListExtra(MainActivity.LNG);
        localAddress = intent.getStringArrayListExtra(MainActivity.ADDRESS);
        localOpenClose = intent.getStringArrayListExtra(MainActivity.OPENCLOSE);
        phone = intent.getStringArrayListExtra(MainActivity.PHONE);
        hours = intent.getStringArrayListExtra(MainActivity.HOURS);
        photoList = intent.getStringArrayListExtra(MainActivity.PHOTOS);
        localname = intent.getStringArrayListExtra(MainActivity.NAME);

        Log.i("TAG Download", String.valueOf(localLat));
        Log.i("TAG Download", String.valueOf(localAddress));
        Log.i("TAG Download", String.valueOf(localOpenClose));
        Log.i("TAG Download", String.valueOf(phone));
        Log.i("TAG Download", String.valueOf(hours));
        Log.i("TAG Download", String.valueOf(photoList));
        Log.i("TAG Download", String.valueOf(localname));
        Log.i("TAG Download", String.valueOf(MainActivity.customerLocation));
    }

}
