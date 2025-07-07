document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('editor')) {
        const quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });

        // Update slug when title changes
        const titleInput = document.getElementById('title');
        const slugInput = document.getElementById('slug');
        
        if (titleInput && slugInput) {
            titleInput.addEventListener('input', function() {
                slugInput.value = slugify(this.value);
            });
        }

        // Handle form submission
        const form = document.getElementById('create-post-form');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const title = document.getElementById('title').value;
                const slug = document.getElementById('slug').value;
                const content = quill.root.innerHTML;
                
                try {
                    const response = await fetch('/api/posts/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCookie('csrftoken'),
                        },
                        body: JSON.stringify({ title, content, slug })
                    });
                    
                    if (response.ok) {
                        window.location.href = '/admin/';
                    } else {
                        alert('Error creating post');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error creating post');
                }
            });
        }
    }
});

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Simple slugify function
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}