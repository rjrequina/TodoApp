from django.shortcuts import render
from django.http import JsonResponse

from .models import Todo
from .forms import TodoForm


def todos_page(request):
    template_variable = {
        'todos': [],
        'form': TodoForm()
    }

    if request.user.is_authenticated:
        template_variable['todos'] = Todo.objects.filter(author=request.user).order_by("-id")

    return render(request, 'pages/home.html', template_variable)


def add_todo(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        print(request.POST)
        response_data = {}

        todo = Todo(title=title, author=request.user)
        todo.save()

        response_data['todo_id'] = todo.id
        response_data['title'] = todo.title
        response_data['author'] = todo.author.username
        response_data['status'] = todo.status

        return JsonResponse( response_data, status=200)
    return JsonResponse({"error": ""}, status=400)