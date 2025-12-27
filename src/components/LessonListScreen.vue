<template>
    <div class="container mt-4">
      <h2 class="text-purple mb-4">Уроки</h2>
      <div class="row">
        <div
          class="col-md-4 mb-4"
          v-for="lesson in lessons"
          :key="lesson.id"
        >
          <router-link
            :to="`/lesson/${lesson.id}`"
            class="text-decoration-none text-dark"
          >
            <div class="card h-100 lesson-card animate__animated animate__fadeInUp">
              <div class="card-body">
                <h5 class="card-title text-purple">{{ lesson.title }}</h5>
                <p class="card-text text-muted">
                  От {{ lesson.created_at.split('T')[0] }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  

<script setup>

const { id } = defineProps({
    lessons: Array
});

</script>

<style scoped>
.lesson-card {
  background-color: #f9f3fc;
  border-radius: 1rem;
  padding: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.lesson-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(111, 66, 193, 0.15);
}

.text-purple {
  color: #6f42c1;
}
</style>
