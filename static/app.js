var url = "https://cs-2021-todo-ryann-anderson.herokuapp.com";

var app = new Vue({
    el: "#app",
    data: {
        todos: [
            // {
            //     name: "Feed the dog",
            //     description: "N/A",
            //     done: false,
            //     editing: false,
            //     deadline: new Date().toLocaleDateString()
            // }
        ],
        new_todo_name: "",
        new_todo_description: "",
        new_todo_deadline: "",
        // new_todo_notes: ""
    },
    created:function(){
        this.getTodos();

    },


    methods: {
        getTodos: function(){
            fetch(`${url}/todo`).then(function(response){
                response.json().then(function(data){
                    console.log(data);
                    app.todos = data;
                });
            })
        },
        addNewTodo: function(){
            var request_body= { 
                name: this.new_todo_name,
                description: this.new_todo_description,
                done: false,
                deadline: this.new_todo_deadline,
                // notes: this.new_todo_notes
            };
            fetch(`${url}/todo`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(request_body)
            }).then(function(response){
                console.log(request_body)
                if(response.status == 400){
                    response.json().then(function(data){
                        alert(data.msg)
                    })
                }else if(response.status == 201){
                    app.new_todo_name="";
                    app.new_todo_description="";
                    app.new_todo_deadline="";
                    app.getTodos();
                }
            });
            
        },
        deleteTodo: function( todo ) {
            fetch(`${url}/todo/`+ todo,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(){app.getTodos()});
        },

        editTodo: function(todo) {
            // todo.editing = true;
            this.$set(todo, 'editing', true);
        },

        saveTodo: function(todo) {
            // todo.editing = false;
            var updated_body = {
                name: todo.name,
                description: todo.description,
                deadline: todo.deadline,
                done: todo.done
            }
            fetch(`${url}/todo/` + todo._id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(updated_body)
            });
            this.$set(todo, 'editing', false);
        },

        saveTodoDone: function(todo) {
            fetch(`${url}/todo/` + todo._id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    done: todo.done
                })
            });
            console.log(todo.done);
        }
        
    }
})