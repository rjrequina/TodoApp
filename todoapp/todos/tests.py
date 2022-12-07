from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Todo
import json

class TestTodos(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user1 = User.objects.create_user(username='testuser1', password='12345678')
        
    def test_form_exist_in_view(self):
        self.client.login(username="testuser1", password="12345678")
        response = self.client.get("/")
        htmlContent = response.content.decode('utf-8')
        self.assertIn('id="todo-title"', htmlContent)
        self.assertIn('placeholder="I will..."', htmlContent)
    
    def test_created_todos_belong_to_user(self):
        User = get_user_model()
        self.user2 = User.objects.create_user(username='testuser2', password='12345678')
        client = Client()
        client.login(username="testuser1", password="12345678")
        response = client.post('/add/', { "title": "testtodo"})
        self.assertEqual(response.status_code, 200)

        todo_id = json.loads(response.content)['todo_id']
        new_todo = Todo.objects.get(id=todo_id)
        self.assertEqual(new_todo.author.id, self.user1.id)
        self.assertNotEqual(new_todo.author.id, self.user2.id)
