// 当前播放的歌曲是第0首
var currentIndex = 0;
// 创建audio对象
var audio = new Audio();
// 设置或者获取自动播放状态
audio.autoplay = true;
var clock;
var musicList = [];

// 当currentTime更新时会触发timeupdate事件

audio.ontimeupdate = function(){
    // 设置或者获取播放时间 this.currentTime
    // 总时间 this.duration
    $('.musicbox .progress-now').style.width = (this.currentTime/this.duration)*100 + '%';
   
}

audio.onplay = function(){
    clock = setInterval(function(){
        // this 指向window
        var min = Math.floor(audio.currentTime/60);
        var sec = (Math.floor(audio.currentTime%60) + '').length === 2 ?  Math.floor(audio.currentTime%60) : '0' + Math.floor(audio.currentTime%60);
        $('.musicbox .time').innerText = min + ':' + sec; 
    }, 1000)
}
audio.onpause = function(){
    clearInterval(clock);
}
audio.onended = function(){
    currentIndex = (++currentIndex) % musicList.length;
    loadMusic(musicList[currentIndex])
}

/// 监听播放按钮
$('.musicbox .play').onclick = function(){
    if(audio.paused){
        audio.play();
        this.querySelector('.fa').classList.remove('fa-play');
        this.querySelector('.fa').classList.add('fa-pause');
    }else{
        audio.pause();
        this.querySelector('.fa').classList.remove('fa-pause');
        this.querySelector('.fa').classList.add('fa-play');
    }
}

$('.musicbox .forward').onclick = function(){
    currentIndex = (++currentIndex) % musicList.length;
    loadMusic(musicList[currentIndex])
}
$('.musicbox .back').onclick = function(){
    currentIndex = (musicList.length + --currentIndex) % musicList.length;
    loadMusic(musicList[currentIndex])
}

// 拖动进度条
$('.musicbox .bar').onclick = function(e){
    var percent = e.offsetX/ parseInt(getComputedStyle(this).width);
    log(percent);
    audio.currentTime = audio.duration * percent;
}

function loadMusic(musicObj){
    $('.musicbox .title').innerText = musicObj.title;
    $('.music .author').innerText = musicObj.author;
    audio.src = musicObj.src;
}

getMusicList(function(list){
    // 数据拿到之后要处理的东西
    musicList = list;
    loadMusic(list[currentIndex]);
})

function getMusicList(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/music.json', true);
    xhr.onload = function(){
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
            // 获取数据成功
            callback(JSON.parse(xhr.responseText));
        }else{
            console.log('请求失败');
        }
    }
    xhr.onerror = function(){
        console.log('网络异常');
    }
    xhr.send()
}


function log(){
    return console.log.apply(undefined, arguments)
}

function $(selector){
    return document.querySelector(selector);
}