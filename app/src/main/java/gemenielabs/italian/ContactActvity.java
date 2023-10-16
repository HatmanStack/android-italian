package gemenielabs.italian;

import android.app.Activity;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.app.NavUtils;


public class ContactActvity extends Activity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_actvity);
        TextView phoneNumberTextView = findViewById(R.id.contact_phonenumber);
        TextView hoursTextView = findViewById(R.id.contact_hours);
        phoneNumberTextView.setText(getIntent().getStringExtra(MapFragmentActivity.PHONENUMBER));
        hoursTextView.setText(getIntent().getStringExtra(MapFragmentActivity.HOURS));
        getActionBar().setDisplayHomeAsUpEnabled(true);
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            NavUtils.navigateUpFromSameTask(this);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

}
