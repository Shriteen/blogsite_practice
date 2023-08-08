const express= require('express');
const multer  = require('multer');

function editorjsImageHandler(uploadLocation)
{
    const router= express.Router();
    const upload = multer({ dest: uploadLocation });
    
    router.post('/editorJsImageHandler', upload.single('image') ,
		function(req, res){
		    res.json({
			"success": 1,
			"file": {
			    "url": '/'+uploadLocation+'/'+req.file.filename,
			}
		    });
		});

    router.post('/editorJsImageHandler',
		function (err, req, res, next) {
		    res.json({ "success": 0 });
		});
    
    return router;
}

module.exports=editorjsImageHandler;
