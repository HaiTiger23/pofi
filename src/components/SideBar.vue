<template>
  <!-- drawer init and show -->

  <!-- drawer init and toggle -->
  <div class="text-right">
    <button
      class="text-white text-sm px-5 py-2.5 mr-2 mb-2"
      type="button"
      data-drawer-target="drawer-right-example"
      data-drawer-toggle="drawer-right-example"
      data-drawer-placement="right"
      aria-controls="drawer-right-example"
    >
      <i class="ri-menu-line"></i>
    </button>
  </div>

  <!-- drawer component -->
  <div
    id="drawer-right-example"
    class="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800"
    tabindex="-1"
    aria-labelledby="drawer-right-label"
  >
    <h5
      id="drawer-right-example-label"
      class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
    >
      SideBar
    </h5>
    <button
      type="button"
      data-drawer-hide="drawer-right-example"
      aria-controls="drawer-right-example"
      class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
    >
      <svg
        aria-hidden="true"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <span class="sr-only">Close Sidebar</span>
    </button>
    <div class="py-4 overflow-y-auto">
      <ul class="space-y-2 font-medium">
        <li>
          <button
            type="button"
            class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
          >
            <i class="ri-time-line"></i>
            <span
              class="flex-1 ml-3 text-left whitespace-nowrap"
              sidebar-toggle-item
              >Pomodoro</span
            >
            <svg
              sidebar-toggle-item
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <ul id="dropdown-example" class="hidden py-2 space-y-2">
            <li>
              <label
                for="helper-text"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Duration</label
              >
              <input
                v-on:change="updateDuration"
                type="number"
                id="duration"
                aria-describedby="helper-text-explanation"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                v-model="duration"
              />
            </li>
            <li>
              <label
                for="helper-text"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Break Duration</label
              >
              <input
                type="number"
                id="break"
                aria-describedby="helper-text-explanation"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                v-model="break_duration"
                v-on:change="updateBreakDuration"
                @change="$emit('setBreakDuration', break_duration)"
              />
            </li>
          </ul>
        </li>
        <li>
          <soundList></soundList>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { initFlowbite } from "flowbite";
import { computed } from "vue";
import soundList from './soundList.vue';
export default {
  setup() {
    const store = useStore();
    const duration = computed(function () {
      return store.state.duration;
    });
    const break_duration = computed(function () {
      return store.state.break_duration;
    });
    return {
      duration,
      break_duration,
      store,
      
    };
  },
  components: {
    soundList,
  },
  methods: {
    updateDuration(e) {
      this.store.commit("updateDuration", e.target.value);
    },
    updateBreakDuration(e) {
      this.store.commit("updateBreakDuration", e.target.value);
    },
  },
  mounted() {
    initFlowbite();
  },
};
</script>

<style lang="scss" scoped></style>
