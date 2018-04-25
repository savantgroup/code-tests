import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import TodoItem
from .serializers import TodoItemSerializer


@csrf_exempt
def todo_items(request, todo_item_id=None):
    """A view which handles everything about todo items.

    This isn't the best way to handle requests, for sure.
    But it sure is simple!

    """
    if request.method == 'GET':
        all_todo_items = TodoItem.objects.all()
        data = list()
        for todo_item in all_todo_items:
            ser = TodoItemSerializer(todo_item)
            data.append(ser.data)
        return JsonResponse({'results': data}, status=200)

    elif request.method == 'POST':
        # Attempt to get the sent data.
        raw_data = request.body
        print(raw_data)
        try:
            data = json.loads(raw_data.decode())
        except json.JSONDecodeError as err:
            return JsonResponse({
                'errors': ['Unable to decode json data: '
                           + str(err)]
            }, status=400)

        # Make sure the data is valid.
        ser = TodoItemSerializer(data=data)
        if ser.is_valid():
            ser.save()
            return JsonResponse(ser.data, status=201)
        else:
            return JsonRespose({'errors': ser.errors}, status=400)

    elif request.method == 'DELETE':
        try:
            todo_item = TodoItem.objects.get(
                id=todo_item_id
            )
        except TodoItem.DoesNotExist:
            return JsonResponse({
                'errors':
                    ['Todo item with id '
                     + str(todo_item_id)
                     + ' Does not exist']
            }, status=400)
        ser = TodoItemSerializer(todo_item)
        ser.delete()
        return JsonResponse(ser.data, status=204)

    # TODO: Handle editing data!

    else:
        return JsonResponse({'errors': ['Unrecognized method']})
