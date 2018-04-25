# To-do List

This application implements a simple to-do list application
using Django as a restful backend.

## Running

You can run this project in one of two ways.  The easy way is to run
with docker and docker-compose.   If you run the project this way,
all you have to do to complete the application is edit the files and
refresh the page.

If you run it by hand, you will need to install Python3.5, install
the requirements file, and run the backend server and a frontend
server.

The below instructions describe how to get things working with Docker:

1. Install [docker](https://docs.docker.com/install/)
   and [docker-compose](https://docs.docker.com/compose/install/).

2. Clone this repository.  All remaining instructions assume you are in the
   project directory. (For example, if I run clone it to my home directory,
   `~`, then the directions assume that my current working directory is
   `~/todo_list`.)

3. Bring the containers up:

```
docker-compose up -d
```

4. Check out the app by going to [http://localhost:8080](http://localhost:8080).


## The Problem

For this code test, please add the ability to edit the text of items in the
todo list.  For example, if I have the following list:

  - Walk the dog.
  - Buy milk.

I want to be able to change "dog" to "cat", so that the list becomes

  - Walk the cat.
  - Buy milk.

You will have to edit both the frontend and backend to accomplish this task.
