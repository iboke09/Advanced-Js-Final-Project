const baseUrl = "https://tarmeezacademy.com/api/v1";

function setupUI() {
  const token = localStorage.getItem("token");
  const loginDiv = document.getElementById("logged-in-div");
  const registerBtn = document.getElementById("register-button");
  const logOutBtn = document.getElementById("logout-div");
  const addBtn = document.getElementById("add-btn");
  const commentDiv = document.getElementById("add-comment-div");
  if (token == null) {
    loginDiv.style.setProperty("display", "flex", "important");
    logOutBtn.style.setProperty("display", "none", "important");
    if (commentDiv != null) {
      commentDiv.style.setProperty("display", "none", "important");
    }
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none");
    }
  } else {
    // for logged in user
    if (addBtn != null) {
      addBtn.style.setProperty("display", "block");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logOutBtn.style.setProperty("display", "flex", "important");
    if (commentDiv != null) {
      commentDiv.style.setProperty("display", "flex", "important");
    }
    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
  }
}

// auth =============================================================
function loginBtnClicked() {
  const password = document.getElementById("password-input").value;
  const username = document.getElementById("username-input").value;

  const params = {
    username: username,
    password: password,
  };
  toggleLoader(true);
  const url = `${baseUrl}/login`;
  axios
    .post(url, params)
    .then((response) => {
      toggleLoader(false);
      localStorage.setItem("token", response.data.token);
      console.log(response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setupUI();
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      showAlert("Logged in successfully", "success");
      modalInstance.hide();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => toggleLoader(false));
}

function registerBtnClicked() {
  const password = document.getElementById("register-password-input").value;
  const username = document.getElementById("register-username-input").value;
  const name = document.getElementById("register-name-input").value;
  const image = document.getElementById("register-image-input").files[0];
  const url = `${baseUrl}/register`;

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };
  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      console.log(response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New User registered successfully", "success");
      setupUI();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => toggleLoader(false));
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged out successfully", "success");
  setupUI();
}

function showAlert(customMessage, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" id="a" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(customMessage, type);

  // hide the alert
  let bt1n = document.getElementById("a");
  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance("#success-alert");
    bt1n.click();
  }, 3000);
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  // if(storageUser != null) {
  //   JSON.parse(storageUser)
  // }else{
  //   user = ""
  // }
  user = storageUser != null ? JSON.parse(storageUser) : "";
  return user;
}

function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
}

function addButtonClicked() {
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("post-modal-submit-btn").innerHTML = "Create";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
}

function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}

function confirmDeletePost() {
  const postId = document.getElementById("delete-post-id-input").value;
  const url = `${baseUrl}/posts/${postId}`;
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  axios
    .delete(url, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("The Post has Been Deleted Successfully", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

function createNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";
  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  let url = "";
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }
  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New Post Has Been Created", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => toggleLoader(false));
}

function profileClicked() {
  const user = getCurrentUser();
  const userId = user.id;
  window.location = `profile.html?userid=${userId}`;
}

function toggleLoader(show = true) {
  const la = document.getElementById("loader");
  if (show) {
    la.style.visibility = "visible";
  } else {
    la.style.visibility = "hidden";
  }
}
