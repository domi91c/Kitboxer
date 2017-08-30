<template>
    <div class="" style="">
        <div class="user-photo" @click="changeAvatar">
            <img :src="this.currentImage">
        </div>
        <crop-modal  :image="image" :person="person" @submit="setNewAvatar">
        </crop-modal>
    </div>
</template>

<script>
  import CropModal from './components/CropModal.vue';
  import { loadAvatar, uploadAvatar } from './model.js';
  import sample from './images/400300.jpg';

  export default {
    components: {
      CropModal,
    },
    mounted() {
//      this.currentImage = this.person.avatar.url;
    },
    props: ['person'],
    data() {
      return {
        cropImage: null,
        image: '',
        currentImage: '',
      };
    },
    methods: {
      changeAvatar() {
        $('#cropModal').modal('show');
        this.cropImage = this.image;
      },
      setNewAvatar(avatar) {
        this.currentImage = avatar.url;
      },
    },
  };

</script>


<style scoped>
    .user-photo {
        height: 300px;
        width:300px;
        border:1px solid black;
    }
</style>
