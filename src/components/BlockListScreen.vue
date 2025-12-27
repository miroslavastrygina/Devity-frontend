<template>
    <h2 class="text-purple mb-3">Блоки</h2>
    <div class="row">
      <div
        class="col-md-4 mb-4 animate__animated animate__fadeInUp"
        v-for="block in blocks"
        :key="block.id"
      >
        <router-link
          :to="`/block/${block.id}`"
          class="text-decoration-none text-dark"
        >
          <div class="block-card card h-100 smooth-hover">
            <div class="card-body">
              <h5 class="card-title text-purple">{{ block.title }}</h5>
              <p class="card-text">От {{ block.created_at.split('T')[0] }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </template>

<script setup>
const { blocks } = defineProps({
    blocks: Array
});

</script>

<style scoped>
.block-card {
  background-color: #f9f3fc; /* мягкий сиреневый фон */
  border-radius: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); /* лёгкая тень */
}

.smooth-hover:hover {
  transform: translateY(-4px); /* лёгкое "поднятие" */
  box-shadow: 0 6px 20px rgba(111, 66, 193, 0.15); /* мягкая сиреневая тень */
}

.text-purple {
  color: #6f42c1;
}
</style>