$(function(){
	var audio=$('#audio').get(0);//把dom对象里的第一个元素取出来(dom对象)
	var $audio=$('#audio');//(juqery对象)
	//展开播放列表
	$('.open_list').on('click',function(){
		var list=$('.player-list');
		var attr=list.attr('style');
		if(attr=='display:none'){
			list.attr('style','display:block');
		}else{
			list.attr('style','display:none');
		}
	})
	//添加音乐
	var musics=[
		{src:'./song/1.mp3',name:'轮回之镜',art:'未知',time:'04:11'},
		{src:'./song/2.mp3',name:'丑八怪',art:'薛之谦',time:'04:08'},
		{src:'./song/3.mp3',name:'刚刚好',art:'薛之谦',time:'04:10'},
		{src:'./song/4.mp3',name:'绅士',art:'薛之谦',time:'04:51'},
		{src:'./song/5.mp3',name:'牵丝戏',art:'排骨',time:'03:59'},
		{src:'./song/6.mp3',name:'最初的温柔',art:'赵乃吉',time:'04:48'},
	];
	$(musics).each(function(index,v){
		$('<li class="ge" data-id='+index+'><span class="song">'
			+v.name+'</span><span class="songer">'
			+v.art+'</span><span class="time">'
			+v.time+'</span><div class="opraction"><ol><li class="like"></li><li class="share"></li><li class="star"></li><li class="delate"></li></ol></div></li>').appendTo('ul');
	})
	var currentIndex;
	$('.player-list .ge').on('click',function(){
		currentIndex=$(this).index();
		audio.src=musics[currentIndex].src;
		audio.play();
		$('.music-name').text(musics[currentIndex].name);
		$('.singer-name').text(musics[currentIndex].art);
		$('.music-time').text(musics[currentIndex].time);
	})
	//删除音乐
	$('.delate').on('click',function(e){
		e.stopPropagation();
		var i=$('.delate').index();
		$(this).closest('.ge').remove();
		musics.splice(i,1);
	})
	//清空音乐
	$('.tab h4').on('click',function(){
		$('.player-list ul').empty();
		audio.src="";
	})
	//上一首
	$('.up').on('click',function(){
		currentIndex-=1;
		if(!currentIndex){currentIndex=0};
		if(currentIndex<0){currentIndex=musics.length-1};
		audio.src=musics[currentIndex].src;
		audio.play();
		$('.music-name').text(musics[currentIndex].name);
		$('.singer-name').text(musics[currentIndex].art);
		$('.music-time').text(musics[currentIndex].time);
	})
	//下一首
	$('.down').on('click',function(){
		currentIndex+=1;
		if(!currentIndex){currentIndex=0};
		if(currentIndex>=musics.length){currentIndex=0};
		audio.src=musics[currentIndex].src;
		audio.play();
		$('.music-name').text(musics[currentIndex].name);
		$('.singer-name').text(musics[currentIndex].art);
		$('.music-time').text(musics[currentIndex].time);
	})
	//模式设置
	$('.method').on('click',function(){
		if(! $('.method_down').attr('style')){
			$('.method_down').attr('style','display:block');
		}else{
			$('.method_down').removeAttr('style');
		}
	})
	//播放暂停
	$('.start').on('click',function(){
		
		if(audio.paused){
			if($audio.src==undefined){
			currentIndex=0;
			audio.src=musics[currentIndex].src;
			audio.play();
		}
			
		}else{
			audio.pause();
		}
	});
	$audio.on('play',function(){
		
		$('.start').addClass('stop');
		$('.player-list .ge')
		.removeClass('playing')
		.eq(currentIndex)
		.addClass('playing');
	})
	$audio.on('pause',function(){
		$('.stop').removeClass('stop');
	})
	$(document).on('keyup',function(e){
		if(e.shiftKey&&e.keyCode==80){
			$('.start').trigger('click');
		}
	})
	//静音
	$('.voice-icon').on('click',function(){
		if(!$(this).attr('voice')){
			$(this).attr('voice',audio.volume);
			audio.volume=0;
		}else{
			audio.volume=$(this).attr('voice');
			$(this).removeAttr('voice');
		}
	})
	//点击改变音量
	$('.voice-size').on('click',function(e){
		audio.volume = e.offsetX/$(this).width();
	})
	$audio.on('volumechange',function(){
		var w=audio.volume*$('.voice-size').width();
		$('.voice-size .voice-bar').width(w);
		$('.voice-size .voice-op').css({left:w-3});
		if(audio.volume===0){
			$('.voice-size .voice-bar').width(0);
			$('.voice-size .voice-op').css({left:0});
			$('.voice-icon').addClass('voice-none');
		}else{
			$('.voice-icon').removeClass('voice-none');
		}
	})
	$('.voice-op').on('click',function(e){
		e.stopPropagation();
	})
	//拖拽音量条
	$('.voice-op').on('mousedown',function(e){
		e.stopPropagation();
		$(this).closest('.voice-size').addClass('moving')
		$(document).on('mousemove',function(e){
			var left=e.pageX-$('.voice-size').offset().left;
			var v=left/$('.voice-size').width();
			v=(v>1)?1:v;
			v=(v<0)?0:v;
			audio.volume=v;
		})
	})
	$(document).on('mouseup',function(e){
		e.stopPropagation();
		$('.voice-size').removeClass('moving')
		$(document).off('mousemove');
	})
	//音乐进度条
	$('.player-bg-bar').on('click',function(e){
		e.stopPropagation();
		var w=e.pageX-$('.player-bg-bar').offset().left;
		$('.play-current-bar').width(w);
		$('.progress-op').css({left:w-3});
		var time=w/$('.player-bg-bar').width()*audio.duration;
		audio.currentTime=time;
	})
	$('.play-current-bar').on('click',function(e){
		e.stopPropagation();
		var w=e.pageX-$('.player-bg-bar').offset().left;
		$('.play-current-bar').width(w);
		$('.progress-op').css({left:w-3});
		var time=w/$('.player-bg-bar').width()*audio.duration;
		audio.currentTime=time;
	})
	$audio.on('timeupdate',function(){
		var w=audio.currentTime/audio.duration*$('.player-bg-bar').width();
		$('.play-current-bar').width(w);
		$('.progress-op').css({left:w-3});
	})
	//音乐进度条拖拽
	$('.progress-op').on('mousedown',function(e){
		e.stopPropagation();
		$(document).on('mousemove',function(e){
			var w=e.pageX-$('.player-bg-bar').offset().left;
			$('.play-current-bar').width(w);
			$('.progress-op').css({left:w-3});
			var time=w/$('.player-bg-bar').width()*audio.duration;
			audio.currentTime=time;
		})
	})
	$('.progress-op').on('mouseup',function(e){
		e.stopPropagation();
		$(document).off('mousemove');
	})
})