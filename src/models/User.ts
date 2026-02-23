// src/models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Veritabanı dokümanımızın TypeScript arayüzü
export interface IUser extends Document {
    email: string;
    password?: string;
    githubUsername: string;
    aboutMe?: string;
    linkedinUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please provide an email address.'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password.'],
            minlength: [6, 'Password must be at least 6 characters long.'],
        },
        githubUsername: {
            type: String,
            required: [true, 'GitHub username is required to fetch repository data.'],
            trim: true,
        },
        aboutMe: {
            type: String,
            default: '',
            maxlength: [500, 'About me section cannot exceed 500 characters.'],
        },
        linkedinUrl: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;