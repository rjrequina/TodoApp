from django.urls import path
from todoapp.todos.views import (
    todos_page,
    add_todo
)

app_name = "todos"
urlpatterns = [
    path("", view=todos_page, name="home"),
    path("add/", view=add_todo, name="add"),
]
