const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
var format = require("date-fns/format");
var isValid = require("date-fns/isValid");

const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());

const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB error ${error.message}`);
  }
};
intializeDbAndServer();
const hasStatusProperty = (dbObject) => {
  return dbObject.status !== undefined;
};
const hasPriorityProperty = (dbObject) => {
  return dbObject.priority !== undefined;
};
const hasStatusAndPriorityProperty = (dbObject) => {
  return dbObject.status !== undefined && dbObject.priority !== undefined;
};
const hasSearchProperty = (dbObject) => {
  return dbObject.search_q !== undefined;
};
const hasCategoryProperty = (dbObject) => {
  return dbObject.category !== undefined;
};
const hasTodoProperty = (dbObject) => {
  return dbObject.todo !== undefined;
};
const hasDateProperty = (dbObject) => {
  return dbObject.due_date !== undefined;
  console.log("suma");
};

const convertDbResponseToObject = (dbObject) => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    priority: dbObject.priority,
    status: dbObject.status,
    category: dbObject.category,
    dueDate: dbObject.due_date,
  };
};

// API 1 Scenario 1

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q, category } = request.query;
  console.log(request.query);
  switch (true) {
    case hasStatusProperty(request.query):
      array = ["TO DO", "IN PROGRESS", "DONE"];

      const validOrNot = array.includes(status);
      if (validOrNot) {
        const todoStatusQuery = `
                 SELECT * FROM TODO
                WHERE status='${status}';`;
        const todoStatusArray = await db.all(todoStatusQuery);
        response.send(
          todoStatusArray.map((eachone) => convertDbResponseToObject(eachone))
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }

      break;
    case hasPriorityProperty(request.query):
      array = ["HIGH", "MEDIUM", "LOW"];

      const validOrNotPriority = array.includes(priority);
      if (validOrNotPriority) {
        const todoPriorityQuery = `
                 SELECT * FROM TODO
                WHERE priority='${priority}';`;
        const todoPriorityArray = await db.all(todoPriorityQuery);
        response.send(
          todoPriorityArray.map((eachone) => convertDbResponseToObject(eachone))
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;
    case hasStatusAndPriorityProperty(request.query):
      array = ["HIGH", "MEDIUM", "LOW"];
      const validOrNotStatus = array.includes(status);
      const validOrNotPriorityy = array.includes(priority);
      const validOrNotPriorityAndStatus =
        validOrNotStatus && validOrNotPriorityAndStatus;
      console.log(validOrNotPriorityAndStatus);

      if (validOrNotPriorityAndStatus) {
        const todoStatusAndPriorityQuery = `
                 SELECT * FROM TODO
                WHERE status='${status}'AND priority='${priority}';`;
        const todoStatusAndPriorityArray = await db.all(
          todoStatusAndPriorityQuery
        );
        response.send(
          todoStatusAndPriorityArray.map((eachone) =>
            convertDbResponseToObject(eachone)
          )
        );
      } else if (validOrNotStatus) {
        response.status(400);
        response.send("Invalid Todo Status");
      } else if (validOrNotPriorityy) {
        response.status(400);
        response.send("Invalid Todo Priority");
      } else {
        response.status(400);
        response.send("Invalid  Todo Status And Todo Priority");
      }

      break;

    case hasSearchProperty(request.query):
      const todoSearchQuery = `
                 SELECT * FROM TODO
                WHERE todo LIKE '%${search_q}%';`;
      const todoSearchArray = await db.all(todoSearchQuery);
      response.send(
        todoSearchArray.map((eachone) => convertDbResponseToObject(eachone))
      );

      break;
    case hasCategoryProperty(request.query):
      array = ["WORK", "HOME", "LEARNING"];

      const CategoryValidOrNot = array.includes(category);
      if (CategoryValidOrNot) {
        const todoCategoryQuery = `
                 SELECT * FROM TODO
                WHERE category='${category}';`;
        const todoCategoryArray = await db.all(todoCategoryQuery);
        response.send(
          todoCategoryArray.map((eachone) => convertDbResponseToObject(eachone))
        );
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;
  }
});

//API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const TodoQuery = `
                 SELECT * FROM TODO
                WHERE id = ${todoId};`;
  const TodoArray = await db.get(TodoQuery);
  response.send(convertDbResponseToObject(TodoArray));
});

// API 3
app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  console.log(typeof date);
  var isDateValid = isValid(new Date(date));
  if (isDateValid) {
    const getDateQuery = `
                 SELECT * FROM TODO
                WHERE due_date = '${date}';`;
    const TodoArray = await db.get(getDateQuery);
    console.log(TodoArray);
    response.send(TodoArray);
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

//API 6

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const DeleteTodoQuery = `
                 DELETE FROM TODO
                WHERE id = ${todoId};`;
  await db.run(DeleteTodoQuery);
  response.send("Todo Deleted");
});

// API 4
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  PriorityArray = ["HIGH", "MEDIUM", "LOW"];
  const isPriorityValid = PriorityArray.includes(priority);
  StatusArray = ["TO DO", "IN PROGRESS", "DONE"];
  const isStatusValid = StatusArray.includes(status);
  CategroryArray = ["WORK", "HOME", "LEARNING"];
  const isCategoryValid = CategroryArray.includes(category);
  var isDateValid = isValid(new Date(dueDate));

  if (isCategoryValid && isPriorityValid && isStatusValid && isDateValid) {
    const addTodoQuery = `
  INSERT INTO todo(id, todo, priority, status, category, due_date)
  VALUES (
      ${id},
      '${todo}',
       '${priority}',
       '${status}',
       '${category}',
        '${dueDate}'
  );`;
    await db.run(addTodoQuery);

    response.send("Todo Successfully Added");
  } else if (isPriorityValid === false) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (isStatusValid === false) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (isCategoryValid === false) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (isDateValid === false) {
    response.status(400);
    response.send("Invalid Due Date");
  }
});
// API 5

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const { id, todo, priority, status, category, dueDate } = request.body;

  switch (true) {
    case hasStatusProperty(request.body):
      StatusArray = ["TO DO", "IN PROGRESS", "DONE"];
      const isStatusValidOrNot = StatusArray.includes(status);
      if (isStatusValidOrNot) {
        const updateStatusProperty = `
      UPDATE TODO
      SET 
      status='${status}'
       WHERE id=${todoId};`;

        await db.run(updateStatusProperty);
        response.send("Status Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }

      break;
    case hasPriorityProperty(request.body):
      PriorityArray = ["HIGH", "MEDIUM", "LOW"];
      const isPriorityValidorNot = PriorityArray.includes(priority);

      if (isPriorityValidorNot) {
        const updatePriorityProperty = `
      UPDATE TODO
      SET 
      priority='${priority}'
       WHERE id=${todoId};`;

        await db.run(updatePriorityProperty);
        response.send("Priority Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;

    case hasCategoryProperty(request.body):
      categoryArray = ["WORK", "HOME", "LEARNING"];

      const isCategoryValidOrNot = categoryArray.includes(category);

      if (isCategoryValidOrNot) {
        const updateCategoryProperty = `
      UPDATE TODO
      SET 
      category='${category}'
       WHERE id=${todoId};`;

        await db.run(updateCategoryProperty);
        response.send("Category Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;

    case hasDateProperty(request.body):
      var isDateValid = isValid(new Date(dueDate));
      console.log(isDateValid);

      if (isDateValid) {
        const updateDateProperty = `
      UPDATE TODO
      SET 
      due_date='${dueDate}'
       WHERE id=${todoId};`;

        await db.run(updateDateProperty);
        response.send("Due Date Updated");
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }

      break;

    case hasTodoProperty(request.body):
      const updateTodoProperty = `
      UPDATE TODO
      SET 
      todo='${todo}'
       WHERE id=${todoId};`;
      await db.run(updateTodoProperty);
      response.send("Todo Updated");
      break;
  }
});

module.exports = app;
