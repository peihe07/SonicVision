<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <div class="policy-content">
          <div v-for="(section, index) in content" :key="index" class="section">
            <h3>{{ section.title }}</h3>
            <p v-if="section.text">{{ section.text }}</p>
            <ul v-if="section.items">
              <li v-for="(item, itemIndex) in section.items" :key="itemIndex">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">
          關閉
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PolicyDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: Array,
      required: true
    }
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    close() {
      this.dialog = false
    }
  }
}
</script>

<style scoped>
.policy-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem;
}

.section {
  margin-bottom: 2rem;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

p {
  line-height: 1.6;
  color: #444;
  margin-bottom: 1rem;
}

ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  line-height: 1.6;
  color: #444;
  margin-bottom: 0.5rem;
}
</style> 