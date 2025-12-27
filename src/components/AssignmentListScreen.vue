<template>
    <div class="container mt-4">
      <h2 class="text-purple mb-4 animate__animated animate__fadeIn">Задания</h2>
      <div class="row">
        <div
          class="col-md-4 mb-4 animate__animated animate__fadeInUp"
          v-for="assignment in assignments"
          :key="assignment.id"
        >
          <router-link :to="`/assignment/${assignment.id}`" class="text-decoration-none text-dark">
            <div class="card h-100 assignment-card">
              <div class="card-body">
                <h5 class="card-title">{{ assignment.title }}</h5>
                <p class="card-text">От {{ assignment.created_at.split('T')[0] }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  

<script setup>
const { id } = defineProps({
    assignments: Array
});

</script>

<style scoped>
.assignment-card {
  background-color: #f9f3fc; /* светло-сиреневый фон */
  border-radius: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.assignment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(111, 66, 193, 0.2); /* сиреневый тень */
}

.text-purple {
  color: #6f42c1;
}
</style>
