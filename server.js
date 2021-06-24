// This file is in charge of api endpoints and the
// api server stuff

// import express so you can use it
const express = require("express");
const { store, Todo } = require("./model");
const cors = require("cors");
// instantiate your app/server
const app = express();


app.use(cors());
// const fs

// tell our app to use json (this is an example of a middleware but this one
// is implemented for us)
app.use(express.json({}));

// this is where we will do our own middleware
app.use((req, res, next) => {
  console.log(
    "Time: ",
    Date.now(),
    " - Method: ",
    req.method,
    " - Path: ",
    req.originalUrl,
    " - Body: ",
    req.body
  );
  next();
});

// Get - gets all of the todos (does not have a URL param)
app.get("/todo", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log("getting all todos");
  // return all of the todos in the store
    Todo.find({}, (err, todo) => {
        if (err) {
            console.log(`There was an error finding todos`, err);
            res.status(500).json({ message: `unable to list todos`, error: err});
            return;
    }
      res.status(200).json(todo)
  });
});

// Get - gets the todo with the given id
app.get("/todo/:id", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    console.log(`getting todo with id: ${req.params.id}`);
    Todo.findById(req.params.id, (err, todo) =>{
    // check if there was an error
    if (err) {
        console.log(`There was an error finding a todo with id ${req.params.id}`)
        res.status(500).json({
                error: `Unable to find todo with id ${req.params.id}`,
                error: err
            });
        return; 
        } else if (todo === null) {
        res.status(404).json({
                message: `todo with id: ${req.params.id} does not exist`,
                error: err
            })
            return;
    }
      res.status(200).json(todo)
  });
});

// app.get("/todo/:id/notes/:id", function (req, res) {
//   res.setHeader("Content-Type", "application/json");
//   var id = req.params.id
//   console.log(`getting todo with id: ${req.params.id}`);
//   Todo.findById(id, req.params.id, (err, todo) =>{
//   // check if there was an error
//   if (err) {
//       console.log(`There was an error finding a todo with id ${req.params.id}`)
//       res.status(500).json({
//               error: `Unable to find todo with id ${req.params.id}`,
//               error: err
//           });
//       return; 
//       } else if (todo === null) {
//       res.status(404).json({
//               message: `todo note with id: ${req.params.id} does not exist`,
//               error: err
//           })
//           return;
//   }
//     res.status(200).json(todo)
// });
// });

let nextID = 0;

// Post - crates one todo (does not have a URL param)
app.post("/todo", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    console.log(`creating a todo with body`, req.body);
  
    if (
        req.body.name === null || 
        req.body.name === undefined || 
        req.body.name === ""
        ) {
        console.log("name empty when creating todo");
        res.status(500).json({
            message: "unable to create todo",
            error: "name empty when creating todo",
        });
        return;
    } 
    if (
        req.body.description === null ||
        req.body.description === undefined ||
        req.body.description === ""
    ) {
        console.log("description empty when creating todo");
        res.status(500).json({
            message: "unable to create todo",
            error: "description empty when creating todo"
        });
        return
    } 
    if (
        req.body.done === null ||
        req.body.done === undefined ||
        req.body.done === ""
    ) {
        console.log("done empty when creating todo");
        res.status(500).json({
            message: "unable to create todo",
            error: "done empty when creating todo"
        });
        return;
    } 
    if (
        req.body.deadline === null ||
        req.body.deadline === undefined ||
        req.body.deadline === ""
    ) {
        console.log("deadline empty when creating todo");
        res.status(500).json({
            message: "unable to create todo",
            error: "deadline empty when creating todo"
        });
        return;
    }

  let creatingTodo = {
      name: req.body.name || "",
      description: req.body.description || "",
      done: req.body.done || false,
      deadline: req.body.deadline || new Date(),
      // notes: req.body.notes || ""
  };

  Todo.create(creatingTodo, (err, todo) =>{
      // check if there is an error
      if(err) {
          console.log(`unable to create todo`)
          res.status(500).json({
              message: "unable to create todo",
              error: err,
          });
          return;
      }
      res.status(201).json(todo);
  });
});

// Delete - deletes the todo with the given id
app.delete("/todo/:id", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    console.log(`deleting todo with id: ${req.params.id}`);
   
    Todo.findByIdAndDelete(req.params.id, function(err, todo){
        if (err) {
            console.log(`There was an error finding a todo with id ${req.params.id}`)
            res.status(500).json({
                    error: `Unable to find todo with id ${req.params.id}`,
                    error: err
                });
            return; 
            } else if (todo === null) {
            res.status(404).json({
                    message: `todo with id: ${req.params.id} does not exist`,
                    error: err
                })
                return;
        }
          res.status(200).json(todo)
    });
});

// Patch - updates the todo with the given id
app.patch("/todo/:id", function (req, res) {
    console.log(`updating todo with id: ${req.params.id} with body`, req.body);
  
    let updateTodo = {};
    // name
    if (req.body.name !== null && req.body.name !== undefined) {
      updateTodo.name = req.body.name;
    }
    // description
    if (req.body.description !== null && req.body.description !== undefined) {
      updateTodo.description = req.body.description;
    }
    // deadline
    if (req.body.deadline !== null && req.body.deadline !== undefined) {
      updateTodo.deadline = req.body.deadline;
    }
    // done
    if (req.body.done !== null && req.body.done !== undefined) {
      updateTodo.done = req.body.done;
    }

    // if (req.body.notes !== null && req.body.notes !== undefined) {
    //   updateTodo.notes = req.body.notes;
    // }
  
    Todo.updateOne(
      { _id: req.params.id },
      {
        $set: updateTodo,
      },
      function (err, updateOneResponse) {
        if (err) {
          console.log(`unable to patch todo`);
          res.status(500).json({
            message: "unable to patch todo",
            error: err,
          });
          return;
        } else if (updateOneResponse.n === 0) {
          console.log(`unable to patch todo with id ${req.params.id}`);
          res.status(404).json({
            message: `todo with id ${req.params.id} not found`,
            error: err,
          });
        } else {
          res.status(200).json(updateOneResponse);
        }
      }
    );
  });


// Put - replaces the todo with the given id`
app.put("/todo/:id", function (req, res) {
    console.log(`replacing todo with id: ${req.params.id} with body`, req.body);
  
    let updateTodo = {
      name: req.body.name || "",
      description: req.body.description || "",
      done: req.body.done || false,
      deadline: req.body.deadline || new Date(),
      // notes: req.body.notes || ""
    };
  
    if (
      req.body.name === null || 
      req.body.name === undefined || 
      req.body.name === ""
      ) {
      console.log("name empty when creating todo");
      res.status(500).json({
          message: "unable to create todo",
          error: "name empty when creating todo",
      });
      return;
    } 
    if (
        req.body.description === null ||
        req.body.description === undefined ||
        req.body.description === ""
    ) {
        console.log("description empty when creating todo");
        res.status(500).json({
            message: "unable to create todo",
            error: "description empty when creating todo"
        });
        return
    } 
    if (
        req.body.done === null ||
        req.body.done === undefined ||
        req.body.done === ""
    ) {
        console.log("done empty when creating todo");
        res.status(500).json({
            message: "unable to create todo",
            error: "done empty when creating todo"
        });
        return;
    } 
    if (
        req.body.deadline === null ||
        req.body.deadline === undefined ||
        req.body.deadline === ""
    ) {
        console.log("deadline empty when creating todo");
        res.status(500).json({
            message: "unable to create todo",
            error: "deadline empty when creating todo"
        });
        return;
    }


    Todo.updateOne(
      { _id: req.params.id },
      updateTodo,
      function (err, updateOneResponse) {
        if (err) {
          console.log(`unable to replace todo`);
          res.status(500).json({
            message: "unable to replace todo",
            error: err,
          });
          return;
        } else if (updateOneResponse.n === 0) {
          console.log(`unable to replace todo with id ${req.params.id}`);
          res.status(404).json({
            message: `todo with id ${req.params.id} not found`,
            error: err,
          });
        } else {
          res.status(200).json(updateOneResponse);
        }
      }
    );
  });
  

module.exports = app;
//comment