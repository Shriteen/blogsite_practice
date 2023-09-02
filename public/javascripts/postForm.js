const tagsModalButton= document.getElementById('tagsModalButton');
tagsModalButton.addEventListener('click', (e)=>{
    document.querySelector('#tagsModal').classList.add('active');
});

const tagsModalClose= document.querySelector('#tagsModal .close');
tagsModalClose.addEventListener('click', (e)=>{
    document.querySelector('#tagsModal').classList.remove('active');
});

function updateTagHiddenField()
{
    let allTags= Array.from(
	document.querySelectorAll('.tag')
    ).map(
	tag=>tag.textContent.trim()
    );
    allTags=Array.from(new Set(allTags));
    document.getElementById('tagsHiddenInput').value=JSON.stringify(allTags);
};

function deleteTag(e)
{
    e.currentTarget.remove();
    updateTagHiddenField();
}

const tagsInput=document.getElementById('tagsInput');
tagsInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
	e.preventDefault();
	const field=e.currentTarget;

	if(field.value.trim())
	{
	    const tag=document.createElement('span');
	    tag.classList.add('tag');
	    tag.textContent=field.value;

	    const listElement=document.createElement('li');
	    listElement.appendChild(tag);
	    listElement.onclick=deleteTag;
	    
	    const tagsList=document.getElementById('tagsList');
	    tagsList.appendChild(listElement);

	    updateTagHiddenField();
	}
	
	field.value='';
    }
}); 

document.querySelectorAll('.tag').forEach(tag=>tag.onclick=deleteTag);

updateTagHiddenField();
