// ---------------------------
// Online Songs
// ---------------------------

const songs = [
{
    title: "Sample Song 1",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/300?random=1"
},
{
    title: "Sample Song 2",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/300?random=2"
},
{
    title: "Sample MP3",
    artist: "GitHub Sample",
    src: "https://github.com/SergLam/Audio-Sample-files/raw/master/sample.mp3",
    cover: "https://picsum.photos/300?random=3"
}
];

// ---------------------------
// HTML Elements
// ---------------------------

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");

let currentSong = 0;

// ---------------------------
// Load Song
// ---------------------------

function loadSong(index){

    title.innerText = songs[index].title;
    artist.innerText = songs[index].artist;
    cover.src = songs[index].cover;
    audio.src = songs[index].src;

}

loadSong(currentSong);

// ---------------------------
// Play Song
// ---------------------------

function playSong(){

    audio.play();

    playBtn.innerHTML =
    '<i class="fas fa-pause"></i>';

}

// ---------------------------
// Pause Song
// ---------------------------

function pauseSong(){

    audio.pause();

    playBtn.innerHTML =
    '<i class="fas fa-play"></i>';

}

// ---------------------------
// Play / Pause Button
// ---------------------------

playBtn.addEventListener("click",()=>{

    if(audio.paused){
        playSong();
    }else{
        pauseSong();
    }

});

// ---------------------------
// Next Song
// ---------------------------

nextBtn.addEventListener("click",()=>{

    currentSong++;

    if(currentSong>=songs.length){
        currentSong=0;
    }

    loadSong(currentSong);

    playSong();

    highlightSong();

});

// ---------------------------
// Previous Song
// ---------------------------

prevBtn.addEventListener("click",()=>{

    currentSong--;

    if(currentSong<0){
        currentSong=songs.length-1;
    }

    loadSong(currentSong);

    playSong();

    highlightSong();

});

// ---------------------------
// Progress Bar
// ---------------------------

audio.addEventListener("timeupdate",()=>{

    if(audio.duration){

        progress.max=audio.duration;

        progress.value=audio.currentTime;

        currentTime.innerHTML=
        formatTime(audio.currentTime);

        duration.innerHTML=
        formatTime(audio.duration);

    }

});

// ---------------------------
// Seek Song
// ---------------------------

progress.addEventListener("input",()=>{

    audio.currentTime=progress.value;

});

// ---------------------------
// Volume
// ---------------------------

volume.addEventListener("input",()=>{

    audio.volume=volume.value;

});

// ---------------------------
// Auto Play Next Song
// ---------------------------

audio.addEventListener("ended",()=>{

    currentSong++;

    if(currentSong>=songs.length){
        currentSong=0;
    }

    loadSong(currentSong);

    playSong();

    highlightSong();

});

// ---------------------------
// Format Time
// ---------------------------

function formatTime(time){

    let min=Math.floor(time/60);

    let sec=Math.floor(time%60);

    if(sec<10){
        sec="0"+sec;
    }

    return min+":"+sec;

}

// ---------------------------
// Create Playlist
// ---------------------------

function createPlaylist() {
    
    playlist.innerHTML = "";
    
    songs.forEach((song, index) => {
        
        let li = document.createElement("li");
        
        li.innerHTML = song.title + " - " + song.artist;
        
        li.onclick = function() {
            
            currentSong = index;
            
            loadSong(currentSong);
            
            playSong();
            
            highlightSong();
            
        };
        
        // Double-click to remove song
        li.ondblclick = function() {
            
            if (confirm("Remove this song from playlist?")) {
                
                songs.splice(index, 1);
                
                localStorage.setItem(
                    "playlist",
                    JSON.stringify(songs)
                );
                
                if (currentSong >= songs.length) {
                    currentSong = 0;
                }
                
                createPlaylist();
                
                if (songs.length > 0) {
                    loadSong(currentSong);
                }
            }
        };
        
        playlist.appendChild(li);
        
    });
    
    highlightSong();
    
}

// ---------------------------
// Highlight Current Song
// ---------------------------

function highlightSong() {
    
    const items = playlist.querySelectorAll("li");
    
    items.forEach((item, index) => {
        
        item.classList.remove("active");
        
        if (index === currentSong) {
            item.classList.add("active");
        }
        
    });
    
}

// ---------------------------
// Add New Song
// ---------------------------

document.getElementById("addSong").addEventListener("click", function() {
    
    const titleInput = document.getElementById("songTitle").value.trim();
    const artistInput = document.getElementById("songArtist").value.trim();
    const fileInput = document.getElementById("songFile").value.trim();
    const coverInput = document.getElementById("coverFile").value.trim();
    
    if (titleInput === "" || artistInput === "" || fileInput === "") {
        
        alert("Please enter all required details.");
        
        return;
    }
    
    songs.push({
        title: titleInput,
        artist: artistInput,
        src: fileInput,
        cover: coverInput || "https://picsum.photos/300"
    });
    
    localStorage.setItem(
        "playlist",
        JSON.stringify(songs)
    );
    
    createPlaylist();
    
    document.getElementById("songTitle").value = "";
    document.getElementById("songArtist").value = "";
    document.getElementById("songFile").value = "";
    document.getElementById("coverFile").value = "";
    
});

// ---------------------------
// Search Songs
// ---------------------------

document.getElementById("search").addEventListener("keyup", function() {
    
    let value = this.value.toLowerCase();
    
    const items = playlist.querySelectorAll("li");
    
    items.forEach(item => {
        
        if (item.innerText.toLowerCase().includes(value)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
        
    });
    
});

// ---------------------------
// Keyboard Shortcuts
// ---------------------------

document.addEventListener("keydown", function(e) {
    
    switch (e.code) {
        
        case "Space":
            e.preventDefault();
            
            if (audio.paused) {
                playSong();
            } else {
                pauseSong();
            }
            break;
            
        case "ArrowRight":
            nextBtn.click();
            break;
            
        case "ArrowLeft":
            prevBtn.click();
            break;
    }
    
});

// ---------------------------
// Load Saved Playlist
// ---------------------------

window.onload = function() {
    
    const saved = localStorage.getItem("playlist");
    
    if (saved) {
        
        songs.length = 0;
        
        JSON.parse(saved).forEach(song => songs.push(song));
        
    }
    
    loadSong(currentSong);
    
    createPlaylist();
    
};