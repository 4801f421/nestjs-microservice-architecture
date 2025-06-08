// apps/users-service/src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Defines the available user plans for type safety and consistency.
 */
export enum UserPlan {
    FREE = 'free',
    PREMIUM = 'premium',
}

@Schema({
    // This option automatically adds `createdAt` and `updatedAt` timestamp fields.
    timestamps: true,
})
export class User extends Document {
    @Prop({
        required: true,
        unique: true,
        trim: true, // Automatically removes whitespace from the start and end.
        lowercase: true,
    })
    email: string;

    @Prop({
        required: true,
        // SECURITY BEST PRACTICE: This ensures the password hash is NOT returned in queries by default.
        select: false,
    })
    password: string;

    @Prop({
        type: String, // Mongoose needs the type explicitly for enums.
        enum: UserPlan,
        default: UserPlan.FREE,
    })
    plan: UserPlan;

    @Prop({
        type: [String], // Defines an array of strings.
        default: ['user'],
    })
    roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
