import { Injectable, NotFoundException } from '@nestjs/common';
import { Todos } from '../interface/todos.interface';
import { CreateTodoDto } from '../Dto/create-todo.dto';

@Injectable()
export class TodosService {
  todos: Todos[] = [
    {
      id: 1,
      title: 'todo app',
      done: false,
      description: 'Create NestJS todos app',
    },
    {
      id: 2,
      title: 'bread',
      done: true,
      description: 'buy bread',
    },
  ];

  // Trouver un élément dans la liste des tâches en fonction de son id
  findOne(id: string) {
    return this.todos.find((task) => task.id === Number(id));
  }

  // Renvoie toutes les tâches
  findAll(): Todos[] {
    return this.todos;
  }

  // Créer une nouvelle tâche
  create(todo: CreateTodoDto) {
    this.todos = [...this.todos, todo];
  }

  // Mettre à jour une tâche existante en fonction de son id
  udapte(id: string, todo: Todos) {
    const todoToUpdate = this.todos.find((task) => task.id === +id);

    // Si l'élément avec l'id donné n'est pas trouvé, renvoie une erreur NotFoundException
    if (!todoToUpdate)
      return new NotFoundException('did you find this todo 🥶');

    // Mettre à jour une seule propriété
    if (todo.hasOwnProperty('done')) todoToUpdate.done = todo.done;
    if (todo.title) todoToUpdate.title = todo.title;
    if (todo.description) todoToUpdate.description = todo.description;

    // Remplacer l'élément mis à jour dans la liste des tâches
    const updateTodos = this.todos.map((task) => task.id !== +id ? task : todoToUpdate);
    this.todos = [...updateTodos];
    return { updateTodos: 1, todo: todoToUpdate };
  }

  // Supprimer une tâche en fonction de son id
  delete(id: string) {
    const nbBeforeDelete = this.todos.length;

    // Supprimer l'élément avec l'id donné de la liste des tâches
    this.todos = [...this.todos].filter((task) => task.id !== +id);

    // Si l'élément a été supprimé avec succès, renvoie un objet avec la propriété "deletedTask" et le nombre de tâches restantes
    if (this.todos.length < nbBeforeDelete) {
      return { deletedTask: 1, nbTask: this.todos.length };
    } else {
      // Si aucun élément n'a été supprimé, renvoie un objet avec la propriété "deletedTodos" égale à 0 et le nombre total de tâches
      return { deletedTodos: 0, nbTodos: this.todos.length };
    }
  }
}
