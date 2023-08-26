package gemenielabs.italian.Adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

import gemenielabs.italian.R;


public class OrderSummaryAdapter extends RecyclerView.Adapter<OrderSummaryAdapter.OrderHolder> {

    public ListViewClickListener mListener;
    public ArrayList<String> mItemList;

    public OrderSummaryAdapter(ListViewClickListener listener, ArrayList<String> itemList) {
        mListener = listener;
        mItemList = itemList;
    }

    @Override
    public OrderHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.order_recycler, parent, false);
        OrderHolder viewHolder = new OrderHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(OrderHolder holder, int position) {
        holder.textview.setText(mItemList.get(position));
        holder.imageView.setImageResource(android.R.drawable.button_onoff_indicator_off);
    }

    @Override
    public int getItemCount() {
        return mItemList.size();
    }

    public interface ListViewClickListener{
        void onListItemClicked(int clickedPosition);
    }

    class OrderHolder extends RecyclerView.ViewHolder
    implements View.OnClickListener{
        TextView textview;
        ImageView imageView;

        public OrderHolder(View itemView) {
            super(itemView);
            textview = itemView.findViewById(R.id.order_summary_text_view);
            imageView = itemView.findViewById(R.id.imageView3);
            itemView.setOnClickListener(this);
        }


        @Override
        public void onClick(View v) {
            int clicked = getAdapterPosition();
            mListener.onListItemClicked(clicked);
        }
    }
}
