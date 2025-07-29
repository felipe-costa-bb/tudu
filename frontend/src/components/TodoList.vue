<template>
  <div class="todo-list">
    <h2>Your To-Do Lists</h2>
    <div v-for="list in todoLists" :key="list.id" class="todo-list-item">
      <h3>{{ list.title }}</h3>
      <p>{{ list.description }}</p>
      <button @click="shareList(list.id)">Share</button>
      <button @click="removeList(list.id)">Remove</button>
      <ul>
        <li v-for="item in list.items" :key="item.id">
          <todo-item 
            :item="item" 
            @modify="modifyItem(item.id)" 
            @remove="removeItem(item.id)" 
            @assign="assignItem(item.id)" 
          />
        </li>
      </ul>
      <input v-model="newItemTitle" placeholder="New item title" />
      <button @click="addItem(list.id)">Add Item</button>
    </div>
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue';
import { useTodosStore } from '@/stores/todos';

export default {
  components: {
    TodoItem
  },
  setup() {
    const todosStore = useTodosStore();
    return {
      todosStore
    };
  },
  data() {
    return {
      newItemTitle: ''
    };
  },
  computed: {
    todoLists() {
      return this.todosStore.todoLists;
    }
  },
  methods: {
    addItem(listId) {
      if (this.newItemTitle.trim()) {
        this.todosStore.addItem({ listId, title: this.newItemTitle });
        this.newItemTitle = '';
      }
    },
    modifyItem(itemId) {
      // Logic to modify item
    },
    removeItem(itemId) {
      this.todosStore.removeItem(itemId);
    },
    removeList(listId) {
      this.todosStore.removeTodoList(listId);
    },
    shareList(listId) {
      // Logic to share the list
    },
    assignItem(itemId) {
      // Logic to assign item to a user
    }
  }
};
</script>

<style scoped>
.todo-list {
  margin: 20px;
}
.todo-list-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>