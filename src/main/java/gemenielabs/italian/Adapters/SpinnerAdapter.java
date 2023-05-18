package gemenielabs.italian.Adapters;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

import gemenielabs.italian.OrderActivity;
import gemenielabs.italian.R;

import static java.lang.Boolean.TRUE;

public class SpinnerAdapter extends RecyclerView.Adapter<SpinnerAdapter.ViewHolder> {

    public Context mContext;
    public ItemSelectedListener mItemSelectedListener;
    public ArrayList<Integer> spinnerADDNO;
    public int[] spinnerP;
    public int mPosition;

    public SpinnerAdapter(ItemSelectedListener listener, Context context, ArrayList<Integer> spinner,
                          int[] spinnerPosition, int position) {
        mContext = context;
        mItemSelectedListener = listener;
        spinnerADDNO = spinner;
        spinnerP = spinnerPosition;
        mPosition = position;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.spinner_recycler, parent, false);
        ViewHolder viewHolder = new ViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Log.i("TAG: onBindViewHolder", "START");
        Log.i("TAG:onBindViewHolder:Sp", spinnerADDNO.get(position) + "");
        Log.i("TAG:onBindView:spinnerP", spinnerP[position] + "");
        int resource = spinnerADDNO.get(position);
        int resId = 0;
        if (resource == R.string.action_calzones) {
            resId = R.array.appetizer_size_medium;
            holder.textView.setText(mContext.getResources().getString(R.string.order_SIZE));
        }
        if(resource == R.id.pizza_menu) {
            if (position == 0) {
                resId = R.array.size_array;
                holder.textView.setText(mContext.getResources().getString(R.string.order_SIZE));
            }else {
                resId = R.array.crust_array;
                resource = R.string.order_CRUST;
                holder.spinner.setTag(resource);
                holder.textView.setText(mContext.getResources().getString(R.string.order_CRUST));
            }
        }
        if(resource == R.id.appetizers_menu) {
            if (mPosition == 0 || mPosition == 5 || mPosition == 6) {
                resId = R.array.appetizer_size_large;
            } else if (mPosition == 1 || mPosition == 2 || mPosition == 3 || mPosition == 7 || mPosition == 8) {
                resId = R.array.appetizer_size_medium;
            } else {
                resId = R.array.appetizer_size_small;
            }
            holder.spinner.setTag(resId);
        }
        if(resource == R.id.pastas_menu) {
            resId = R.array.pasta_size_array;
        }
        if(resource == R.id.salads_menu) {
            resId = R.array.appetizer_size_medium;
        }
        if(resource == R.id.deserts_menu) {
            resId = R.array.desert_size_array;
            if(mPosition == 3){
                resId = R.array.appetizer_size_small;
            }
        }
        if(resource == R.string.order_ADD || resource == R.string.order_NO ||
                resource == R.string.order_STUFFING) {
            resId = R.array.toppings_array;
            holder.spinner.setTag(resource);
            holder.textView.setText(mContext.getResources().getString(R.string.order_TOPPINGS));
        }
        holder.spinner.setTag(resource);

        if(resource == R.id.sandwiches_menu){
            return;
        }
        if(resource == R.string.pizza_left){
            holder.textView.setText(resource);
            resId = R.array.half_toppings_array;
        }
        if(resource == R.string.pizza_right){
            holder.textView.setText(resource);
            resId = R.array.half_toppings_array;
        }
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(mContext, resId,
                android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        holder.spinner.setAdapter(adapter);
        Log.i("TAG: BIND ", holder.textView.getText().toString());
        holder.spinner.setSelection(spinnerP[position]);
        }


    public interface ItemSelectedListener{
            void onAdapterItemSelected(Object tag, String id, int spinnerNumber, int clickedPosition);
        }

    @Override
    public int getItemCount() {
        return spinnerADDNO.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder
        implements AdapterView.OnItemSelectedListener{

        public Spinner spinner;
        public TextView textView;

        public ViewHolder(View itemView) {
            super(itemView);
            spinner = itemView.findViewById(R.id.spinner);
            textView = itemView.findViewById(R.id.item_textView);
            spinner.setOnItemSelectedListener(this);
        }

        @Override
        public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
            mItemSelectedListener.onAdapterItemSelected(spinner.getTag(), (String) adapterView.getItemAtPosition(i),
                    getAdapterPosition(), i);
        }

        @Override
        public void onNothingSelected(AdapterView<?> adapterView) {

        }
    }
}
