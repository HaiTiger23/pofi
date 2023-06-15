import { createStore } from "vuex";

export default createStore({
    state: {
        duration: localStorage.getItem('duration_pomodoro') ?localStorage.getItem('duration_pomodoro') : 45,
        break_duration:localStorage.getItem('break_pomodoro') ?localStorage.getItem('break_pomodoro') : 5,
    },
    mutations: {
        updateDuration(state, duration) {
            state.duration = duration;
            localStorage.setItem('duration_pomodoro', duration);
            
        },
        updateBreakDuration(state, duration) {
            state.break_duration = duration;
            localStorage.setItem('break_pomodoro', duration);
           
        }
    },
    getters: {
        getDuration(state) {
            return state.duration;
        },
        getBreakDuration(state) {
            return state.break_duration;
        }
    }
})