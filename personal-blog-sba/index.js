let blogList = [];
const postListBody = document.getElementById("PostList");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const now = new Date();
const dateString = now.toDateString(); // Human-readable date string
const deletedPost = [];
let isEditing = false; // Flag to track editing state
let storedBlogPost;

//local storage function
try {
  storedBlogPost = JSON.parse(localStorage.getItem("userBlogs"));
} catch (e) {
  console.log("Error parsing blogs from local storage", e);
  storedBlogPost = null;
}
if (storedBlogPost) {
  blogList = storedBlogPost;
  console.log(storedBlogPost);
  renderBlogPostList();
}



function addBlogPost(blogPost) {
  blogList.push(blogPost);
  renderBlogPostList();
  // Storing an object
  localStorage.setItem("userBlogs", JSON.stringify(blogList));
  //retrieving user object
  const retrievedBlogString = localStorage.getItem("userBlogs");
  const retrievedBlogArray = JSON.parse(retrievedBlogString);
  renderBlogPostList();
}
// localStorage.clear();
// This would remove blog etries and any other stored items.

function renderBlogPostList() {
  postListBody.innerHTML = ""; //clear existing rows
  blogList.forEach((post) => {
    const card = document.createElement("div");
    card.classList.add("card", "text-center", "card-spacing");
    card.id = post.id;

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    cardHeader.textContent = "feature";

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = post.blogTitle;

    const cardContent = document.createElement("p");
    cardContent.classList.add("card-text");
    cardContent.textContent = post.blogContent;

    const cardEditButton = document.createElement("button");
    cardEditButton.classList.add("btn", "btn-primary", "editButton");
    cardEditButton.textContent = "Edit Post";

    const cardDeleteButton = document.createElement("button");
    cardDeleteButton.classList.add(
      "btn",
      "btn-primary",
      "button-spacing",
      "removeButton"
    );
    cardDeleteButton.textContent = "Delete Post";

    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer", "text-body-secondary");
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
  });
}

//Edit Post Function

function EditPost(cardToEdit) {
  const titleElement = cardToEdit.querySelector(".card-title");
  const textElement = cardToEdit.querySelector(".card-text");
  const editButton = cardToEdit.querySelector(".editButton");
  isEditing = true;
  console.log("isEditing:" + isEditing);
  console.log(titleElement);

  titleElement.contentEditable = "true";
  textElement.contentEditable = "true";
  //  VISUAL CUE: Add the class defined in CSS
  titleElement.classList.add("editing-active");
  textElement.classList.add("editing-active");
  //Button functionality
  editButton.textContent = "Save Post";
  editButton.classList.remove("editButton");
  editButton.classList.add("saveButton");
}
function savePost(cardToSave) {
  const titleElement = cardToSave.querySelector(".card-title");
  const textElement = cardToSave.querySelector(".card-text");
  const saveButton = cardToSave.querySelector(".saveButton");
  if (titleElement.textContent.trim() === " " || !titleElement.textContent) {
    alert("title must be present after Editing");
    return;
  } else if (
    textElement.textContent.trim() === " " ||
    !textElement.textContent
  ) {
    alert("blog content must be present after editing");
    return;
  } else {
    // 1. Remove editable status
    titleElement.contentEditable = "false";
    textElement.contentEditable = "false";

    // 2. Remove visual cues
    titleElement.classList.remove("editing-active");
    textElement.classList.remove("editing-active");

    // 3. Revert button back to 'Edit Post'
    saveButton.textContent = "Edit Post";
    saveButton.classList.remove("saveButton");
    saveButton.classList.add("editButton");

    // 4. Get the new content (already updated by the user typing)
    isEditing = false;
    cardToSave.blogTitle = titleElement.textContent;
    cardToSave.blogContent = textElement.textContent;
    const targetIndex = blogList.findIndex(
      (post) => Number(post.id) === Number(cardToSave.id)
    );

    blogList[targetIndex].blogTitle = titleElement.textContent;
    blogList[targetIndex].blogContent = textElement.textContent;
    localStorage.setItem("userBlogs", JSON.stringify(blogList));
  }
}

//Remove from Array Function
function removePostFromArray(idToRemove) {
  const postToRemove = blogList.findIndex(
    (post) => Number(post.id) === Number(idToRemove)
  );
  if (postToRemove !== -1) {
    // Ensure the element was found
    blogList.splice(postToRemove, 1);
  }
  return blogList;
}

document.getElementById("submissionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the form from performing a default submit
    const blogTitle = document.getElementById("title").value;
    const blogContent = document.getElementById("content").value;
    const messageArea = document.getElementById("messageArea");
    // Log data to the console for demonstration
    console.log(blogList);

    let newBlogPost = {
      id: Date.now(),
      blogTitle: blogTitle,
      blogContent: blogContent,
      blogDate: dateString,
    };
    addBlogPost(newBlogPost);

    // Display a success message in the UI using Bootstrap alert classes
    messageArea.classList.remove("d-none", "alert-danger");
    messageArea.classList.add("alert", "alert-success");
    messageArea.innerHTML = `
        <p class="mb-1 fw-bold">Submission Successful!</p>
        <p class="mb-0 text-sm">Title: "${blogTitle}" has been submitted.</p>
    `;
    // Optionally, clear the form fields
    document.getElementById("submissionForm").reset();
  });

//event Listeners for Blog Post form

//title validity
titleInput.addEventListener("input", (event) => {
  if (titleInput.validity.valueMissing) {
    titleInput.setCustomValidity("Please add title to blog post");
  } else if (titleInput.validity.tooShort) {
    titleInput.setCustomValidity(
      "Title too short Must be atleast 2 characters"
    );
  } else if (titleInput.validity.tooLong) {
    titleInput.setCustomValidity("Maximum 40 Characters");
  } else {
    titleInput.setCustomValidity(""); // Clear custom error if valid
  }
  titleError.textContent = titleInput.validationMessage;
});

//content Validity
contentInput.addEventListener("input", (event) => {
  if (contentInput.validity.valueMissing) {
    contentInput.setCustomValidity("Please add content to blog post");
  } else if (contentInput.validity.tooShort) {
    contentInput.setCustomValidity(
      "content message is too short must be atleast 5 characters long"
    );
  } else if (contentInput.validity.tooLong) {
    contentInput.setCustomValidity(
      "content message is too Long must be less than 500 characters long"
    );
  } else {
    contentInput.setCustomValidity("");
  }
  textContentError.textContent = contentInput.validationMessage;
});

//Remove event Listener
postListBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("removeButton")) {
    const cardToRemove = event.target.closest(".card"); // Find the closest parent with class 'card'
    deletedPost.push(cardToRemove);
    if (cardToRemove) {
      const cardId = cardToRemove.id;
      cardToRemove.parentElement.removeChild(cardToRemove); // Remove the card from its parent
      removePostFromArray(cardId);
      localStorage.setItem("userBlogs", JSON.stringify(blogList));
    }
  }
});
//edit event Listener
document.addEventListener("click", (event) => {
  const button = event.target;
  const cardToEdit = event.target.closest(".card"); // Find the closest parent with class 'card'
  if (cardToEdit) {
    const cardId = cardToEdit.id;
    if (button.classList.contains("editButton")) {
      console.log("card to edit ID:" + cardId);
      console.log(cardToEdit);
      EditPost(cardToEdit);
    } else if (button.classList.contains("saveButton")) {
      console.log("save was clicked");
      const cardToSave = event.target.closest(".card"); // Find the closest parent with class 'card'
      if (cardToSave) {
        savePost(cardToSave);
      }
    }
  }
});
