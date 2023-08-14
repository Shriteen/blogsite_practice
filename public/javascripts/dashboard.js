function populateList(arr)
{
    const postList= document.getElementById('postList');
    while (postList.firstChild)
	postList.removeChild(postList.firstChild);
	
    for(let post of arr)
    {
	//console.log(post);
	const li=document.createElement('li');

	const title=document.createElement('div');
	title.classList.add('postListTitle');
	const titleLink= document.createElement('a');
	titleLink.href="/posts/"+post._id;
	titleLink.textContent=post.title;
	title.appendChild(titleLink);
	li.appendChild(title);

	const author=document.createElement('div');
	author.classList.add('postListAuthor');
	author.textContent=post.author.name;
	li.appendChild(author);

	const lastEdited=document.createElement('div');
	lastEdited.classList.add('postListLastEdited');
	lastEdited.textContent = new Date(
	    post.lastEditedOn
	).toLocaleString( undefined, {dateStyle: "medium"} );
	li.appendChild(lastEdited);

	const edit=document.createElement('div');
	edit.classList.add('postListEdit');
	const editLink= document.createElement('a');
	editLink.textContent="Edit";
	editLink.href="/admin/editPost/"+post._id;
	edit.appendChild(editLink);
	li.appendChild(edit);
	
	const del=document.createElement('div');
	del.classList.add('postListDelete');
	const delLink= document.createElement('a');
	delLink.textContent="Delete";
	delLink.href="/admin/deletePost/"+post._id;
	delLink.addEventListener('click',(e)=>{
	    if(!confirm("Are you sure you want to delete this post?"))
		e.preventDefault();
	});
	del.appendChild(delLink);
	li.appendChild(del);

	postList.appendChild(li);
    }
}


fetch('/posts/search')
    .then(res=>res.json())
    .then(json=>populateList(json));


const searchField= document.getElementById('searchField');
searchField.addEventListener(
    'input',
    (e)=>{
	const url='/posts/search?q='+e.target.value;
	fetch(url)
	    .then(res=>res.json())
	    .then(json=>populateList(json));
    }
);
