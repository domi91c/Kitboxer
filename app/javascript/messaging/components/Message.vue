<template>
  <div class="message" :class="position">
    {{content}}
  </div>
</template>

<script>
export default {
  props: ['position', 'content']
}
</script>

<style scoped>
.message {
  display: flex;
  background-color: rgb(54, 208, 219);
  width: 66%;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.right {
  float: right
}
</style>
