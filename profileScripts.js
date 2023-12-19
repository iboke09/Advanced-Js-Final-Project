setupUI();

// let id = "6488"
function getCurrentUserId(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("userid");
    return id
}

function getUsers() {
    const id = getCurrentUserId()
    console.log(baseUrl);
    axios.get(`${baseUrl}/users/${id}`).then((response) => {
        const user = response.data.data;
        document.getElementById("main-info-email").innerHTML = user.email;
        document.getElementById("main-info-name").innerHTML = user.name;
        document.getElementById("main-info-username").innerHTML = user.username;
        document.getElementById("name-posts").innerHTML = user.username;
        document.getElementById("header-image").src = user.profile_image;
        
        // posts commend count
        
        document.getElementById("posts-count").innerHTML = user.posts_count;
        document.getElementById("commend-count").innerHTML = user.comments_count;
    });
}
getUsers();
getPosts();

function getPosts() {
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}/posts`).then((response) => {
    const posts = response.data.data;
    document.getElementById("user-posts").innerHTML = "";

    for (post of posts) {
      console.log(post);
      const author = post.author;
      const url1 = "http://tarmeezacademy.com/images/users/IrQ6fMHvfvmXJCH.jpg";
      let user = getCurrentUser();
      let idMyPost = user != null && post.author.id == user.id;
      let buttonContent = ``;
      if (idMyPost) {
        buttonContent = `
          <div class="btn btn-danger mx-2" style="float: right;" onclick="deletePostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Delete</div>
  
          <div class="btn btn-secondary" style="float: right;" onclick="editPostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">edit</div>`;
      }
      let content = `
              <div class="container">
              <!-- posts -->
                <div id="post">
                  <div class="d-flex justify-content-center mt-5">
                    <div class="col-12">
                      <!-- post -->
                      <div class="card shadow my-3">
                        <div class="card-header">
                          <img
                            src="${author.profile_image || `${url1}`}"
                            alt=""
                            class="border border-2 rounded-circle"
                            id="img"
                            style="width: 40px; height: 40px"
                          />
                          <b>${author.username}</b>
                          ${buttonContent}
                        </div>
                        <div class="card-body" onclick="postClicked(${
                          post.id
                        })" style="cursor:pointer">
                          <img src="${post.image}" alt="" class="w-100" />
                          <h6 style="color: rgb(158, 156, 156)" class="mt-1">
                            ${post.created_at}
                          </h6>
                          <h5>${post.title || ""}</h5>
                          <p>
                            ${post.body}
                          </p>
                          <hr />
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-pen"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
                              />
                            </svg>
                            <span>(${post.comments_count}) comments 
                              <span id="post-tags-${post.id}">
                              </span>
                            </span>
                        </div>
                        
                      </div>
                    </div>
                    <!-- post // -->
                  </div>
                </div>
              </div>
              <!-- posts // -->
            </div>
              `;
      document.getElementById("user-posts").innerHTML += content;
      const currentPostTagsId = `post-tags-${post.id}`;
      document.getElementById(currentPostTagsId).innerHTML = "";

      for (tag of post.tags) {
        let tagsContent = `
            <button class="btn btn-sm rounded-5 bg-secondary text-white">${tag.name}</button>
            `;
        document.getElementById(currentPostTagsId).innerHTML += tagsContent;
      }
    }
  });
}
