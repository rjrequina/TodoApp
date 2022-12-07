from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Todo(models.Model):
    title = models.CharField(max_length=200)
    status = models.BooleanField(default=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title}"
