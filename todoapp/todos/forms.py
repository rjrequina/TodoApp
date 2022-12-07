from django import forms
from .models import Todo


class TodoForm(forms.ModelForm):
    class Meta:
        model = Todo
        fields = ['title']
        widgets = {
            'title': forms.TextInput(
                attrs={'id': 'todo-title', 'required': True, 'placeholder': 'I will...'}
            ),
        }