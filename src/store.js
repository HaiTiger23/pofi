import { createStore } from "vuex";

export default createStore({
    state: {
        duration: localStorage.getItem('duration_pomodoro') ?localStorage.getItem('duration_pomodoro') : 45,
        break_duration:localStorage.getItem('break_pomodoro') ?localStorage.getItem('break_pomodoro') : 5,
        // Lịch sử bài hát, lấy từ localStorage hoặc tạo mới nếu chưa có
        songHistory: localStorage.getItem('song_history') ? JSON.parse(localStorage.getItem('song_history')) : [],
    },
    mutations: {
        updateDuration(state, duration) {
            state.duration = duration;
            localStorage.setItem('duration_pomodoro', duration);
            
        },
        updateBreakDuration(state, duration) {
            state.break_duration = duration;
            localStorage.setItem('break_pomodoro', duration);
           
        },
        // Thêm bài hát vào lịch sử
        addToHistory(state, song) {
            // Kiểm tra xem bài hát đã có trong lịch sử chưa
            const existingIndex = state.songHistory.findIndex(item => item.videoId === song.videoId);
            
            // Nếu đã có, xóa bỏ bài cũ
            if (existingIndex !== -1) {
                state.songHistory.splice(existingIndex, 1);
            }
            
            // Thêm bài mới vào đầu danh sách
            state.songHistory.unshift(song);
            
            // Giớí hạn chỉ lưu 10 bài gần nhất
            if (state.songHistory.length > 10) {
                state.songHistory.pop(); // Xóa bài cũ nhất (ở cuối mảng)
            }
            
            // Lưu vào localStorage
            localStorage.setItem('song_history', JSON.stringify(state.songHistory));
        }
    },
    getters: {
        getDuration(state) {
            return state.duration;
        },
        getBreakDuration(state) {
            return state.break_duration;
        },
        // Lấy danh sách lịch sử bài hát
        getSongHistory(state) {
            return state.songHistory;
        }
    }
})