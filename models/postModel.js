const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const {DateTime} = require('luxon');

const PostSchema= new Schema(
    {
	title: { type: String, required: true, minLength: 1 },
	author: { type: Schema.Types.ObjectId,
		  ref: 'Author',
		  required: true,
		  minLength: 1
		},
	content: { type: Schema.Types.Mixed, required: true },
	editorAdmins: [{
	    type: Schema.Types.ObjectId,
	    ref: 'Admin',
	    required: true,
	}],
	comments: [ {
	    commentorName: { type: String, required: true, minLength: 1 },
	    commentContent: { type: String, required: true, minLength: 1 },
	    commentTimestamp: { type: Date, required: true }
	} ],
	tags: [{
	    type: Schema.Types.String,
	    minLength: 1	    
	}]
    },
    {
	timestamps: {
	    createdAt: "createdOn",
	    updatedAt: "lastEditedOn"
	},
	toJSON: { virtuals: true }, // include virtual properties when converted to string
	id: false		    // do not include id virtual property (clone of _id)
	                            // (was getting redundant in JSON as virtuals are included)
    }
);

PostSchema.virtual("url").get(function () {
    return `/posts/${this._id}`;
});

PostSchema.virtual("createdOnHumanReadable").get(function () {
    return DateTime.fromJSDate(this.createdOn).toLocaleString(DateTime.DATE_MED);
});

PostSchema.virtual("lastEditedOnHumanReadable").get(function () {
    return DateTime.fromJSDate(this.lastEditedOn).toLocaleString(DateTime.DATE_MED);
});



module.exports= mongoose.model('Post',PostSchema);
