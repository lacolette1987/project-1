
export class Todo {
    constructor(id, duedate, title, filterDesc, prio, state, createdAt) {
        this.id = id;
        this.duedate = duedate;
        this.title = title;
        this.filterDesc = filterDesc;
        this.prio = prio;
        this.state = state;
        this.createdAt = createdAt;
    }

}

export function serialize(todoObjects){
    const listTodos = [];
    if (Array.isArray(todoObjects)) {
        todoObjects.forEach((todo) => {
            const newTodo = new Todo(todo._id, todo.duedate, todo.title, todo.description, todo.prio, todo.state, todo.createdAt);
            listTodos.push(newTodo);
        });
    }
    return listTodos;
}


