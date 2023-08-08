import EditorJS from 'https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.26.5/+esm';
import Header from  'https://cdn.jsdelivr.net/npm/@editorjs/header@2.7.0/+esm';
import List from 'https://cdn.jsdelivr.net/npm/@editorjs/nested-list@1.3.0/+esm';
import Code from 'https://cdn.jsdelivr.net/npm/@editorjs/code@2.8.0/+esm';
import Quote from 'https://cdn.jsdelivr.net/npm/@editorjs/quote@2.5.0/+esm';
import Delimiter from 'https://cdn.jsdelivr.net/npm/@editorjs/delimiter@1.3.0/+esm';
import Table from 'https://cdn.jsdelivr.net/npm/@editorjs/table@2.2.2/+esm';
import Raw from 'https://cdn.jsdelivr.net/npm/@editorjs/raw@2.4.0/+esm';
import Marker from 'https://cdn.jsdelivr.net/npm/@editorjs/marker@1.3.0/+esm';
import InlineCode from 'https://cdn.jsdelivr.net/npm/@editorjs/inline-code@1.4.0/+esm';
import Underline from 'https://cdn.jsdelivr.net/npm/@editorjs/underline@1.1.0/+esm';
import Image from 'https://cdn.jsdelivr.net/npm/@editorjs/image@2.8.1/+esm';

export default function editorJsWrapped(formId,editorDiv,oldData)
{
    const editor = new EditorJS({
	holder: editorDiv,
	data: oldData,
	tools: {
	    header: Header,
	    list: List,
	    image: {
		class: Image,
		config: {
		    endpoints: {
			byFile: 'editorJsImageHandler', // Your backend file uploader endpoint
		    }
		}
	    },
	    code: Code,
	    quote: Quote,
	    delimiter: Delimiter,
	    table: Table,
	    raw: Raw,
	    marker: Marker,
	    inlineCode: InlineCode,
	    underline: Underline
	}
    });

    
    const formElement = document.getElementById(formId);
    formElement.onsubmit = async (e) => {
	e.preventDefault();
	const output = await editor.save();
	
	const contentField = document.createElement('input');
	contentField.type = 'hidden';
	contentField.name = 'editorjs';
	contentField.value = JSON.stringify(output);
	e.target.appendChild(contentField);
	
	e.target.submit();
    };

    
}
