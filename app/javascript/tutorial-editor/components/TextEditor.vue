<template>
    <div>
        <input :id="`trix-input-${_uid}`" type="hidden" :value="value">
        <trix-editor class="form-control" ref="`trix${_uid}`" :placeholder="placeholder" :input="`trix-input-${_uid}`"
                     @trix-change="change"></trix-editor>
    </div>
</template>

<script>

  export default {
    props: ['value', 'placeholder'],
    methods: {
      change({ target }) {
        this.$emit('input', target.value)
      },
    },
  }
</script>