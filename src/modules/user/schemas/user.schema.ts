import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';


@Schema({ timestamps: true, versionKey: false })
export class UserEntity {
    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
    })
    first_name: string;

    @Prop({
        required: false,
        index: true,
        lowercase: true,
        trim: true,
    })
    last_name: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email: string;

    @Prop({
        required: true,
        index: true,
        // unique: true,
    })
    phone_no: number;

    @Prop({
        required: false,
        index: true,
        default: null
    })
    dob: Date;

    @Prop({
        required: false,
        index: true,
        default: null
    })
    gender: string;

    @Prop({
        required: false,
        index: true,
    })
    oauth_token?: string;


    @Prop({
        required: true,
        select: false
    })
    password: string;

    @Prop({
        required: true,
        index: true,
    })
    password_expired: Date;

    @Prop({
        required: true,
        select: false
    })
    salt: string;

    @Prop({
        required: true,
        default: true,
        index: true,
    })
    is_active: boolean;

    @Prop({
        required: false,
        _id: false,
        type: {
            path: String,
            pathWithFilename: String,
            filename: String,
            completedUrl: String,
            baseUrl: String,
            mime: String,
        },
    })
    photo?: AwsS3Serialization | "";


    @Prop({
        required: false,
        _id: false,
        type: {
            path: String,
            pathWithFilename: String,
            filename: String,
            completedUrl: String,
            baseUrl: String,
            mime: String,
        },
    })
    poster?: AwsS3Serialization | "";

    
}

export const UserDatabaseName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

// Hooks
UserSchema.pre<UserDocument>('save', function (next) {
    this.email = this.email.toLowerCase();
    this.first_name = this.first_name.toLowerCase();
    this.last_name = this.last_name.toLowerCase();

    next();
});
