
/**
 *  作者：@ZZITE
 *  博客：https://zzite.github.io/
 *  邮箱：zziteqaq@163.com
 */ 
 
window.onload = function() {
  var audio = document.getElementById('audio'), // 播放器                  
  sourceList = audio.getElementsByTagName('source'), // 音乐资源列表         
  play = document.getElementById('play'), // 播放按钮       
  prev = document.getElementById('prev'), // 上一曲        
  next = document.getElementById('next'), // 下一曲          
  mute = document.getElementById('mute'), // 静音              
  voiceBar = document.getElementById('voiceBar'), // 音量条                  
  voicedBar = document.getElementById('voicedBar'), // 当前音量         
  musicBar = document.getElementById('musicBar'), // 播放进度         
  playedBar = document.getElementById('playedBar'), // 已播放进度       
  loadBar = document.getElementById('loadBar'), // 加载进度条        
  songName = document.getElementById('songName'), // 歌曲名           
  playTime = document.getElementById('playTime'), //  已播音乐时间     
  totalTime = document.getElementById('totalTime'), // 歌曲音乐总时间        
  musicImg = document.getElementById('music-img'), // 音乐封面        
  cycle = document.getElementById('cycle'), // 循环按钮              
  musicList = document.getElementById('musicList'),//我的歌单列表
  currentSrcIndex = 0; //控制播放第几首
                

  //初始化部分
  // 是否循环 
  audio.loop = false;

  // 是否自动播放
  audio.autoplay = false;

  // 初始化音量
  audio.volume = 0.5;
  var voicedBarWidth = (audio.volume / 1) * voiceBar.clientWidth;
  voicedBar.style.width = voicedBarWidth + 'px';

  // 是否自动缓冲加载
  audio.autobuffer = false;
  
  //音乐控制部分
  // 播放暂停按键
  play.onclick = function() {
    if (audio.paused) {
      //第一次播放更新歌曲标题与时常
	  var minute = parseInt(audio.duration / 60);
	  var second = parseInt(audio.duration % 60);
	    if (second < 10) {
	      second = '0' + second;
	    }
		totalTime.innerHTML = minute + ':' + second;
		//songName.innerHTML = sourceList[currentSrcIndex].title;
		this.innerHTML = '嘘';
		musicImg.style.animation = 'Rotate 30s linear infinite';
    currentImg = sourceList[currentSrcIndex].getAttribute('data-img');
    musicImg.setAttribute('src', currentImg);
		//updateSong();
		audio.play();
	} else {
	    audio.pause();
		this.innerHTML = '咻';
		musicImg.removeAttribute('style');
	  }
  };

  //点击我的歌单列表播放选中歌曲
  //时间委托
  musicList.addEventListener('click', function(ev) {
    var t = ev.target || ev.srcElement;
    if (t.tagName.toLowerCase() === 'a') {
	  //这里返回所点击的a标签位于ul的第几个li中 ~ ~
	  var index = ([].indexOf.call(t.parentNode.parentNode.children, t.parentNode));
	  currentSrcIndex = index;
	  updateSong();
	  musicTime();
	  audio.play();
	}
  });
  //根据currentSrcIndex的值给播放器添加相应歌曲
  function updateSong() {
  	currentSrc = sourceList[currentSrcIndex].getAttribute('src');
	  currentImg = sourceList[currentSrcIndex].getAttribute('data-img');
	  musicImg.setAttribute('src', currentImg);
	  audio.setAttribute('src', currentSrc);
  }

  //根据currentSrcIndex的值更新相应歌曲的名字和时间
	function musicTime() {
	  songName.innerHTML = sourceList[currentSrcIndex].title;
	  // 播放时间
	  audio.addEventListener("canplay", function() {
	    var minute = parseInt(audio.duration/ 60);
		var second = parseInt(audio.duration % 60);
		if (second < 10) {
		  totalTime.innerHTML = minute + ':0' + second;
		} else {
		    totalTime.innerHTML = minute + ':' + second;
		  }
		play.innerHTML = '嘘';
		musicImg.style.animation = 'Rotate 30s linear infinite';
	  });
	}

  // 下一曲
  next.onclick = function() {
  	changeMusic('next');
  };

  // 上一曲
  prev.onclick = function() {
  	changeMusic('prev');
  };

  // 上下曲控制函数
  function changeMusic(direct) {
    if (direct === 'next') {
      ++ currentSrcIndex > sourceList.length - 1 && (currentSrcIndex = 0 );
	} else {
	    --currentSrcIndex < 0 && (currentSrcIndex = sourceList.length - 1 )
	  }
	updateSong();
	audio.play();
	musicTime();
  }

  // 音量调节（增加黄色现在音量显示）
  voiceBar.onclick = function(event) {
    var voiceBarWidth = voiceBar.clientWidth;
    var newVolume = (event.offsetX / voiceBarWidth);
    audio.volume = newVolume;
    // 音量大小更新
    var voicedBarWidth = (audio.volume / 1) * voiceBarWidth;
    voicedBar.style.width = voicedBarWidth + 'px';
  };

  // 静音
  mute.onclick = function() {
  	if (!audio.muted) {
	  audio.muted = true;
	  voicedBar.style.width = 0 + 'px';
	} else {
		audio.muted = false;
		var voiceBarWidth = voiceBar.clientWidth;

	// 音量大小更新
	var voicedBarWidth = (audio.volume / 1) * voiceBarWidth;
	voicedBar.style.width = voicedBarWidth + 'px';
	}
  };


  // 单曲循环按钮
  cycle.onclick = function() {
  	if (audio.loop) {
	  audio.loop = false;
	  this.innerHTML = '循环';
	} else {
		audio.loop = true;
		this.innerHTML = '单曲';
	  }
  };


  // 播放进度调节
  musicBar.onclick = function(event) {
	var musicBarWidth = musicBar.clientWidth;
	var newCurrentTime = (event.offsetX / musicBarWidth) * audio.duration;
	audio.currentTime = newCurrentTime;
	var playedBarWidth = (audio.currentTime / audio.duration) * musicBarWidth;
	playedBar.style.width = playedBarWidth + 'px';
  };

  // 播放进度实时更新(修改为歌曲播放时开启定时器，暂停和页面load时清除定时器)
  setInterval(function updatePlayedBar() {
  	var musicBarWidth = musicBar.clientWidth;
	var playedBarWidth = (audio.currentTime / audio.duration) * musicBarWidth;
	playedBar.style.width = playedBarWidth + 'px';
	if (audio.currentTime % 60 < 10) {
	  playTime.innerHTML = parseInt(audio.currentTime / 60) + ':0' + parseInt(audio.currentTime % 60);
	} else {
		playTime.innerHTML = parseInt(audio.currentTime / 60) + ':' + parseInt(audio.currentTime % 60);
	  }
	//如果是时间结束，且当前不是单曲循环，自动切换下一曲
	if (audio.currentTime === audio.duration && !audio.loop) {
	  next.onclick();
	}
  }, 1000);


  // 判断文件缓冲进度
  setInterval(function updateCache() {
	var buffered, percent;
	// 已缓冲部分
	audio.readyState === 4 && (buffered = audio.buffered.end(0));
	// 已缓冲百分百
	audio.readyState === 4 && (percent = Math.round(buffered / audio.duration * 100) + '%');
	loadBar.style.width = (Math.round(buffered / audio.duration * 100) * musicBar.clientWidth * 0.01) + 'px';
  }, 1000);



  musicImg.addEventListener('mouseover', function() {
  //var arr = shishi.src.split("/");// 	
  if (musicImg.src.indexOf('miao.png') > 0) {
	cuteCat.innerHTML = '乖巧';
		}
  });
  musicImg.addEventListener('mouseout', function() {
	cuteCat.innerHTML = '';
  });





  // 网易云音乐部分
  var keyword = document.getElementById('keyWord'); // 搜索歌名           
  var searchBtn = document.getElementById('searchBtn'); // 搜索按钮           
  var result = document.getElementById('result'); // 结果部分 

  // 搜索按钮
  //添加回车和点击事件
  keyword.addEventListener('keydown', function(e) {
  	if (!e) {
	  e = window.event;
	}
	if ((e.keyCode || e.which) == 13) {
	  var value = keyword.value;
		if (!value) {
		  alert('关键词不能为空');
		  return;
		}
	  var url = "http://s.music.163.com/search/get/";
	  var data = {
			"type": 1,
			"limit": 1,
			"s": value,
			"callback": "jsonpcallback"
			};
	  var buffer = [];
		for (var key in data) {
		  buffer.push(key + '=' + encodeURIComponent(data[key]));
		}
	  var fullpath = url + '?' + buffer.join('&');
	  CreateScript(fullpath);
	}
  });

  searchBtn.addEventListener('click', function() {
  	var value = keyword.value;
	if (!value) {
	  alert('关键词不能为空');
	  return;
	}
	var url = "http://s.music.163.com/search/get/";
	var data = {
			"type": 1,
			"limit": 1,
			"s": value,
			"callback": "jsonpcallback"
		};
	var buffer = [];
	for (var key in data) {
	  buffer.push(key + '=' + encodeURIComponent(data[key]));
	}
	var fullpath = url + '?' + buffer.join('&');
		//if (fullpath.indexOf("https") < 0) {    
		//fullpath = fullpath.replace("http:", "https:");    
		//} 
	CreateScript(fullpath);
  });


  // 利用委托来为立即播放绑定事件
  result.addEventListener('click', function(ev) {
    var t = ev.target || ev.srcElement;
	//转化小写再比较更安全
	if (t.tagName.toLowerCase() === 'a') {
	  var oMusicSrc = result.getAttribute('data-audio');
	  var oMusicImg = result.getAttribute('data-img');
	  var oMusicName = result.getAttribute('data-music');
	  var oSinger = result.getAttribute('data-singer');
	  musicImg.setAttribute('src', oMusicImg);
	  songName.innerHTML = oMusicName + '-' + oSinger;
	  audio.setAttribute('src', oMusicSrc);
	  audio.play();
	  musicTime();
	  t.innerHTML = '正在播放';
	}

  });
	
  
  //JSONP创建script
  function CreateScript(src) {
  	var el = document.createElement('script');
		el.src = src;
		el.async = true;
		el.defer = true;
		document.body.appendChild(el);
  }

};

