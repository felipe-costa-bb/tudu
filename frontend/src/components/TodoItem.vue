<template>
  <div class="todo-item">
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
    <p>Status: {{ item.status }}</p>
    <p>Assigned to: {{ item.assignedTo }}</p>
    <button @click="editItem">Edit</button>
    <button @click="removeItem">Remove</button>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    editItem() {
      this.$emit('edit', this.item);
    },
    removeItem() {
      this.$emit('remove', this.item.id);
    }
  }
}
</script>

<style scoped>
.todo-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}
</style>