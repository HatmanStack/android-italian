package gemenielabs.italian.Adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import gemenielabs.italian.MainActivity;
import gemenielabs.italian.NutritionInfoActivity;
import gemenielabs.italian.OrderActivity;
import gemenielabs.italian.R;

public class AllMenuItemsAdapter extends RecyclerView.Adapter<AllMenuItemsAdapter.ViewHolder> {

    int mId;
    Context mContext;
    public static final String ID = "id";
    public static final String TITLE = "title";
    public static final String DESCRIPTION = "description";
    public static final String IMAGE = "image";
    public static final String POSITION = "position";

    public AllMenuItemsAdapter(int id, Context context) {
        mId = id;
        mContext = context;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int viewType) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.allitemslayout, viewGroup, false);
        ViewHolder viewHolder = new ViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        holder.titleOfItem.setText((String) MainActivity.titleList.get(position));
        holder.descriptionOfItem.setText((String) MainActivity.descriptionList.get(position));
        holder.imageOfItem.setImageResource((int) MainActivity.imageList.get(position));
        holder.seperateImage.setImageResource(android.R.drawable.button_onoff_indicator_off);
        holder.itemView.setTag("101");
    }

    @Override
    public int getItemCount() {
            return MainActivity.titleList.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder
            implements View.OnClickListener {

        TextView titleOfItem;
        TextView descriptionOfItem;
        TextView orderNow;
        ImageView imageOfItem;
        ImageView seperateImage;

        public ViewHolder(View itemView) {
            super(itemView);
            titleOfItem = itemView.findViewById(R.id.title_item);
            descriptionOfItem = itemView.findViewById(R.id.description_item);
            imageOfItem =  itemView.findViewById(R.id.image_item);
            orderNow = itemView.findViewById(R.id.order_now);
            seperateImage = itemView.findViewById(R.id.imageView2);
            orderNow.setOnClickListener(this);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            int clickedPosition = getAdapterPosition();
            Intent intent;
            if(v.getTag().equals("100")){
                intent = new Intent(mContext, OrderActivity.class);
                if(mId == R.id.deserts_menu && clickedPosition == 4) {
                    intent = new Intent(mContext, NutritionInfoActivity.class);
                }
            } else {
                intent = new Intent(mContext, NutritionInfoActivity.class);
            }
            if(mId == R.id.pizza_menu && clickedPosition == 22){
                mId = R.string.action_calzones;
            }
            intent.putExtra(ID, mId);
            intent.putExtra(POSITION, clickedPosition);
            intent.putExtra(TITLE, (String) MainActivity.titleList.get(clickedPosition));
            intent.putExtra(DESCRIPTION, (String) MainActivity.descriptionList.get(clickedPosition));
            intent.putExtra(IMAGE, (int) MainActivity.imageList.get(clickedPosition));
            mContext.startActivity(intent);
        }
    }
}

