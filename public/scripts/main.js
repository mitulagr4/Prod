function handlePostClick(postUrl) {
  window.location.replace(postUrl);
}

function handleCommentSubmit(event) {
  if(event.target.type !== "submit")
    event.preventDefault();
  else {
    var textarea = event.target.parentElement.previousElementSibling.firstElementChild;
    if(!textarea.value)
      event.preventDefault();
  }
}

function handleCommentEdit(event) {
  event.stopPropagation();
  var editIcon = event.target,
      editForm = editIcon.parentElement.parentElement.lastElementChild,
      textarea = editForm.firstElementChild.firstElementChild,
      submitButton = editForm.lastElementChild;

  editIcon.classList.toggle("fa-pencil-alt");
  editIcon.classList.toggle("fa-ban");

  textarea.toggleAttribute("readonly");
  textarea.classList.toggle("comment");
  textarea.focus();
  submitButton.classList.toggle("d-none");
}