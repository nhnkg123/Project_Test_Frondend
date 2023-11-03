const axios = require('axios');

let controller = {};

controller.getposts = (page) => {
    return new Promise((resolve, reject) => {
        let limit = 2;
        let skip = ((page - 1) * limit);
        let postsData;
        let postsWithComments;
        const API_URL_posts = "https://jsonplaceholder.typicode.com/posts";
        //const API_URL_posts = "http://127.0.0.1:4000/posts";
        axios.get(API_URL_posts)
            .then(posts => {
                postsData = posts.data.slice(skip, skip+limit);
                console.log(postsData);
                const API_URL_comments = "https://jsonplaceholder.typicode.com/comments";
                //const API_URL_comments = "http://127.0.0.1:4000/comments"

                return axios.get(API_URL_comments)
            })
            .then(response => {
                postsWithComments = postsData.map(post => {
                    post.comments = response.data.filter(comment => comment.postId == post.id);     
                    post.totalComments = post.comments.length;

                    return post;
                });

                const API_URL_users = "https://jsonplaceholder.typicode.com/users";

                return axios.get(API_URL_users);
            })
            .then(response => {
                postsWithComments.map(post => {
                    post.name = response.data.filter(user => user.id == post.userId)[0].name;
                    post.createdAt = (new Date()).getMonth() + '-' + (new Date()).getDay() + '-' + (new Date()).getFullYear();
                });

                resolve(postsWithComments);
            })
            .catch(err => {
                reject(new Error(err))
            });
    }); 
}

controller.createPost = (title, content, userId) => {
    return new Promise ((resolve, reject) => {
        const data = {
            title: title,
            content: content,
            userId: userId
        };

        const headers = {
            method: 'POST',
            'Content-Type': 'application/json'
        };

        const API_URL_CreatePost = 'http://127.0.0.1:4000/posts/createPost';
        axios.post(API_URL_CreatePost, data, {headers})
            .then(result => {
                resolve(result);
            })
            .catch(err => reject(new Error(err)));
    });
}

module.exports = controller;