const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleBottom = document.getElementById("shuffle");
const repeatBottom = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");
const likeBottom =  document.getElementById("like");


;
const vodka = {
    songName: "Comfortably Numb", 
    artist: "Pink Floyd by Kleber K Shima",
    file: "Vodka",
    liked: false
};
const evh = {
    songName: "Poundcake",
    artist: "Van Halen by Rodrigo Cordeiro",
    file: "evh9180",
    liked: false
};

const mark = {
    songName : "Smooth",
    artist : "Carlos Santana by Rodrigo Cordeiro",
    file : "Mark1",
    liked: false
};

const valvedriver = {
    songName : "Time",
    artist : "Pink Floyd by Fulvio Oliveira",
    file : "Valve",
    liked: false
};

const playlist = JSON.parse(localStorage.getItem("playlist")) ?? [vodka , evh , mark , valvedriver];
let sortedPlaylist = [...playlist];
let index = 0;

let isPlaying = false;
let shuffled = false;
let repeatOn = false; 

function playsong() {
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pausesong() {
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    song.pause();
    isPlaying = false;
}

function playPauseDecide(){
    if(isPlaying === true){
        pausesong();
    }
    else {
        playsong();
    }
}

function initializeSong(){
    cover.src = `Images/${sortedPlaylist[index].file}.png`;
    song.src = `Songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist; 
    likeBottomRemeber();
}

function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }
    else {
        index -= 1;
    }
    initializeSong();
    playsong();
}

function nextSong(){
    if(index === sortedPlaylist.length - 1){
        index = 0;
    }
    else {
        index += 1;
    }
    initializeSong();
    playsong();
} 

function updateProgress(){
    const barwidth = (song.currentTime/song.duration) * 100;
    currentProgress.style.setProperty("--progress", `${barwidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
    
}

function jumpTo(event){
    const pWitdh = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/pWitdh) * song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preshuffleArray){
    const size = preshuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random()* size);
        let aux = preshuffleArray[currentIndex];
        preshuffleArray[currentIndex] = preshuffleArray[randomIndex];
        preshuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }

}

function shuffleBottomClick() {
    if(shuffled === false) {
        shuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleBottom.classList.add("bottom-active");
    }
    else{
        shuffled = false;
        sortedPlaylist = [...playlist];
        shuffleBottom.classList.remove("bottom-active");
    }
}

function repeatBottomClick() {
    if(repeatOn === false) {
        repeatOn = true;
        repeatBottom.classList.add("bottom-active");
    }
    else {
        repeatOn = false;
        repeatBottom.classList.remove("bottom-active");
    }
}

function nextOrRepeat() {
    if(repeatOn === false) {;
        nextSong();
    }
    else {
        playsong();
    }
}

function toHHMMSS(originalNumber) {

    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600)/60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);
    return (`${hours.toString().padStart(2,"0")}:${min.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`);

}

function updateCurrentTime() {
    songTime.innerText = toHHMMSS(song.currentTime);
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeBottomRemeber() {
    if(sortedPlaylist[index].liked === true) {
        likeBottom.querySelector(".bi").classList.remove("bi-heart");
        likeBottom.querySelector(".bi").classList.add("bi-heart-fill");
        likeBottom.classList.add("bottom-active");
    }
    else {
        likeBottom.querySelector(".bi").classList.add("bi-heart");
        likeBottom.querySelector(".bi").classList.remove("bi-heart-fill");
        likeBottom.classList.remove("bottom-active");
    }
}

function likeBottomClick() {
    if(sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    }
    else {
        sortedPlaylist[index].liked = false;
    }
    likeBottomRemeber();
    localStorage.setItem("playlist", JSON.stringify(playlist));
}

initializeSong();

play.addEventListener("click", playPauseDecide);
previous.addEventListener("click",previousSong);
next.addEventListener("click",nextSong);
song.addEventListener("timeupdate",updateProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressContainer.addEventListener("click", jumpTo);
shuffleBottom.addEventListener("click", shuffleBottomClick);
repeatBottom.addEventListener("click", repeatBottomClick);
likeBottom.addEventListener("click", likeBottomClick);
