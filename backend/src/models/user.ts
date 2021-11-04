import { Schema, Document, model, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserData extends Document {
    _id : ObjectId;
    username : string;
    email : string;
    password : string;
    validatePassword(password:string): Promise<boolean>;
}

const userSchema : Schema = new Schema({
    username : {
        type: String,
        required : true
        
    },
    email : {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true
    }

});

userSchema.methods.validatePassword = async function(enteredPassword) {
        
    return await bcrypt.compare(enteredPassword, this.password)

} 
userSchema.pre("save", async function(next) {
    if(!this.isModified('password')) next()

    const salt = await bcrypt.genSalt(15);

    this.password = await bcrypt.hash(this.password, salt);
    
})


export default model<IUserData> ("User", userSchema);