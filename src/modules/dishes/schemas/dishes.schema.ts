import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsString } from 'class-validator';
import { number } from 'joi';
import { Types, Document } from 'mongoose';
import { RestaurantEntity } from 'src/modules/restaurants/schemas/restaurant.schema';


@Schema({ timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
}, versionKey: false })

export class DishesEntity {
    @Prop({
        required: true,
    })
    _id: Types.ObjectId;
    
    @Prop({
        required: true,
        index: true,
        type: Types.ObjectId,
        ref: RestaurantEntity.name
    })
    restaurant_id: Types.ObjectId;
    
    @Prop({
        required: true,
        index: true,
    })
    source_id: string;

    @Prop({
        required: true,
        index: false,
    })
    name: string;

    @Prop({
        required: true,
        index: false,
    })
    description: string;

    @Prop({
        required: true,
        index: true,
        type: Number,
    })
    price: number;
    
    @Prop({
        required: true,
        index: true,
        type: String,
        default: "$"
    })
    currency: string;

    @Prop({
        required: true,
        index: true,
        type: String,
    })
    price_text: string;
    
    @Prop({
        required: false,
        index: true,
    })
    quantity: number;
    

    @Prop({
        required: false,
        index: false,
        type: [String]
    })
    images: [string];

    @Prop({
        required: false,
        index: false,
        type: [String]
    })
    videos: [string];

    @Prop({
        required: true,
        index: false,
        type: [String]
    })
    type: [string];
    
    @Prop({
        required: false,
        index: true,
        default: 0
    })
    calories: number;

    @Prop({
        required: false,
        index: false,
        default: []
    })
    ingredients: [string];

    @Prop({
        required: false,
        index: false,
        default: []
    })
    addons: [string];

    @Prop({
        required: false,
        index: true,
        default: true
    })
    is_veg: boolean;


}

export const DishesDatabaseName = 'dishes';
export const DishesSchema = SchemaFactory.createForClass(DishesEntity);

export type DishesDocument = DishesEntity & Document;

// Hooks
DishesSchema.pre<DishesDocument>('save', function (next) {
    next();
});
