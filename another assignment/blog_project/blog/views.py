from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Post
import json

def index(request):
    return render(request, 'index.html')

def post_detail(request, slug):
    return render(request, 'post.html')

def admin_dashboard(request):
    return render(request, 'admin.html')

def create_post(request):
    return render(request, 'create.html')

def edit_post(request, slug):
    return render(request, 'edit.html')

# API Views
def api_posts(request):
    if request.method == 'GET':
        posts = Post.objects.all().order_by('-created_at')
        data = [{
            'id': post.id,
            'title': post.title,
            'slug': post.slug,
            'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S')
        } for post in posts]
        return JsonResponse(data, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            post = Post.objects.create(
                title=data['title'],
                content=data['content'],
                slug=data['slug']
            )
            return JsonResponse({
                'id': post.id,
                'title': post.title,
                'slug': post.slug
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

def api_post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    
    if request.method == 'GET':
        return JsonResponse({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'slug': post.slug,
            'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            post.title = data.get('title', post.title)
            post.content = data.get('content', post.content)
            
            if 'title' in data:
                post.slug = slugify(data['title'])
                
            post.save()
            return JsonResponse({
                'id': post.id,
                'title': post.title,
                'slug': post.slug
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    elif request.method == 'DELETE':
        post.delete()
        return JsonResponse({'message': 'Post deleted'}, status=204)