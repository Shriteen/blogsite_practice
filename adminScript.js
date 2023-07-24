const readlineSync=require('readline-sync');

const mongoose= require('mongoose');
mongoose.set('strictQuery',false);
const mongodb='mongodb://127.0.0.1/blogsite';

const Admin=require('./models/adminModel');

main().catch((err)=>
    {
	console.log(err);
	process.exit(1);
    });

async function main()
{
    await mongoose.connect(mongodb);
    
    console.log("Creating Admin User");
    const username = readlineSync.question("Enter Admin Username:");
    const password = readlineSync.questionNewPassword("Enter New Password:", { min: 8 });

    if(username.length==0)
    {
	console.log("Error: Username is Required");
	process.exit(1);
    }
    
    const user= new Admin({
	username, password
    });

    const exists= await Admin.findOne({username});
    if(exists) {
	console.log("Error: Username already exists");
	process.exit(1);
    } else {
	await user.save();
    }
    
    process.exit();
}
