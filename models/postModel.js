const mongoose=require('mongoose');
const Schema=mongoose.Schema;

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
	} ]
    },
    {
	timestamps: {
	    createdAt: "createdOn",
	    updatedAt: "lastEditedOn"
	}
    }
);

PostSchema.virtual("url").get(function () {
    return `/posts/${this._id}`;
});

module.exports= mongoose.model('Post',PostSchema);
