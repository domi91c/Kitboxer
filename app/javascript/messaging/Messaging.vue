<template>
  <div>
    <Message position="right" content="lorem ipsum die etse uembl efal aelfa weka rglae rgkaaerg"></Message>
    <Message position="right" content="lorem ipsum die etse uembl efal aelfa weka rglae rgkaaerg"></Message>
    <div class="modal-footer">
      <TextField/>
    </div>
  </div>
</template>

<script>
import Message from './components/Message'
import TextField from './components/TextField'

export default {
  components: { TextField, Message }
}
</script>

<style scoped>
h1 {
  color: green
}
</style>
