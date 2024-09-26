import { Types } from "mongoose";

// Define the RestaurantSource interface
export interface IRestaurant {
    _id: string | Types.ObjectId;
    source_id: string;
    name: string;
    phone_no: string;
    website: string;
    image: string;
    city: string;
    state: string;
    address: string;
    plush_code: string;
    description: string;
    location: {
      type: string;
      coordinates: number[];
    };
    images: any[]; 
    opening_hours: any; 
    amenities: any[]; 
    cuisines: any[]; 
    dishes: any[]; 
    price: {
      min: number;
      max: number;
      currency: string;
    };
    source: string;
    reviews_count: number;
    likes_count: number;
}