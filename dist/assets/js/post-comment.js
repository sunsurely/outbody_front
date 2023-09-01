$(document).ready(function () {
  getOnePost();
});

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjkzNTM2MzE1LCJleHAiOjE2OTM1NDM1MTV9.wkO2bZe15KSiyL0DH0Ds6d3YymeVP9SYO97dDIo6SMY';

// 오운완 상세 조회
// challengeId 받아오는거 아직 안함.
// postId 받아오는거 아직 안함.
const getOnePost = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/challenge/3/post/24`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let getPost = '';
    const post = response.data.data;

    if (post.comment === null) {
      post.comment = '';
    }

    let temphtml = `<div class="card-header">
                        <ul class="list-unstyled user-details list-unstyled-border list-unstyled-noborder">
                            <li class="media">
                                <img alt="image" class="mr-3 rounded-circle" width="50"
                                    src="assets/img/avatar/avatar-1.png">
                                <div class="media-body">
                                    <div class="media-title">${post.username}</div>
                                    <div class="text-job text-muted">${post.comment}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div id="carouselExampleIndicators2" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <h6 style="float: left;">${post.description}</h6>
                                    <img class="d-block w-100" src="${post.imgUrl}">
                                </div>
                            </div>
                        </div>
                    </div>`;
    getPost += temphtml;
    $('#card').html(getPost);
  } catch (error) {
    console.error('Error message:', error.response.data.message);
  }
};
