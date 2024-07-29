import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "merchant" | "customer";
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  // Merchant-specific fields
  businessName?: string;
  integrationSettings?: {
    [key: string]: any;
  };
  // Purchaser-specific fields
  savedPaymentMethods?: {
    type: string;
    lastFour: string;
    expiryDate: string;
    billingAddress?: {
      line1: string;
      line2?: string;
      city: string;
      county: string;
      postalCode: string;
      country: string;
    };
    token?: string;
  }[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["merchant", "customer"], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String },
    businessName: { type: String },
    integrationSettings: { type: Schema.Types.Mixed },
    savedPaymentMethods: [
      {
        type: { type: String },
        lastFour: { type: String },
        expiryDate: { type: String },
        billingAddress: {
          line1: { type: String },
          line2: { type: String },
          city: { type: String },
          county: { type: String },
          postalCode: { type: String },
          country: { type: String },
        },
        token: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
