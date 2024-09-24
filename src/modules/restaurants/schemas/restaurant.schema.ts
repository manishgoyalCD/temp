import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsString } from 'class-validator';
import { number } from 'joi';
import { Types, Document } from 'mongoose';


interface PriceRange {
    from: string;
    to: string;
    txt: string;
}


@Schema({ timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
}, versionKey: false })


export class RestaurantEntity {
    @Prop({
        required: true,
    })
    _id: Types.ObjectId;
    
    @Prop({
        required: true,
        unique: true,
        index: true,
    })
    source_id: string;

    @Prop({
        required: true,
    })
    name: string;

    @Prop({
        required: false,
        default: ""
    })
    phone_no: string;
    
    @Prop({
        required: false,
        default: ""
    })
    website: string;
    
    @Prop({
        required: false,
        default: ""
    })
    image: string;

    @Prop({
        required: false,
        default: ""
    })
    city: string;
    
    @Prop({
        required: false,
        default: ""
    })
    state: string;
    
    @Prop({
        required: false,
        default: ""
    })
    address: string;
    
    @Prop({
        required: false,
        default: ""
    })
    plush_code: string;

    @Prop({
        required: false,
        default: ""
    })
    description: string;

    @Prop({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true,
            index: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    })
    location: {
        type: string;
        coordinates: number[];
    };

    @Prop({
        index: false,
        type: Array,
        default: [],
    })
    images: [];

    @Prop({
        index: false,
        type: Array,
        default: [],
    })
    opening_hours: [];

    @Prop({
        index: false,
        type: Array,
        default: [],
    })
    amenities: [];

    @Prop({
        index: false,
        type: Array,
        default: [],
    })
    cuisines: [string];

    @Prop({
        index: true,
        type: Array,
        default: [],
    })
    dishes: [string];

    @Prop({
        required: true,
        index: true,
        type: {
            min: Number, 
            max: {
                type: Number,
                default: null
            },  
            currency: String, 
            text: String
        }
    })
    price: {min: number, max: number | null,  currency: string, text: string};
    
    @Prop({
        index: true,
        type: Number,
        default: 0,
    })
    reviews_count: number;
    
    @Prop({
        index: true,
        type: String,
        default: 'one-menus',
    })
    source: string;

    @Prop({
        index: true,
        type: Number,
        default: 0,
    })
    likes_count: number;

    
}

export const RestaurantDatabaseName = 'restaurant_master';
export const RestaurantSchema = SchemaFactory.createForClass(RestaurantEntity);

export type RestaurantDocument = RestaurantEntity & Document;

// Hooks
RestaurantSchema.pre<RestaurantDocument>('save', function (next) {
    next();
});
