<template>
    <div class="card mb-4">

        <crop-modal :step="step" :image="currentImage"></crop-modal>
        <b-modal
                :id="`remove-step-modal-${step.id}`"
                size="sm"
                lazy
                title="Delete Step"
                ok-title="Delete"
                @ok="$store.dispatch('deleteStep', step)">
            <p>Are you sure you want to delete this step?</p>
        </b-modal>
        <div class="card-body">
            <button type="button" class="close" v-b-modal="`remove-step-modal-${step.id}`">×</button>
            <h2 class="card-title">Step {{this.stepNumber}}
            </h2>
            <form :data-vv-scope="step.id">
                <div class="form-group">
                    <input type="text"
                           name="title"
                           class="form-control"
                           :class="{'is-invalid': errors.has(`${step.id}.title`)}"
                           placeholder="Step title..."
                           v-validate="'required'"
                           v-model="title">
                    <span v-show="errors.has(`${step.id}.title`)" class="text-danger">
                        {{ errors.first(`${step.id}.title`) }}
                    </span>
                </div>
                <div class="form-group">
                    <text-editor
                            @input="validate"
                            :placeholder="'Step instructions...'"
                            :data-vv-scope="step.id"
                            :name="'body'"
                            :value="body"
                            :scope="step.id"
                            :validate="'required'"
                            v-model="body">
                    </text-editor>
                </div>
                <div class="row ">
                    <step-image-button :step="step"></step-image-button>
                    <step-image v-for="image in step.images"
                                :key="image.id"
                                :step="step"
                                :image="image"
                                @preview-image="launchCropModal(image)">
                    </step-image>
                    <step-image-loading :step="step"></step-image-loading>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
  import TextEditor from './TextEditor.vue'
  import StepImageButton from './StepImageButton.vue'
  import StepImageLoading from './StepImageLoading.vue'
  import StepImage from './StepImage.vue'
  import CropModal from './CropModal.vue'

  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

  export default {
    inject: ['$validator'],
    props: ['step'],
    components: {
      TextEditor,
      StepImageButton,
      StepImageLoading,
      StepImage,
      CropModal,
    },

    data() {
      return {
        currentImage: { image: { url: '' } },
      }
    },

    computed: {
      ...mapGetters([
        'steps', 'getStepById',
      ]),
      stepNumber() {return this.steps.indexOf(this.step) + 1},
      title: {
        get() {
          return this.$store.getters.getStepById(this.step.id).title
        },
        set(value) {
          this.$store.commit('UPDATE_STEP_TITLE', { title: value, step: this.step })
        },
      },
      body: {
        get() {
          return this.$store.getters.getStepById(this.step.id).body
        },
        set(value) {
          this.$store.commit('UPDATE_STEP_BODY', { body: value, step: this.step })
        },
      },
    },
    methods: {
      launchCropModal(image) {
        this.currentImage = image
        this.$root.$emit('bv::show::modal', `image-modal-${this.step.id}`)
      },
      removeStep(step) {
      },
      validate() {
        this.$validator.validate(`${this.step.id}.body`)
      },
      change({ target }) {
        this.$emit('input', target.value)
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "./resources/assets/sass/variables";*/

    .step-image-list-enter-active, .step-image-list-leave-active {
        transition: all .4s;
    }

    .step-image-list-enter, .step-image-list-leave-to {
        opacity: 0;
    }
</style>