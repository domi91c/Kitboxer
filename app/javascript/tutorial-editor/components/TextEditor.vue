<template>
    <div>
        <input :name="name"
               v-model="value"
               v-validate="validate"
               :id="`trix-input-${_uid}-${scope}`"
               type="text"
               class="hidden-field"
               @input="change">
        <trix-editor
                class="form-control"
                :class="{'is-invalid': errors.has(`${scope}.${name}`)}"
                ref="`trix${_uid}`"
                :input="`trix-input-${_uid}-${scope}`"
                :placeholder="placeholder"
                @trix-change="change">
        </trix-editor>
        <span v-show="errors.has(`${scope}.${name}`)" class="text-danger">
                        {{ errors.first(`${scope}.${name}`) }}
                    </span>
    </div>
</template>

<script>

  export default {
    props: ['name', 'value', 'placeholder', 'validate', 'scope'],
    inject: ['$validator'],
    $_veeValidate: {
      name() {return this.name},
      value() {return this.value},
    },
    methods: {
      change({ target }) {
        this.$emit('input', target.value)
      },
    },
  }
</script>


<style>
    .hidden-field {
        position: absolute;
        top: 0;
        left: -99999px;
        opacity: 0;
    }
</style>
