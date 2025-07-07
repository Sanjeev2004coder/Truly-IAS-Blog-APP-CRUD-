from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('post/<slug:slug>/', views.post_detail, name='post_detail'),
    path('admin/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/create/', views.create_post, name='create_post'),
    path('admin/edit/<slug:slug>/', views.edit_post, name='edit_post'),
    
    # API Endpoints
    path('api/posts/', views.api_posts, name='api_posts'),
    path('api/posts/<slug:slug>/', views.api_post_detail, name='api_post_detail'),
]