from django.urls import path

from . import views

app_name = 'AI4fitUserTest'
urlpatterns = [
    path('', views.evaluate, name='evaluate')
]