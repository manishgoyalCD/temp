import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsString } from 'class-validator';
import { number } from 'joi';
import { Types, Document } from 'mongoose';
import { RestaurantEntity } from 'src/modules/restaurants/schemas/restaurant.schema';
import { UserEntity } from 'src/modules/user/schemas/user.schema';


@Schema({ timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
}, versionKey: false })

export class ReviewEntity {
    @Prop({
        required: true,
    })
    _id: Types.ObjectId;

    @Prop({
        required: false,
        index: true,
    })
    google_id: string;
    
    @Prop({
        required: true,
        index: true,
        type: Types.ObjectId,
        ref: RestaurantEntity.name
    })
    restaurant_id: Types.ObjectId;

    @Prop({
        required: false,
        index: true,
        type: Types.ObjectId,
        ref: ReviewEntity.name
    })
    review_id: Types.ObjectId;

    @Prop({
        required: false,
        index: true,
        type: Types.ObjectId,
        ref: UserEntity.name
    })
    user_id: Types.ObjectId;

    @Prop({
        required: true,
        index: false,
    })
    comment: string;

    @Prop({
        required: true,
        index: true,
    })
    rating: number;

    @Prop({
        required: true,
        index: true,
    })
    source: string;

    @Prop({
        required: true,
        index: false,
        type: [String]
    })
    images: [string];

    @Prop({
        required: true,
        index: false,
        type: [String]
    })
    videos: [string];

    @Prop({
        required: false,
        index: true,
        type: Boolean,
        default: false
    })
    is_verified: boolean;


}

export const ReviewDatabaseName = 'reviews';
export const ReviewSchema = SchemaFactory.createForClass(ReviewEntity);

export type ReviewDocument = ReviewEntity & Document;

// Hooks
ReviewSchema.pre<ReviewDocument>('save', function (next) {
    next();
});
