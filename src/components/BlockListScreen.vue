<template>
    <h2>Блоки</h2>
    <div class="row">
        <div class="col-md-4 mb-4 " v-for="block in blocks">
            <router-link :to="`/block/${block.id}`" class="text-decoration-none text-dark">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">{{ block.title }}</h5>
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