
let nextId = 1; // Initialize a counter outside the function/loop where objects are created
let blogList = [];
const postListBody = document.getElementById('PostList');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const now = new Date();
const dateString = now.toDateString();// Human-readable date string
const deletedPost = [];

let storedBlogPost;

try{
    storedBlogPost = JSON.parse(localStorage.getItem('userBlogs'));
} catch (e){
    console.log('Error parsing blogs from local storage', e);
    storedBlogPost = null;
}
if(storedBlogPost){
    blogList = storedBlogPost;
    console.log(storedBlogPost);
    renderBlogPostList();
}

function addBlogPost(blogPost){
    blogList.push(blogPost);
    console.log(blogList);
    renderBlogPostList();
     // Storing an object
    localStorage.setItem('userBlogs',JSON.stringify(blogList));
    //retrieving user object
    const retrievedBlogString = localStorage.getItem('userBlogs');
    const retrievedBlogArray = JSON.parse(retrievedBlogString);
    console.log(retrievedBlogArray);
    renderBlogPostList();
}
// localStorage.clear(); 
// This would remove blog etries and any other stored items.


function renderBlogPostList(){
    postListBody.innerHTML =""; //clear existing rows
    blogList.forEach(post => {
       
        const card = document.createElement('div');
         card.classList.add('card','text-center','card-spacing'); 
         card.id = post.id;
       
         const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        cardHeader.textContent = 'feature';
       
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
       
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = post.blogTitle;
        
        const cardContent = document.createElement('p');
        cardContent.classList.add('card-text');
        cardContent.textContent = post.blogContent;
        
        const cardEditButton = document.createElement('button');
        cardEditButton.classList.add('btn','btn-primary');
        cardEditButton.textContent ='Edit Post';
        
        const cardDeleteButton = document.createElement('button');
        cardDeleteButton.classList.add('btn','btn-primary','button-spacing','removeButton');
        cardDeleteButton.textContent ='Delete Post';
        
        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer','text-body-secondary');
        cardFooter.textContent = post.blogDate;
        
        // Append content to the card
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardContent);
        cardBody.appendChild(cardEditButton);
        cardBody.appendChild(cardDeleteButton);
        card.appendChild(cardFooter);
        // Append the card to the container
        postListBody.appendChild(card);
    })

}



document.getElementById('submissionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the form from performing a default submit
    const blogTitle = document.getElementById('title').value;
    const blogContent = document.getElementById('content').value;
    const messageArea = document.getElementById('messageArea');
    // Log data to the console for demonstration
    console.log('--- Form Submitted ---');
    console.log('Title:',blogTitle);
    console.log('Content (first 50 chars):', blogContent.substring(0, 50) + '...');
    console.log('----------------------');


    let newBlogPost = {
        id: nextId++,  // Assign the current value of nextId and then increment it
        blogTitle: blogTitle,
        blogContent: blogContent,
        blogDate:dateString 
    }
    addBlogPost(newBlogPost);

    // Display a success message in the UI using Bootstrap alert classes
    messageArea.classList.remove('d-none', 'alert-danger');
    messageArea.classList.add('alert', 'alert-success');
    messageArea.innerHTML = `
        <p class="mb-1 fw-bold">Submission Successful!</p>
        <p class="mb-0 text-sm">Title: "${blogTitle}" has been submitted.</p>
        <p class="small fst-italic mt-1">Check the console for full data output.</p>
    `;
    // Optionally, clear the form fields
    document.getElementById('submissionForm').reset();
});

//event Listeners for Blog Post form 

//title validity 
titleInput.addEventListener('input',(event) =>{
    if(titleInput.validity.valueMissing){
        titleInput.setCustomValidity('Please add title to blog post');
    }else if(titleInput.validity.tooShort){
        titleInput.setCustomValidity('Title too short Must be atleast 2 characters');
    }
    else if(titleInput.validity.tooLong){
        titleInput.setCustomValidity('Maximum 15 Characters');
    }else{
        titleInput.setCustomValidity(''); // Clear custom error if valid
    }
    titleError.textContent = titleInput.validationMessage;
});

//content Validity
contentInput.addEventListener('input',(event) =>{
    if(contentInput.validity.valueMissing){
        contentInput.setCustomValidity('Please add content to blog post');
    }else if (contentInput.validity.tooShort){
        contentInput.setCustomValidity('content message is too short must be atleast 5 characters long');
    }else if(contentInput.validity.tooLong){
        contentInput.setCustomValidity('content message is too Long must be less than 500 characters long');
    }else {
        contentInput.setCustomValidity('');
    }
    textContentError.textContent = contentInput.validationMessage;
});

//Remove event Listener
postListBody.addEventListener('click',(event)=>{
 if(event.target.classList.contains('removeButton')){
    console.log('Remove Button was CLicked' );
    const cardToRemove = event.target.closest('.card'); // Find the closest parent with class 'card'
    // deletedPost.push(cardToRemove);
    //     console.log(deletedPost);
    // const idOfCardToRemove = cardToRemove.querySelector(); //find the ID of card to remove
    if (cardToRemove) {
        const cardId = cardToRemove.id; 
         cardToRemove.parentElement.removeChild(cardToRemove); // Remove the card from its parent
        removePostFromArray(cardId);
        localStorage.setItem('userBlogs',JSON.stringify(blogList));
    }
 }
});

function removePostFromArray(idToRemove){
    console.log('post to remove from the function' + idToRemove)
    const postToRemove = blogList.findIndex(post => Number(post.id) === Number(idToRemove));
    console.log(postToRemove);
    if(postToRemove !== -1){// Ensure the element was found
        blogList.splice(postToRemove,1);
    }
    return blogList + console.log(blogList);
  
}