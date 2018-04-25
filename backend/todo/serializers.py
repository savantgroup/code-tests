from .models import TodoItem


class TodoItemSerializer(object):

    def __init__(self, instance=None, data=None):
        self.instance = instance
        self._data = data
        self._is_valid = None
        self._errors = list()

    @property
    def data(self):
        return {
            'id': self.instance.id,
            'content': self.instance.content,
        }

    @property
    def errors(self):
        assert self._is_valid is not None
        return self._errors

    def delete(self):
        assert self.instance is not None
        self.instance.delete()

    def is_valid(self):
        """Tell if the data is valid for saving.

        Populates the `errors` attribute if there are any errors.

        """
        self._is_valid = True

        if self._data is None:
            self._errors.append('`data` must be set when editing or creating')

        # We only need `id` when editing.
        creating = self.instance is None
        if not creating and self._data and 'id' not in self._data:
            self._errors.append('`id` is required when editing`.')

        if self._data and 'content' not in self._data:
            self._errors.append('`content` is a required field.')

        self._is_valid = not self._errors

        return self._is_valid

    def save(self):
        """Save the instance.

        `is_valid()` must be  called prior to calling this method.

        """
        assert self._is_valid

        creating = self.instance is None
        if creating:
            self.instance = TodoItem.objects.create(
                content=self._data['content'],
            )
        else:
            self.instance.content = _data['content']

        return self.instance
