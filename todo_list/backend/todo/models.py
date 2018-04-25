from django.db import models


class TodoItem(models.Model):
    """Represents a single item in the to-do list."""

    content = models.TextField(
        help_text='The thing we need to do.'
    )
