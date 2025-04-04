<template>
  <div id="playerContainer" class="hidden">
    
    <div ref="playerContainer" class=""></div>
  </div>
  <div :class="{'relative bg-yellow-50 overflow-hidden h-screen w-screen':true, ' cursor-progress': !videoStatus,}">
    <img
      :src="`https://i3.ytimg.com/vi/${current_music.videoId}/hqdefault.jpg`"
      class="w-full h-full brightness-50 object-cover"
      alt=""
    />
    <div
      className=" absolute top-0 h-screen w-full bg-gray-300 bg-clip-padding
    backdrop-filter backdrop-blur-md bg-opacity-10 "
    >
      <div class="flex flex-col justify-between h-full relative">
        <SideBar></SideBar>
        <!-- Pomodoro -->
        <PomoDoro :pauseVideo="pauseVideo"></PomoDoro>
        <!-- Music Play -->
        <div class="w-full min-h-[30%] px-5">
          <div class="text-white">
            <div class="flex justify-between">
              <div
                :class="{
                  'w-[400px]': isSearch,
                  'w-[50px]': !isSearch,
                  'relative border flex justify-between h-[40px] transition-all ease-in-out duration-200': true,
                }"
              >
                <ListVideos
                  class="absolute bottom-[100%]"
                  :list="list_search"
                  v-if="showListSearch"
                  @get-video-event="handleVideo"
                ></ListVideos>
                <input
                  type="text"
                  id="search_input"
                  v-on:keydown="Search"
                  :class="{
                    'bg-transparent w-[90%] transition-all ease-in-out duration-200 outline-0 border-0 focus:outline-0 focus:shadow-none': true,
                    block: isSearch,
                    hidden: !isSearch,
                  }"
                  placeholder="Enter to search"
                  v-model="input_search"
                />
                <div
                  :class="{
                    'flex justify-center items-center cursor-pointer': true,
                    'w-[10%]': isSearch,
                    'w-full': !isSearch,
                  }"
                  v-on:click="Togglesearch"
                >
                  <i
                    :class="{
                      'ri-search-line': !isSearch,
                      'ri-close-line': isSearch,
                    }"
                  ></i>
                </div>
              </div>
            </div>
            <p class="">
              {{ current_music.title }}
            </p>
            <input
              :max="current_music.duration"
              :disabled="!videoStatus"
              id="default-range"
              type="range"
              v-on:change="changeCurrentTime"
              v-on:mousedown="pauseRange"
              @mouseup="resumeRange"
              v-model="range"
              class="w-full h-2"
            />
            <div class="flex justify-between">
              <p>{{ fomartDuration(current_music.currentTime) }}</p>
              <p>{{ fomartDuration(current_music.duration) }}</p>
            </div>
            <div class="flex justify-center w-full relative">
              <div
                class="flex justify-around items-center w-[80%] md:w-[40%] text-[20px]"
              >
                <!-- <div><i class="ri-skip-back-fill"></i></div> -->
                <i class="ri-heart-line"></i>
                <div>
                  <i
                    class="ri-replay-10-line cursor-pointer"
                    v-on:click="replayForward(-10)"
                  ></i>
                </div>
                <div v-on:click="playVideo" class="text-[42px] cursor-pointer">
                  <i
                    :class="{
                      'ri-play-circle-line': !videoStatusRun || !videoStatus,
                      ' cursor-progress': !videoStatus,
                      'ri-pause-circle-line': videoStatusRun ,
                    }"
                  ></i>
                </div>
                <div>
                  <i
                    class="ri-forward-10-fill cursor-pointer"
                    v-on:click="replayForward(10)"
                  ></i>
                </div>
                <!-- <div><i class="ri-skip-forward-fill"></i></div> -->
                <div
                  class="relative"
                  @mouseover="isShowVolume = true"
                  @mouseout="isShowVolume = false"
                >
                  <i :class="{'ri-volume-up-line':volume > 50,'ri-volume-down-line':volume < 50,'ri-volume-mute-line':volume == 0 }" @click="muteVolume"></i>
                  <input
                    :class="{
                      ' w-[0px] opacity-0 delay-300': !isShowVolume,
                      'left-[20px] opacity-100 w-[100px] ': isShowVolume,
                      ' absolute top-[50%] translate-y-[-50%] transition-all duration-200 ease-linear': true,
                    }"
                    type="range"
                    v-model="volume"
                  />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubePlayer from "youtube-player";
import PomoDoro from "./components/PomoDoro.vue";
import ListVideos from "./components/ListVideos.vue";
import search from "./assets/js/search.js";
import SideBar from "./components/SideBar.vue";
export default {
  name: "App",
  components: {
    ListVideos,
    SideBar,
    PomoDoro,
  },

  mounted() {
    let latestSong =  localStorage.getItem('latestSong');
    if(latestSong == null) {
      latestSong = 'DnewVhYNt-I';
    }
    this.current_music.videoId = latestSong;
    this.initPlayer(this.current_music.videoId);
  },
  beforeUnmount() {
    cancelAnimationFrame(this.rangeFrameID);
  },

  data() {
    return {
      isSearch: false,
      input_search: "",
      list_search: [],
      showListSearch: false,
      videoStatusRun: false,
      videoStatus: false,
      current_music: {
        title: "",
        videoId: "ukHK1GVyr0I",
        duration: "",
        currentTime: "",
        rangeFrameID: null,
      },
      range: 0,
      isShowVolume: false,
      volume: 100,
      oldVolume: 100,
    };
  },
  watch: {
    volume(newValue) {
      this.player.setVolume(newValue);
    },
  },
  methods: {
    Togglesearch() {
      if (this.showListSearch && this.isSearch) {
        this.showListSearch = false;
      }
      this.isSearch = !this.isSearch;
    },
    Search(event) {
      if (event.key == "Enter") {
        let videoId = null;
        if (this.input_search.indexOf("youtube.com/watch?v=") != -1) {
          videoId = this.input_search.split("watch?v=")[1].split("&")[0];
        }

        if (videoId) {
          this.current_music.videoId = videoId;
          this.initPlayer(this.current_music.videoId);
        } else {
          search(
            {
              apiKey: "AIzaSyALf4_KV8Chd2sU27UZDURSbunca7PVBeo",
              term: this.input_search,
            },
            (reponse) => {
              this.list_search = reponse;
              this.showListSearch = true;
            }
          );
        }
        this.input_search = "";
      }
    },
    handleVideo(data) {
      this.initPlayer(data.id.videoId);
    },
    initPlayer(videoId) {
      this.videoStatusRun = false;
      this.videoStatus = false;
      // Xóa video cũ
      if (this.player) {
        this.player.destroy();
        this.player = null;
      }
      this.current_music.videoId = videoId;
      localStorage.setItem('latestSong', videoId);
      // Khởi tạo player
      this.player = YouTubePlayer(this.$refs.playerContainer, {
        videoId: videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
        },
      });
      this.player.on("ready", () => {
        this.videoStatus = true;
        this.setTitle();
        this.player.playVideo();
        this.player.pauseVideo();
        
        this.player.getDuration().then((duration) => {
          this.current_music.duration = duration;
        });
        this.player.on("stateChange", (event) => {
        if (event.data === 0) {
        this.player.seekTo(0); 
        this.player.playVideo(); 
      }
      })

       
      });

      // this.videoStatusRun = true;
    },
    updateRange() {
      this.rangeFrameID = setInterval(() => {
        this.player.getCurrentTime().then((currentTime) => {
        this.current_music.currentTime = Math.ceil(currentTime);
        this.range = this.current_music.currentTime;
      });
      },500)
    },
    pauseRange() {
      clearInterval(this.rangeFrameID)
    },
    resumeRange() {
      this.rangeFrameID = null;
      this.updateRange()
    },
    playVideo() {
      if (this.videoStatus) {
        this.videoStatusRun = !this.videoStatusRun;
        if (this.videoStatusRun) {
          this.player.playVideo();
          this.rangeFrameID = null;
          this.updateRange()
        } else {
          this.player.pauseVideo();
          clearInterval(this.rangeFrameID)
        }
      }
    },
    fomartDuration(seconds = 0) {
      
      let result = "";
      if (seconds >= 3600) {
        let hour = Math.floor(seconds / 3600);
        if (hour > 0) {
          if (hour < 10) {
            result += "0" + hour + ":";
          } else {
            result += hour + ":";
          }
        }
        seconds = seconds - hour * 3600;
      }
      let minute = Math.floor(seconds / 60);
      if (minute < 10) {
        result += "0" + minute + ":";
      } else {
        result += minute + ":";
      }
      seconds = seconds - minute * 60;

      if (seconds < 10) {
        result += "0" + seconds;
      } else {
        result += seconds;
      }
      return result;
    },
    changeCurrentTime(e) {
      this.range = e.target.value;
      this.player.seekTo(this.range);
    },
    replayForward(time) {
      let current = this.range;
      if (this.player) {
        if (current + time < 0) {
          current = 0;
        } else if (current + time > this.current_music.duration) {
          current = this.current_music.duration;
        } else {
          current = current + time;
        }
        this.player.seekTo(current);
      }
    },
    setTitle() {
      let ContainerPlayer = document.getElementById("playerContainer");
      let iframePlayer = ContainerPlayer.firstChild;
      this.current_music.title = iframePlayer.title;
    },
    muteVolume() {
      if (this.volume != 0) {
        this.oldVolume = this.volume;
        this.volume = 0;
      } else {
        this.volume = this.oldVolume;
      }
    },
    pauseVideo() {
      if (this.videoStatus && this.videoStatusRun) {
        this.videoStatusRun = false;
        this.player.pauseVideo();
        clearInterval(this.rangeFrameID);
      }
    },
  },
};
</script>

<style>
#search_input:focus {
  border-color: inherit !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
</style>
