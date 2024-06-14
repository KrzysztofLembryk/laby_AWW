<template>
  <v-app>
    <v-card>
      <h1>List of imgs</h1>
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
      
      <div>
        <p>All tags:</p>
        <v-chip v-for="(tag, index) in allTags" :key="index" @click="selectedTag = tag">
          {{ tag }}
        </v-chip>
      </div>
      <div class="bottom-border"></div>
      

      <v-list>

        <v-list-item-group v-for="(image_and_tags, index) in sortedImages" :key="index">

          <v-list-item>
            <v-list-item-content v-html="image_and_tags.img">
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-chip v-for="(tag, tagIndex) in image_and_tags.tags" :key="tagIndex">
              {{ tag }}
            </v-chip>
          </v-list-item>

        </v-list-item-group>

      </v-list>
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
      images_and_tags: [],
      selectedTag: null,
      page_count: 0,
    };
  },

  computed: {
    sortedImages() {
      let images;
      if (!this.selectedTag || this.selectedTag == "All") {
        images =  this.images_and_tags;
        // let start = (this.currentPage - 1) * this.itemsPerPage;
        // let end = start + this.itemsPerPage;
        // this.totalPages(Math.ceil(images.length / this.itemsPerPage))
        // return images.slice(start, end);
      }
      else 
      {
        images = this.images_and_tags.filter(image_and_tags => image_and_tags.tags.includes(this.selectedTag));

      }
        let start = (this.currentPage - 1) * this.itemsPerPage;
        let end = start + this.itemsPerPage;
        this.set_page_count(Math.ceil(images.length / this.itemsPerPage))
        return images.slice(start, end);
    },

    allTags() {
      let tagsMap = new Map();
      tagsMap.set("All", 1);
      for (let i = 0; i < this.images_and_tags.length; i++) 
      {
        for (let j = 0; j < this.images_and_tags[i].tags.length; j++) 
        {
          tagsMap.set(this.images_and_tags[i].tags[j], 1);
        }
      }

      return Array.from(tagsMap.keys());
    },
    paginatedImages() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.images_and_tags.slice(start, end);
    },

    totalPages() {
      return this.page_count;
    },
  },

  created() {
    this.get_imgs();
  },

  methods: {

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
      for (let i = 0; i < this.images.length; i++) {
        this.images_and_tags.push({ img: this.images[i], tags: this.get_tags() });
      }
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