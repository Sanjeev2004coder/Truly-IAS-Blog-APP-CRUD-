document.addEventListener('DOMContentLoaded', function() {
    // Load posts for homepage
    if (document.getElementById('posts-list')) {
        loadPosts();
    }
    
    // Load single post
    if (document.getElementById('post-content')) {
        loadPost();
    }
});

async function loadPosts() {
    try {
        const response = await fetch('/api/posts/');
        const posts = await response.json();
        
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            postElement.innerHTML = `
                <h3><a href="/post/${post.slug}/">${post.title}</a></h3>
                <p>${post.created_at}</p>
            `;
            postsList.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

async function loadPost() {
    const slug = window.location.pathname.split('/')[2];
    
    if (!slug) {
        document.getElementById('post-content').innerHTML = '<p>Post not found</p>';
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${slug}/`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const post = await response.json();
        document.title = post.title;
        document.getElementById('post-content').innerHTML = `
            <h1>${post.title}</h1>
            <div class="post-date">${post.created_at}</div>
            <div class="post-body">${post.content}</div>
        `;
    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-content').innerHTML = '<p>Post not found</p>';
    }
}