const edjsParser = require("editorjs-parser");

// custom parsers for nested list and delimiter not handled by editorjs-parser 
const customParsers = {
    list: parseListData,
    delimiter: ()=>'<hr>'
};

const parser = new edjsParser(undefined, customParsers);

// functions to handle nested lists not handled by editorjs-parser
function parseListData(data,config)
{    
    if (data.style == "ordered")
	return  "<ol>"+ recursiveParseListData(data.items,'ol') +"</ol>";
    else
	return  "<ul>"+ recursiveParseListData(data.items,'ul') +"</ul>";
}

//Internal recursive function
function recursiveParseListData(data,style)
{
    let returning="";
    for(const obj of data)
    {
	const content= `<li> ${obj.content} </li>`;
	if(obj.items.length)
	    returning+= content + `<${style}>${recursiveParseListData(obj.items,style)}</${style}>`; 
	else
	    returning+= content;
    }
    
    return returning;
}


module.exports= function editorJsParseToHtml(editorjsDataJson) {
    return parser.parse(editorjsDataJson);
};
