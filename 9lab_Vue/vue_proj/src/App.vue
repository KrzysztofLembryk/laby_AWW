<template>
  <v-app>
    <v-card>
      <h1>List of imgs</h1>
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>

        <v-chip class="green">
            Init nbr of images: {{ init_nbr_of_imgs}}
        </v-chip>
        <br>
        <v-chip v-if="init_nbr_of_imgs != new_nbr_of_imgs" class="red" @click="get_imgs">
            ({{ new_nbr_of_imgs - init_nbr_of_imgs }} new images)
            CLICK TO REFRESH
        </v-chip>

      <div>
        <p>All tags:</p>
        <v-chip v-for="(tag, index) in allTags" :key="index" @click="selectedTag = tag">
          {{ tag }}
        </v-chip>
      </div>

      <div style="margin-top: 5px;">
        <p>Selected tag: {{ selectedTag }}</p>
      </div>

      <div class="bottom-border"></div>
      
      <v-list>

        <v-list-item-group v-for="(id_image_and_tags, index) in sortedImages" :key="index">

          <v-list-item>
            <v-list-item-content v-html="id_image_and_tags.img"
             @click="selectedImageID = id_image_and_tags.id; dialog = true; send_request_for_img(selectedImageID)"> 
             </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-chip v-for="(tag, tagIndex) in id_image_and_tags.tags" :key="tagIndex">
              {{ tag }}
            </v-chip>
          </v-list-item>

        </v-list-item-group>

      </v-list>

      <v-dialog v-model="dialog" max-width="290" @open="dialog = false" @close="selectedImage = null">
        <v-card>
          <v-card-title class="headline">Selected Image</v-card-title>
          <v-card-text>
            <div v-if="selectedImage == null" >
              <img src="./spinner.gif" alt="Loading..." />
            </div>
            <div v-else-if="selectedImage == '0'">
              <p>ERROR</p>
            </div>
            <div v-else v-html="selectedImage"></div>

          </v-card-text>
        </v-card>
      </v-dialog>


    </v-card>
  </v-app>
</template>


<script>
export default {
  name: 'App',
  data() {
    return {
      images: [],
      currentPage: 1,
      itemsPerPage: 3,
      ids_images_and_tags: [],
      selectedTag: null,
      page_count: 0,
      selectedImageID: null,
      selectedImage: null,
      dialog : false,
      init_nbr_of_imgs: 0,
      new_nbr_of_imgs: 0,
      socket: null,
    };
  },

  computed: {
    sortedImages() {
      let images;
      if (!this.selectedTag || this.selectedTag == "All") {
        images =  this.ids_images_and_tags;
        // let start = (this.currentPage - 1) * this.itemsPerPage;
        // let end = start + this.itemsPerPage;
        // this.totalPages(Math.ceil(images.length / this.itemsPerPage))
        // return images.slice(start, end);
      }
      else 
      {
        images = this.ids_images_and_tags.filter(id_image_and_tags => id_image_and_tags.tags.includes(this.selectedTag));

      }
        let start = (this.currentPage - 1) * this.itemsPerPage;
        let end = start + this.itemsPerPage;
        this.set_page_count(Math.ceil(images.length / this.itemsPerPage))
        return images.slice(start, end);
    },

    allTags() {
      let tagsMap = new Map();
      tagsMap.set("All", 1);
      for (let i = 0; i < this.ids_images_and_tags.length; i++) 
      {
        for (let j = 0; j < this.ids_images_and_tags[i].tags.length; j++) 
        {
          tagsMap.set(this.ids_images_and_tags[i].tags[j], 1);
        }
      }

      return Array.from(tagsMap.keys());
    },

    totalPages() {
      return this.page_count;
    },
  },

  created() {
    this.get_imgs();

    this.socket = new WebSocket('ws://localhost:8000/ws');

    this.socket.onmessage = (event) => {
      this.new_nbr_of_imgs = parseInt(event.data, 10);
    }
  },

  methods: {

    async send_request_for_img(id)
    {
      this.selectedImage = null;
      const response = await fetch('http://localhost:8000/img/' + id);
      const data = await response.json();
      if (!response.ok) 
      {
        this.selectedImage = '0';
      }
      else 
      {
        this.selectedImage = data;
      }
    },

    set_page_count(nbr)
    {
      this.page_count = nbr;
    },

    get_tags() {
      let tags = ["tag1", "strange", "tag2", "purple", "hot", "boring", "nice"]
      const randomTags = [];
      const nbr_of_tags = Math.floor(Math.random() * 3) + 1;

      while (randomTags.length < nbr_of_tags) {
        const randomIndex = Math.floor(Math.random() * tags.length);
        const randomTag = tags[randomIndex];
        if (!randomTags.includes(randomTag)) {
          randomTags.push(randomTag);
        }
      }
      return randomTags;
    },

    async get_imgs() {
      const response = await fetch('http://localhost:8000/imgLst');
      const data = await response.json();


      this.images = data;
      this.ids_images_and_tags = [];
      for (let i = 0; i < this.images.length; i++) {
        this.ids_images_and_tags.push({ id: this.images[i].id, img: this.images[i].svg, tags: this.get_tags() });
      }
      this.init_nbr_of_imgs = this.ids_images_and_tags.length;
      this.new_nbr_of_imgs = this.ids_images_and_tags.length;
    },
  },
};
</script>

<style scoped>
.v-list-item-group {
  flex-direction: column;
}
.bottom-border {
  border-bottom: 1px solid black;
  margin: 10px;
}
</style>