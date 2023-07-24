const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bcrypt= require('bcrypt');

const AdminSchema= new Schema({
    username: { type: String, required: true, minLength: 1, maxLength: 100, unique: true },
    password: { type: String, required: true, minLength: 8 }
    
});

AdminSchema.pre("save", async function(){
    if(this.isModified('password'))
    {
	// 10 saltRounds
	this.password= await bcrypt.hash(this.password, 10);
    }
});

AdminSchema.methods.verifyPassword= function(password)
{
    return bcrypt.compareSync(password,this.password);
};

module.exports= mongoose.model('Admin',AdminSchema);
