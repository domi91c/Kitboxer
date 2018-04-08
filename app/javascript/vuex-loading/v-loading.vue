<template>
    <div v-if='status' :class="classes">
      <slot name='spinner'>
      </slot>
      <span>{{ message }}</span>
    </div>
</template>
<script>
  export default {
    name: 'v-loading',
    props: ['when', 'loader', 'message', 'classes'],
    computed: {
      status() {
        if (this.when) {
          return this.when;
        }
        if (this.loader) {
          return this.$loading.isLoading(this.loader);
        }
        return this.$loading.anyLoading;
      }
    }
  }
</script>