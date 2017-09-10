

(function($) {

	$.fn.html5audio = function(settings) {
		
	var componentInited=false;
	var _self = this;

	var _body = $('body');
	var _window = $(window);
	var _doc = $(document);
	
	var protocol = $.inArray(window.location.protocol, ['http:', 'https:']) ? 'http:' : window.location.protocol;
	
	var windowResizeIntervalID;
	var windowResizeInterval = 150;//execute resize after time finish
	
	var hasDownloadSupport = ("download" in document.createElement("a"));

	var isIOS=false;
	var agent = navigator.userAgent;
	var mobile_type;
	if (agent.indexOf('iPhone') > -1 || agent.indexOf('iPod') > -1 || agent.indexOf('iPad') > -1) {
		isIOS=true;
		if(agent.indexOf('iPhone') > -1)mobile_type = 'iPhone';
		else if(agent.indexOf('iPod') > -1)mobile_type = 'iPod';
		else if(agent.indexOf('iPad') > -1)mobile_type = 'iPad';
	}
	var isWebkit = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
	//console.log(isWebkit);
	
	var audio = document.createElement('audio'), mp3Support, oggSupport, html5Support=false;
	if (audio.canPlayType) {
		html5Support=true;
		mp3Support = !!audio.canPlayType && "" != audio.canPlayType('audio/mpeg');
	}
	
	//icons
	var prevBtnUrl = hap_source_path + settings.buttonsUrl.prev;
	var prevOnBtnUrl = hap_source_path + settings.buttonsUrl.prevOn;
	var nextBtnUrl = hap_source_path + settings.buttonsUrl.next;
	var nextOnBtnUrl = hap_source_path + settings.buttonsUrl.nextOn;
	var playBtnUrl = hap_source_path + settings.buttonsUrl.play;
	var playOnBtnUrl = hap_source_path + settings.buttonsUrl.playOn;
	var pauseBtnUrl = hap_source_path + settings.buttonsUrl.pause;
	var pauseOnBtnUrl = hap_source_path + settings.buttonsUrl.pauseOn;
	var loopBtnUrl = hap_source_path + settings.buttonsUrl.loop;
	var loopOnBtnUrl = hap_source_path + settings.buttonsUrl.loopOn;
	var volumeBtnUrl = hap_source_path + settings.buttonsUrl.volume;
	var volumeOnBtnUrl = hap_source_path + settings.buttonsUrl.volumeOn;
	var muteBtnUrl = hap_source_path + settings.buttonsUrl.mute;
	var muteOnBtnUrl = hap_source_path + settings.buttonsUrl.muteOn;
	var shuffleBtnUrl = hap_source_path + settings.buttonsUrl.shuffle;
	var shuffleOnBtnUrl = hap_source_path + settings.buttonsUrl.shuffleOn;
	var playlistBtnUrl = hap_source_path + settings.buttonsUrl.playlist;
	var playlistOnBtnUrl = hap_source_path + settings.buttonsUrl.playlistOn;
	var dlBtnUrl = hap_source_path + settings.buttonsUrl.download;
	var dlOnBtnUrl = hap_source_path + settings.buttonsUrl.downloadOn;
	var trackUrlIcon = hap_source_path + settings.buttonsUrl.trackUrlIcon;
	var trackDownloadIcon = hap_source_path + settings.buttonsUrl.trackDownloadIcon;
	var trackRemoveIcon = hap_source_path + settings.buttonsUrl.trackRemoveIcon;
	var link_pause = hap_source_path + settings.buttonsUrl.link_pause;
	var link_play = hap_source_path + settings.buttonsUrl.link_play;
	
	//elements
	var componentWrapper = $(this).css('display','block');
	var hap_circle = componentWrapper.hasClass('hap_circle');
	var canvasSupport = false;
	if(html5Support && isCanvasSupported())canvasSupport = true;
	//console.log('canvasSupport = ', canvasSupport);
	
	var isPopup = componentWrapper.attr('id') == 'html5audio-popup';
	//console.log('isPopup=',isPopup);
	
	var playlistHolder = componentWrapper.find('.playlistHolder');
	var playlist_inner = componentWrapper.find('.playlist_inner').css('opacity',0);
	var playerHolder=componentWrapper.find('.playerHolder');
	var player_mediaTime=componentWrapper.find('.player_mediaTime');
	var player_mediaTime_current=componentWrapper.find('.player_mediaTime_current');
	var player_mediaTime_total=componentWrapper.find('.player_mediaTime_total');
	var player_mediaName_Mask=componentWrapper.find('.player_mediaName_Mask');
	var player_mediaName=componentWrapper.find('.player_mediaName');
	var player_controls=componentWrapper.find('.player_controls');
	var player_volume=componentWrapper.find('.player_volume');
	var preloader = componentWrapper.find('.preloader');
	var player_download = componentWrapper.find('.player_download');
	var componentPlaylist = componentWrapper.find('.componentPlaylist');
	
	//settings
	var playlist_list = $(settings.playlistList);
	if(isPopup && window.opener){//window.opener.jQuery instead of window.opener.$ !! important because of the popup!!
		playlist_list = window.opener.jQuery(settings.playlistList);//when the player is loaded in a popup it will search for the playlist list inside document!!
	}
	//console.log(playlist_list);
	
	
	var sound_id = settings.sound_id;
	var autoPlay=settings.autoPlay;
	var initialAutoplay=settings.autoPlay;
	var autoLoad = settings.autoLoad;
	if(isMobile){//important!!
		autoPlay = false;
		settings.autoPlay = false;
	}
	
	var soundcloudApiKey = settings.soundcloudApiKey;
	var soundcloud_result_limit = settings.soundcloud_result_limit;
	var podcast_result_limit = settings.podcast_result_limit;
	var useSongNameScroll=settings.useSongNameScroll;
	var autoSetSongTitle = settings.autoSetSongTitle;
	var loopingOn=settings.loopingOn;
	var randomPlay=settings.randomPlay;
	var mediaTimeSeparator = settings.mediaTimeSeparator;
	var seekTooltipSeparator = settings.seekTooltipSeparator;
	var defaultArtistData = settings.defaultArtistData;
	var useNumbersInPlaylist=settings.useNumbersInPlaylist;
	var titleSeparator = settings.titleSeparator;
	var activePlaylist=settings.activePlaylist;
	var useAlertMessaging = settings.useAlertMessaging;
	var activatePlaylistScroll=settings.activatePlaylistScroll;
	var playlistScrollOrientation = settings.playlistScrollOrientation.toLowerCase();
	var sortablePlaylistItems=settings.sortablePlaylistItems;
	var autoReuseMailForDownload=settings.autoReuseMailForDownload;
	var useRemoveBtnInTracks = settings.useRemoveBtnInTracks;
	var useVolumeTooltip = settings.useVolumeTooltip;
	var useSeekbarTooltip = settings.useSeekbarTooltip;
	var playlistItemContent=settings.playlistItemContent.toLowerCase();
	var useKeyboardNavigation = settings.useKeyboardNavigation;
	var useBtnRollovers = settings.useBtnRollovers;
	var usePlaylistRollovers = settings.usePlaylistRollovers;
	var getTrackInfoFromID3 = settings.getTrackInfoFromID3;
	
	player_mediaTime_current.html('0:00');
	player_mediaTime_total.html('0:00');
	var songTimeCurr = player_mediaTime_current.html();
	var songTimeTot = player_mediaTime_total.html();
	player_mediaName.html(defaultArtistData);
	player_mediaTime_current.html(songTimeCurr + mediaTimeSeparator);
	player_mediaTime_total.html(songTimeTot);
	
	
	var useHtml5Audio=true;
	//console.log('useHtml5Audio= ', useHtml5Audio);
	
	var id3_counter;
	
	//vars
	//addTrack helpers
	var end_insert,//insert at playlist end 
	insert_position, //insert position 
	addTrack_process,
	addHiddenTrack_process,
	playlist_first_init,//first time create playlist with active item (call checkActiveItem after setup)
	hidden_playlist = false, //used with addHiddenTrack
	processed_class = 'hap_processed';//needed for passing playlist between parent/popup window (we are going to copy new playlist before we open player in other window and paste it inside playlist_list, replace the original one, and then load this playlist which has already been processed)
	
	var draggable_class='hap_draggable', isDraggable;
	
	var _trackUrl, mailSet, dl_mail, _downloadOn, _dlink, _download, global_download;//download, mail, p url
	
	var default_artwork, default_content;//default content for no local files
	
	var active_hap_inline, active_text_link, active_song_link_url, active_inline_song;//for inline playable links	
	
	var _playlistLocked=false;
	if(playlistHolder.attr('data-playlistLocked') != undefined)_playlistLocked=true;
	var locked_class='playlist_locked';//append this class to 'li' to prevent any kind of click in playlist (icons as well)
		
	var _playlistLoaded = false;//callback boolean
	//var _soundCreated = false;
	
	var _thumbInnerContainerSize;
	
	var _currentInsert;
	
	var lastPlaylist = null;
	var playlistTransitionOn=true;
	
	var nullMetaData=false;
	var sound_started=false;//detect sound start
	
	var sc_uri, sc_offset, sc_limit=50;//soundcloud, process offset (max results = 50)
	
	var media_type;
	var audioInited=false;
	var mp3='';	
	var mediaPlaying=false;
	var soundLength,
	proxy = hap_source_path + 'includes/ba-simple-proxy.php';
	
	var dataInterval = 250, dataIntervalID, loadPercent;//tracking media data
	
	if(loopingOn) componentWrapper.find('.player_loop').find('img').attr('src', loopOnBtnUrl);
	if(randomPlay) componentWrapper.find('.player_shuffle').find('img').attr('src', shuffleOnBtnUrl);
	
	var playlistDataArr=[];
	var aArr=[];//a
	var liArr=[];//li
	var _playlistLength=0;
	
	var scrollPaneApi;
	
	var preloaderInitShow;//playlistHolder is display none on start but since the preloader is placed inside the playlist we need to show playlistHolder once on start for a preloader to be visible
	
	var hap_feedParser = $('<div class="hap_feedParser"/>');
	
	if(componentWrapper.find("iframe[id='dl_iframe']").length==0){
		var dl_iframe = $('<iframe id="dl_iframe"/>').css({position:'absolute',left:-10000+'px',display:'none'}).appendTo(componentWrapper);//for download
	}else{
		var dl_iframe = componentWrapper.find("iframe[id='dl_iframe']");
	}
	var playlist_loader = $('<div/>');//for playlist processing
	var hidden_playlist_holder = $('<div/>');//hidden playlist
	
	if(isMobile){//download confirmation
		var downConf_timeoutID, downConf_timeout=1000;
		if(playlistHolder.find("div[id='download_confirm']").length==0){
			var download_confirm = $('<div id="download_confirm"><p>DOWNLOAD STARTING</p></DIV>').css({opacity:0, zIndex:1000}).appendTo(playlistHolder);	
		}else{
			var download_confirm = playlistHolder.find("div[id='download_confirm']");	
		}
	}
	
	var processPlaylistDataArr=[];
	var processPlaylistArr=[];
	

	var html5_audio_created = false, hap_audio, audioUp2Js;
	

	var textScroller;
	if(useSongNameScroll)initNameScroll();
	function initNameScroll(){
		if(componentWrapper.find("div[class='fontMeasure']").length==0){
			var fontMeasure = $('<div/>').addClass('fontMeasure').appendTo(componentWrapper);
		}else{
			var fontMeasure = componentWrapper.find("div[class='fontMeasure']");
		}
		textScroller = new apTextScroller();
		textScroller.init(fontMeasure, player_mediaName, player_mediaName_Mask, 'left', settings.scrollSeparator, settings.scrollSpeed);
	}
	
	var pm_settings = {'randomPlay': randomPlay, 'loopingOn': loopingOn};
	var playlistManager = $.playlistManager(pm_settings);
	$(playlistManager).on('ap_PlaylistManager.COUNTER_READY', function(){
		//console.log('ap_PlaylistManager.COUNTER_READY');
		var c = playlistManager.getCounter(), pi = playlistDataArr[c];
		if(!pi)return;
		if(_playlistLocked)return;
		//console.log(pi);
		disableActiveItem();
		if(autoSetSongTitle)setMediaTitle();

		media_type = pi.origtype ? pi.origtype : pi.type;
		//console.log(media_type);
		mp3 = pi.mp3;
		soundLength = pi.length ? pi.length : null;
		pi.download ? global_download=true : global_download=null;//check if current item is downloadable

		if(hasDownloadSupport && global_download){
			if(player_download.find('a.hap-download').length){
				player_download.find('a.hap-download').attr('href',pi.download);
			}else{
				var d = $('<a class="hap-download" href="'+pi.download+'" download></a>');
				player_download.off('click').wrapInner(d);	
			}
		}

		//console.log(global_download);
		findMedia();
		
		if(typeof itemTriggered !== 'undefined')itemTriggered(_self, sound_id, c);//callback
	});
	$(playlistManager).on('ap_PlaylistManager.PLAYLIST_END', function(){
		//console.log('ap_PlaylistManager.PLAYLIST_END');
		disableActiveItem();
		if(typeof audioPlayerPlaylistEnd !== 'undefined')audioPlayerPlaylistEnd(_self, sound_id);//callback
		
		mediaPlaying=false;
		setPlayIcon('off');
		
	});
	$(playlistManager).on('ap_PlaylistManager.PLAYLIST_END_ALERT', function(){
		//console.log('ap_PlaylistManager.PLAYLIST_END_ALERT');
		if(typeof audioPlayerPlaylistEnd !== 'undefined')audioPlayerPlaylistEnd(_self, sound_id);//callback
	});
	
	//********
	
	var _downEvent = "";
	var _moveEvent = "";
	var _upEvent = "";
	var hasTouch;
	if("ontouchstart" in window) {
		hasTouch = true;
		_downEvent = "touchstart.ap mousedown.ap";
		_moveEvent = "touchmove.ap mousemove.ap";
		_upEvent = "touchend.ap mouseup.ap";
	}else{
		hasTouch = false;
		_downEvent = "mousedown.ap";
		_moveEvent = "mousemove.ap";
		_upEvent = "mouseup.ap";
	}
	
	//********** volume 
	
	var volume_seekbar_autoHide = false;
	var _lastVolume;//for mute/unmute
	var _muteOn=false;
	var _defaultVolume =settings.defaultVolume;
	if(_defaultVolume<0) _defaultVolume=0;
	if(_defaultVolume == 0) _lastVolume=0.5;//if we click unmute from mute on the beginning
	else if(_defaultVolume>1)_defaultVolume=1;
	
	var volume_seekbar = componentWrapper.find('.volume_seekbar').css('cursor', 'pointer')
	.on(_downEvent,function(e){
		e.preventDefault();
		/*if(isIOS){
			if(useAlertMessaging) alert('Setting volume on ' + mobile_type + ' is not possible with javascript! Use physical buttons on your ' + mobile_type + ' to adjust volume.');
			return false;
		}*/
		_onDragStartVol(e);
		_muteOn=false;//reset
		return false;		
	});
	
	var vol_orientation = 'horizontal';
	if(volume_seekbar.attr('data-orientation') != undefined){
		vol_orientation = volume_seekbar.attr('data-orientation').toLowerCase();
	} 
	
	if(volume_seekbar.attr('data-autoHide') != undefined){//show volume seekbar on rollover (click on mobile)
		volume_seekbar_autoHide = true;
		
		var vol_seekbar_opened=false;//for mobile (we cant use rollover to open vol seekbar and click on vol toggle btn to toggle mute/unmute, so we use vol toggle btn just to open/close vol seekbar on mobile)
		var volumeTimeoutID, volumeTimeout = parseInt(volume_seekbar.attr('data-autoHide'),10);//hide volume seekbar
		
		if(!isMobile){
			player_volume.on('mouseover', function(){
				if(!componentInited) return false;
				//show volume seekbar
				if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
				volume_seekbar.css('display','block');
				vol_seekbar_opened=true;
				return false;
			}).on('mouseout', function(){
				if(!componentInited) return false;
				if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
				volumeTimeoutID = setTimeout(hideVolume,volumeTimeout);
				return false;
			});
		}
	} 
	
	function hideVolume(){
		if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
		volume_seekbar.css('display','none');
		vol_seekbar_opened=false;
	}
	
	function toggleVolumeMobile(){
		if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
		if(!vol_seekbar_opened){
			volume_seekbar.css('display','block');
			vol_seekbar_opened=true;
			//additional hide volume on timer 
			volumeTimeoutID = setTimeout(hideVolume,volumeTimeout);	
		}else{
			volume_seekbar.css('display','none');
			vol_seekbar_opened=false;
		}
	}
	
	var volumebarDown=false, volumeSize=0, volume_level=componentWrapper.find('.volume_level'), volume_bg = componentWrapper.find('.volume_bg');
	function getVolumeSize(){
		if(vol_orientation=='horizontal'){
			volumeSize=volume_bg.width();
			volume_level.css('width', _defaultVolume*volumeSize+'px');
		}else{
			volumeSize=volume_bg.height();
			volume_level.css('height', _defaultVolume*volumeSize+'px');
		}
	}
	
	// Start dragging 
	function _onDragStartVol(e) {
		if(!componentInited || playlistTransitionOn) return;
		if(seekBarDown) return;
		if(!volumebarDown){					
			var point;
			if(e.type == 'touchstart'){
				var currTouches = e.originalEvent.touches;
				if(currTouches && currTouches.length > 0) {
					point = currTouches[0];
				}else{	
					return false;						
				}
			}else{
				point = e.originalEvent;									
				e.preventDefault();						
			}

			volumebarDown = true;
			_doc.on(_moveEvent, function(e) { _onDragMoveVol(e); }).on(_upEvent, function(e) { _onDragReleaseVol(e); });		
		}
		return false;	
	}
				
	function _onDragMoveVol(e) {	
		var point;
		if(e.type == 'touchmove'){
			var touches;
			if(e.originalEvent.touches && e.originalEvent.touches.length) {
				touches = e.originalEvent.touches;
			}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
				touches = e.originalEvent.changedTouches;
			}else{
				return false;
			}
			// If touches more then one, so stop sliding and allow browser do default action
			if(touches.length > 1) {
				return false;
			}
			point = touches[0];	
			e.preventDefault();				
		} else {
			point = e.originalEvent;
			e.preventDefault();		
		}
		volumeTo(point);
		
		return false;		
	}
	
	function _onDragReleaseVol(e) {
		if(volumebarDown){	
			volumebarDown = false;			
			_doc.off(_moveEvent).off(_upEvent);	
			
			var point;
			if(e.type == 'touchend'){
				var touches;
				if(e.originalEvent.touches && e.originalEvent.touches.length) {
					touches = e.originalEvent.touches;
				}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
					touches = e.originalEvent.changedTouches;
				}else{
					return false;
				}
				// If touches more then one, so stop sliding and allow browser do default action
				if(touches.length > 1) {
					return false;
				}
				point = touches[0];	
				e.preventDefault();				
			} else {
				point = e.originalEvent;
				e.preventDefault();		
			}
			
			//console.log(point.pageX);
			volumeTo(point);
		}
		return false;
	}	
	
	function volumeTo(point){
		//console.log('volumeTo');
		if(vol_orientation=='horizontal'){
			var x = point.pageX;
			_defaultVolume = Math.max(0, Math.min(1, (x - volume_bg.offset().left) / volumeSize));
		}else{
			var y = point.pageY;
			_defaultVolume = Math.max(0, Math.min(1, (y - volume_bg.offset().top) / volumeSize));
			_defaultVolume = 1 - _defaultVolume;//reverse
		}
	 	setVolume();
	}
	
	function toggleVolume(){
		if(!componentInited || playlistTransitionOn) return false;
		if(!_muteOn){
			_lastVolume = _defaultVolume;//remember last volume
			_defaultVolume = 0;//set mute on (volume to 0)
			_muteOn = true;
		}else{
			_defaultVolume = _lastVolume;//restore last volume
			_muteOn = false;
		}
	}
	
	function setVolume(){
		//console.log(_defaultVolume, volumeSize);
		if(vol_orientation=='horizontal'){
			volume_level.css('width', _defaultVolume*volumeSize+'px');
		}else{
			volume_level.css('height', _defaultVolume*volumeSize+'px');
		}
		if(audioInited){
			if(useHtml5Audio){
				if(audioUp2Js)audioUp2Js.volume = _defaultVolume;
			}
		}
		if(_defaultVolume > 0){
			componentWrapper.find('.player_volume').find('img').attr('src', volumeBtnUrl);
		}else{
			componentWrapper.find('.player_volume').find('img').attr('src', muteBtnUrl);
		}
		
		if(isMobile && volume_seekbar_autoHide){//additional hide volume on timer after we use vol seekbar so vol toggle btn doesnt have to be used to close vol seekbar. This also reset volumeTimeoutID which is necessary, otherwise volume seekbar would close even while we touch on it constantly in less time than volumeTimeout
			if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
			volumeTimeoutID = setTimeout(hideVolume,volumeTimeout);	
		}
	}
	
	//************* volume tooltip
	
	if(useVolumeTooltip && !isMobile){
		
		volume_seekbar.on('mouseover', mouseOverHandlerVolume);
		var player_volume_tooltip = componentWrapper.find('.player_volume_tooltip'), player_volume_tooltip_origT = parseInt(player_volume_tooltip.css('top'),10);
		
		//prevent mouse stuck over tooltip
		player_volume_tooltip.on('mouseenter', function(){
			volume_seekbar.off('mouseover', mouseOverHandlerVolume);
			player_volume_tooltip.css('display', 'none');
		}).on('mouseleave', function(){
			volume_seekbar.on('mouseover', mouseOverHandlerVolume); 
		});
	}else{
		componentWrapper.find('.player_volume_tooltip').remove();
	}
	
	function mouseOverHandlerVolume() {
		if(volume_seekbar_autoHide) if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
		
		player_volume_tooltip.css('display', 'block');
		volume_seekbar.on('mousemove', mouseMoveHandlerVolumeTooltip).on('mouseout', mouseOutHandlerVolume);
		_doc.on('mouseout', mouseOutHandlerVolume);
	}
	
	function mouseOutHandlerVolume() {
		if(volume_seekbar_autoHide){
			if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
			volumeTimeoutID = setTimeout(hideVolume,volumeTimeout);
		}
		
		player_volume_tooltip.css('display', 'none');
		volume_seekbar.off('mousemove', mouseMoveHandlerVolumeTooltip).off('mouseout', mouseOutHandlerVolume);
		_doc.off('mouseout', mouseOutHandlerVolume);
	}
	
	function mouseMoveHandlerVolumeTooltip(e){
		if(vol_orientation=='horizontal'){
			var s = e.pageX - volume_bg.offset().left;
			if(!isNumber(s))return false;
			if(s<0) s=0;
			else if(s>volumeSize) s=volumeSize;
			
			var center = parseInt(e.pageX - volume_seekbar.offset().left - player_volume_tooltip.width() / 2, 10);
			player_volume_tooltip.css('left', center + 'px');
			
			var newPercent = Math.max(0, Math.min(1, s / volumeSize));
			var value=parseInt(newPercent * 100, 10);
		}else{
			var s = e.pageY - volume_bg.offset().top;
			if(!isNumber(s))return false;
			if(s<0) s=0;
			else if(s>volumeSize) s=volumeSize;
			
			var center = parseInt(s - player_volume_tooltip.height() / 2,10);
			player_volume_tooltip.css('top', center + player_volume_tooltip_origT + 'px');
			
			var newPercent = Math.max(0, Math.min(1, s / volumeSize));
			newPercent = 1 - newPercent;//reverse
			var value=parseInt(newPercent * 100, 10);
		}
		player_volume_tooltip.find('p').html(value+' %');
	}
	
	//************** end volume
	
	//************** seekbar
	
	var seekPercent, lastSeekPercent;
	var seekBarDown=false;
	var progress_bg = componentWrapper.find('.progress_bg');
	var load_progress = componentWrapper.find('.load_progress');
	var play_progress = componentWrapper.find('.play_progress');
	var player_progress = componentWrapper.find('.player_progress');
	var seekBarSize=progress_bg.width();
	
	if(hap_circle){
		
		var load_canvas = componentWrapper.find('.load_canvas').css('cursor','pointer');
		var play_canvas = componentWrapper.find('.play_canvas');
		var circlePlayer = componentWrapper.find('.circlePlayer');
		var offOpacity = parseFloat(circlePlayer.attr('data-offOpacity'),10);
		var onOpacity = parseFloat(circlePlayer.attr('data-onOpacity'),10);
		if(isMobile)offOpacity=onOpacity=1;
		
		var circle_settings = {strokeSize:parseInt(circlePlayer.attr('data-strokeSize'),10), 
								play_color:play_canvas.attr('data-bgcolor'), 
								load_color:load_canvas.attr('data-bgcolor'),
								tolerance:parseInt(circlePlayer.attr('data-tolerance'),10), 
								offOpacity: offOpacity, 
								onOpacity:onOpacity, 
								circleWidth:load_canvas.width(),
								circleHeight:load_canvas.height()};
		
		if(canvasSupport){
	
			var strokeSize = circle_settings.strokeSize;//seekbar size 
			var play_color = circle_settings.play_color, load_color = circle_settings.load_color;//loading bar color, playbar color
			
			var ctx = load_canvas[0].getContext('2d');
			var ctx2 = play_canvas[0].getContext('2d');
			
			var circ = Math.PI * 2;
			var quart = Math.PI / 2;
			var circleWidth = circle_settings.circleWidth; //canvas width and height needs to be the same!
			var circleHeight = circle_settings.circleHeight; 
			var circleRadius = circleWidth/2;///same as circleHeight/2;
			var playBtnRadius = circleRadius - strokeSize;
			var tolerance = settings.tolerance;//space between seekbar and toggle button in which we will not register click! (so it makes it easier to seek/toggle without accidentally touching one or another. Value must be 0 or above, but below playBtnRadius on which we want to click)
			var toggleValue;//value from center point to detect click on toggle (used for tolerance var)
			var _isCircleSeek = false;//seek vs toggle
			var last_circle_percentage = 0;
			
			load_canvas.on(_downEvent,function(e){
				e.preventDefault();
				if(isCircleToggle(e)){
					_isCircleSeek = false;
					toggleCircle();
				}else{
					_isCircleSeek = true;
					_onDragStartSeek(e);
				}
				//console.log(_isCircleSeek);
				return false;		
			});	
			var player_progress = load_canvas;

		}
	}else{
		var player_progress = componentWrapper.find('.player_progress').css('cursor', 'pointer').on(_downEvent,function(e){
			_onDragStartSeek(e);
			return false;		
		});
	}
	
	// Start dragging 
	function _onDragStartSeek(e) {
		if(!componentInited || playlistTransitionOn) return;
		if(!audioInited) return;
		if(volumebarDown) return;
		if(nullMetaData) return;
		if(!seekBarDown){					
			var point;
			if(e.type == 'touchstart'){
				var currTouches = e.originalEvent.touches;
				if(currTouches && currTouches.length > 0) {
					point = currTouches[0];
				}else{	
					return false;						
				}
			}else{
				point = e;								
				e.preventDefault();						
			}
			seekBarDown = true;
			_doc.on(_moveEvent, function(e) { _onDragMoveSeek(e); }).on(_upEvent, function(e) { _onDragReleaseSeek(e); });		
		}
		return false;	
	}
				
	function _onDragMoveSeek(e) {	
		var point;
		if(e.type == 'touchmove'){
			var touches;
			if(e.originalEvent.touches && e.originalEvent.touches.length) {
				touches = e.originalEvent.touches;
			}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
				touches = e.originalEvent.changedTouches;
			}else{
				return false;
			}
			// If touches more then one, so stop sliding and allow browser do default action
			if(touches.length > 1) {
				return false;
			}
			point = touches[0];	
			e.preventDefault();				
		} else {
			point = e;
			e.preventDefault();		
		}
		setProgress(point, e);
		
		return false;		
	}
	
	function _onDragReleaseSeek(e) {
		if(seekBarDown){	
			seekBarDown = false;			
			_doc.off(_moveEvent).off(_upEvent);	
			
			var point;
			if(e.type == 'touchend'){
				var touches;
				if(e.originalEvent.touches && e.originalEvent.touches.length) {
					touches = e.originalEvent.touches;
				}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
					touches = e.originalEvent.changedTouches;
				}else{
					return false;
				}
				// If touches more then one, so stop sliding and allow browser do default action
				if(touches.length > 1) {
					return false;
				}
				point = touches[0];	
				e.preventDefault();				
			} else {
				point = e;
				e.preventDefault();		
			}
			setProgress(point, e);
		}
		
		return false;
	}	
	
	function toggleCircle(){
		if(toggleValue > playBtnRadius - tolerance) return false;//tollerance area between seekabr and toggle btn, do nothing
		if(!seekBarDown){//only redraw after we release on toggle
			togglePlayback(true);//execute code below after togglePlayback because draw Toggle Btn draws on mediaPlaying var!
			ctx.clearRect(0, 0, circleWidth, circleHeight);
			drawSeekbar(last_circle_percentage);
			drawToggleBtn();
		}
	}

	function setProgress(point, e) {
	
		if(!hap_circle){
		
			seekPercent = point.pageX - progress_bg.offset().left;
			if(seekPercent<0) seekPercent=0;
			else if(seekPercent>seekBarSize) seekPercent=seekBarSize;
			play_progress.width(seekPercent);
			var newPercent = Math.max(0, Math.min(1, seekPercent / seekBarSize));
		
		}else{
			if(canvasSupport){
				if(isCircleToggle(e)){
					if(_isCircleSeek) return false;
					if(toggleValue > playBtnRadius - tolerance) return false;//tollerance area between seekabr and toggle btn, do nothing
					if(!seekBarDown){//only redraw after we release on toggle
						togglePlayback(true);//execute code below after togglePlayback because draw Toggle Btn draws on mediaPlaying var!
						ctx.clearRect(0, 0, circleWidth, circleHeight);
						drawSeekbar(last_circle_percentage);
						drawToggleBtn();
					}
					return false;
					
				}else{
					if(!_isCircleSeek) return false;

					var x = point.pageX - circlePlayer.offset().left - circleWidth/2,
						y = point.pageY - circlePlayer.offset().top - circleHeight/2,
						mAngle = Math.atan2(y, x);
							
					if (mAngle > -1 * Math.PI && mAngle < -0.5 * Math.PI) {
						mAngle = 2 * Math.PI + mAngle;
					}
					
					var newPercent = Math.max(0, Math.min((mAngle + Math.PI / 2) / 2 * Math.PI * 10))/100;
					last_circle_percentage = newPercent;
					//redraw on move
					ctx.clearRect(0, 0, circleWidth, circleHeight);
					drawSeekbar(last_circle_percentage);
					drawToggleBtn();
				}
			}else{}
		}
		if(!isNumber(newPercent))return false;
		lastSeekPercent = last_circle_percentage;
		seekToVal(newPercent);
	}
	
	function seekToVal(percent) {
		if(useHtml5Audio){
			if(audioUp2Js && audioUp2Js.seekable && audioUp2Js.seekable.length > 0){
				if(!isWebkit || isMobile){
					audioUp2Js.currentTime= percent * audioUp2Js.duration;
				}else{
					if(percent * audioUp2Js.duration >= audioUp2Js.buffered.end(0) - 5){
						audioUp2Js.currentTime= audioUp2Js.buffered.end(0) - 5;//no seek past buffered point! (only desktop?)
					}else{
						audioUp2Js.currentTime= percent * audioUp2Js.duration;
					}
				}
			}
		}
	}
	
	//************* seekbar tooltip
	
	if(useSeekbarTooltip && !isMobile){
		
		player_progress.on('mouseover', mouseOverHandlerSeek); 
		var player_progress_tooltip = componentWrapper.find('.player_progress_tooltip').css('zIndex',50);
		player_progress_tooltip.find('p').html('0:00' + seekTooltipSeparator + '0:00');
		
		//prevent mouse stuck over tooltip
		player_progress_tooltip.on('mouseenter', function(){
			player_progress.off('mouseover', mouseOverHandlerSeek); 
			player_progress_tooltip.css('display', 'none');
		}).on('mouseleave', function(){
			player_progress.on('mouseover', mouseOverHandlerSeek); 
		});
	}else{
		componentWrapper.find('.player_progress_tooltip').remove();
	}
	
	function mouseOverHandlerSeek() {
		if(!audioInited) return;
		player_progress_tooltip.css('display', 'block');
		player_progress.on('mousemove', mouseMoveHandlerSeekTooltip).on('mouseout', mouseOutHandlerSeek);
		_doc.on('mouseout', mouseOutHandlerSeek);
	}
	
	function mouseOutHandlerSeek() {
		if(!audioInited) return;
		player_progress_tooltip.css('display', 'none');
		player_progress.off('mousemove', mouseMoveHandlerSeekTooltip).off('mouseout', mouseOutHandlerSeek);
		_doc.off('mouseout', mouseOutHandlerSeek);
	}
	
	function mouseMoveHandlerSeekTooltip(e){
		
		if(!hap_circle){
				
			var s = e.pageX - progress_bg.offset().left;
			if(!isNumber(s))return false;
			if(s<0) s=0;
			else if(s>seekBarSize) s=seekBarSize;
			
			var center = parseInt(e.pageX - player_progress.offset().left - player_progress_tooltip.width() / 2,10);
			player_progress_tooltip.css('left', center + 'px');
			//console.log(center);
			
			var newPercent = Math.max(0, Math.min(1, s / seekBarSize));
	
		}else{
			if(canvasSupport){
				if(isCircleToggle(e)){
					player_progress_tooltip.css('display', 'none');
					return false;
				}else{
					var x1 = e.pageX - circlePlayer.offset().left,
						y1 = e.pageY - circlePlayer.offset().top,
						x = x1 - circleWidth/2,
						y = y1 - circleHeight/2,
						mAngle = Math.atan2(y, x);
					
					if (mAngle > -1 * Math.PI && mAngle < -0.5 * Math.PI) {
						mAngle = 2 * Math.PI + mAngle;
					}
					var newPercent = Math.max(0, Math.min((mAngle + Math.PI / 2) / 2 * Math.PI * 10))/100;
					//console.log(newPercent);
					
					player_progress_tooltip.css('display', 'block');
				}
			}else{}
		}
		if(!isNumber(newPercent))return false;
		tooltipToValue(newPercent);
	}
	
	function tooltipToValue(percent){
		if(!isNumber(percent))return false;
		var t,d;
		if(useHtml5Audio){
			if(audioUp2Js)d = audioUp2Js.duration, t=percent * d;
		}
		if(isNumber(t) && isNumber(d)){
			player_progress_tooltip.find('p').html(formatCurrentTime(t)+seekTooltipSeparator+formatDuration(d));
		}else{
			return false;	
		}
	}
	
	//************** end seekbar
	
	//************** start circle
		
	function drawSeekbar(percent){
		//console.log('drawSeekbar, percent = ', percent);
		//playing bar
		ctx.beginPath();      
		ctx.arc(circleWidth/2, circleHeight/2,circleRadius-strokeSize/2,-(quart),((circ) * percent) - quart,false);
		ctx.strokeStyle = play_color;
		ctx.lineCap = 'butt';
		ctx.lineWidth = strokeSize;
		ctx.stroke();
	}
	
	function drawLoadbar(percent){
		//loading bar
		ctx2.beginPath();      
		ctx2.arc(circleWidth/2, circleHeight/2,circleRadius-strokeSize/2,-(quart),((circ) * percent) - quart,false);
		ctx2.strokeStyle = load_color;
		ctx2.lineCap = 'butt';
		ctx2.lineWidth = strokeSize;
		ctx2.stroke();
	}
	
	function drawToggleBtn(){
		//console.log('draw Toggle Btn : ' , mediaPlaying);
		if(!mediaPlaying){//draw play
		
			var ax=65,
				ay=57,
				bx=65,
				by=102,
				
				dx=bx-ax,
				dy=by-ay,
				dangle = Math.atan2(dy, dx) - Math.PI / 3,
				sideDist = Math.sqrt(dx * dx + dy * dy),
				
				cx = Math.cos(dangle) * sideDist + ax,
				cy = Math.sin(dangle) * sideDist + ay;
			
			ctx.beginPath();  
			ctx.fillStyle = play_color;
			ctx.moveTo(ax,ay);  
			ctx.lineTo(bx,by);  
			ctx.lineTo(cx,cy);  
			ctx.fill(); 
		
		}else{//draw pause
		
			var ax=62,
				ay=57,
				width  = 14,
				height = 45,
				offset = 23;
			
			ctx.fillStyle = play_color;
			ctx.fillRect(ax, ay, width, height);
			ctx.fillRect(ax+offset, ay, width, height);//second one
			
		}
	}
	
	function isCircleToggle(e){
		var point;
		if(e.type == 'touchstart'){

			var touches;
			if(e.originalEvent.touches && e.originalEvent.touches.length) {
				touches = e.originalEvent.touches;
			}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
				touches = e.originalEvent.changedTouches;
			}else{
				return false;
			}
			// If touches more then one, so stop sliding and allow browser do default action
			if(touches.length > 1) {
				return false;
			}
			point = touches[0];	
		} else {
			point = e.originalEvent;
		}
		
		var x = point.pageX - circlePlayer.offset().left,
			y = point.pageY - circlePlayer.offset().top,
			centerX = circleWidth/2,
			centerY = circleHeight/2;
			toggleValue = Math.sqrt((x-centerX)*(x-centerX) + (y-centerY)*(y-centerY));

		return Math.sqrt((x-centerX)*(x-centerX) + (y-centerY)*(y-centerY)) < playBtnRadius;
	}
	
	//*************** end circle
	
	function checkScroll(move_scroll){
		//console.log('checkScroll');
		if(componentWrapper.find('.componentPlaylist').length==0)return;
		if(!scrollPaneApi){
			var componentPlaylist = componentWrapper.find('.componentPlaylist');//jsp fix
			scrollPaneApi = componentPlaylist.jScrollPane().data().jsp;
			componentPlaylist.on('jsp-initialised',function(event, isScrollable){
				//console.log('Handle jsp-initialised', this,'isScrollable=', isScrollable);
			}).jScrollPane({
				mouseWheelSpeed :20	
			});
			
			if(playlistScrollOrientation == 'horizontal'){
				if(!isMobile)componentPlaylist.on('mousewheel', horizontalMouseWheel);
			}
		}else{
			if(playlistScrollOrientation == 'vertical'){
				if(playlist_inner.outerHeight(true) >= playlistHolder.height()){
					scrollPaneApi.reinitialise();
					//console.log('scrollPaneApi.reinitialise');
					if(move_scroll){//not on window resize only on playlist reload!
						scrollPaneApi.scrollToY(0);
						$('.jspPane').css('top',0+'px');
					}
				}else{
					//console.log('scrollPaneApi.destroy');
					scrollPaneApi.destroy();
					scrollPaneApi=null;
				}
			}else{
				scrollPaneApi.reinitialise();
				//console.log('scrollPaneApi.reinitialise');
				if(move_scroll){//not on window resize only on playlist reload!
					scrollPaneApi.scrollToX(0);
					$('.jspPane').css('left',0+'px');
				}
			}
		}
		//console.log(playlist_inner.outerHeight(true), componentPlaylist.height(), playlistHolder.height());
	}
	
	function horizontalMouseWheel(event, delta, deltaX, deltaY){
		if(!componentInited || playlistTransitionOn) return false;
		var d = delta > 0 ? -1 : 1;//normalize
		if(scrollPaneApi) scrollPaneApi.scrollByX(d * 100);
		return false;
	}
	
	//************
	
	function initButtons(){
		
		var buttonArr=[componentWrapper.find('.controls_next'),
		componentWrapper.find('.controls_prev'),
		componentWrapper.find('.controls_toggle'),
		componentWrapper.find('.player_volume'),
		componentWrapper.find('.player_download'),
		componentWrapper.find('.player_loop'),
		componentWrapper.find('.player_shuffle')];

		var btn,len = buttonArr.length,i=0;
		for(i;i<len;i++){
			btn = $(buttonArr[i]).css('cursor', 'pointer').on('click', clickControls);
			if(useBtnRollovers && !isMobile){
				btn.on('mouseover', overControls).on('mouseout', outControls);
			}
		}
	}
	
	function togglePlayback(to_return){
		 if(mediaPlaying){
			if(useHtml5Audio){
				if(audioUp2Js)audioUp2Js.pause();
			}
			 mediaPlaying=false;
			 setPlayIcon('off');
		 }else{
			if(useHtml5Audio){
				if(audioUp2Js)audioUp2Js.play();	
			}
			 mediaPlaying=true;
			 setPauseIcon('off');
		 }
		 if(!to_return)return false;
	}
	
	function clickPlaylistItem(e){
		if(!componentInited || playlistTransitionOn) return false;
		e.preventDefault();
		
		var currentTarget = $(e.currentTarget), id = currentTarget.attr('data-id'), li = currentTarget.closest('.playlistItem');
		if(li.hasClass(locked_class))return false;

		autoPlay = true;
		
		enableActiveItem();
		playlistManager.processPlaylistRequest(id);
		
	}
	
	function clickControls(e){
		if(!componentInited || playlistTransitionOn) return false;
		e.preventDefault();
		var currentTarget = $(e.currentTarget), c=currentTarget.attr('class'), m = c.split(' ');
		
		if($.inArray('controls_prev', m) != -1){
			autoPlay = true;//
			enableActiveItem();
			playlistManager.advanceHandler(-1, true);
		}else if($.inArray('controls_toggle', m) != -1){
			if(!audioInited) return;
			togglePlayback();
		}else if($.inArray('controls_next', m) != -1){
			autoPlay = true;//
			enableActiveItem();
			playlistManager.advanceHandler(1, true);
		}else if($.inArray('player_volume', m) != -1){
			/*if(isIOS){
				if(useAlertMessaging) alert('Setting volume on ' + mobile_type + ' is not possible with javascript! Use physical buttons on your ' + mobile_type + ' to adjust volume.');
				return false;
			}*/
			if(!isMobile){
				toggleVolume();
				setVolume();
			}else{
				if(volume_seekbar_autoHide){
					toggleVolumeMobile();//if volume seekbar autohides, then on mobile we cant use player volume btn for mute/unmute volume, we need to use it to open volume seekbar on which we can then adjust volume (and set mute if necessary)
				}else{
					toggleVolume();
					setVolume();
				}	
			}
		}else if($.inArray('player_download', m) != -1){
			if(!hasDownloadSupport)globalDl();
		}else if($.inArray('player_loop', m) != -1){
			if(loopingOn){
				componentWrapper.find('.player_loop').find('img').attr('src', loopBtnUrl);
				loopingOn=false;
			}else{
				componentWrapper.find('.player_loop').find('img').attr('src', loopOnBtnUrl);
				loopingOn=true;
			}
			playlistManager.setLooping(loopingOn);
		}else if($.inArray('player_shuffle', m) != -1){
			if(randomPlay){
				componentWrapper.find('.player_shuffle').find('img').attr('src', shuffleBtnUrl);
				randomPlay=false;
			}else{
				componentWrapper.find('.player_shuffle').find('img').attr('src', shuffleOnBtnUrl);
				randomPlay=true;
			}
			playlistManager.setRandom(randomPlay);
		}
	}

	function overControls(e){
		if(!componentInited) return;
		
		e.preventDefault();
		
		var currentTarget = $(e.currentTarget),c=currentTarget.attr('class'), m = c.split(' ');//ie pie adds multiple classes!
	
		if($.inArray('controls_prev', m) != -1){
			componentWrapper.find('.controls_prev').find('img').attr('src', prevOnBtnUrl);
		}else if($.inArray('controls_toggle', m) != -1){
			if(mediaPlaying){
				setPauseIcon('on');	
			}else{
				setPlayIcon('on');
			}
		}else if($.inArray('controls_next', m) != -1){
			componentWrapper.find('.controls_next').find('img').attr('src', nextOnBtnUrl);
		}else if($.inArray('player_volume', m) != -1){
			if(_defaultVolume > 0){
				componentWrapper.find('.player_volume').find('img').attr('src', volumeOnBtnUrl);
			}else{
				componentWrapper.find('.player_volume').find('img').attr('src', muteOnBtnUrl);
			}
		}else if($.inArray('player_download', m) != -1){
			componentWrapper.find('.player_download').find('img').attr('src', dlOnBtnUrl);
		}else if($.inArray('player_loop', m) != -1){
			if(loopingOn){
				componentWrapper.find('.player_loop').find('img').attr('src', loopBtnUrl);
			}else{
				componentWrapper.find('.player_loop').find('img').attr('src', loopOnBtnUrl);
			}
		}else if($.inArray('player_shuffle', m) != -1){
			if(randomPlay){
				componentWrapper.find('.player_shuffle').find('img').attr('src', shuffleBtnUrl);
			}else{
				componentWrapper.find('.player_shuffle').find('img').attr('src', shuffleOnBtnUrl);
			}
		}
	}
	
	function outControls(e){
		if(!componentInited) return;
		
		e.preventDefault();
		
		var currentTarget = $(e.currentTarget),c=currentTarget.attr('class'), m = c.split(' ');//ie pie adds multiple classes!
		
		if($.inArray('controls_prev', m) != -1){
			componentWrapper.find('.controls_prev').find('img').attr('src', prevBtnUrl);
		}else if($.inArray('controls_toggle', m) != -1){
			if(mediaPlaying){
				setPauseIcon('off');
			}else{
				setPlayIcon('off');
			}
		}else if($.inArray('controls_next', m) != -1){
			componentWrapper.find('.controls_next').find('img').attr('src', nextBtnUrl);
		}else if($.inArray('player_volume', m) != -1){
			if(_defaultVolume > 0){
				componentWrapper.find('.player_volume').find('img').attr('src', volumeBtnUrl);
			}else{
				componentWrapper.find('.player_volume').find('img').attr('src', muteBtnUrl);
			}
		}else if($.inArray('player_download', m) != -1){
			componentWrapper.find('.player_download').find('img').attr('src', dlBtnUrl);	
		}else if($.inArray('player_loop', m) != -1){
			if(loopingOn){
				componentWrapper.find('.player_loop').find('img').attr('src', loopOnBtnUrl);
			}else{
				componentWrapper.find('.player_loop').find('img').attr('src', loopBtnUrl);
			}
		}else if($.inArray('player_shuffle', m) != -1){
			if(randomPlay){
				componentWrapper.find('.player_shuffle').find('img').attr('src', shuffleOnBtnUrl);
			}else{
				componentWrapper.find('.player_shuffle').find('img').attr('src', shuffleBtnUrl);
			}
		}
	}
	
	function enableActiveItem(){
		if(hidden_playlist) return;
		//console.log('enableActiveItem');
		if(playlistManager.getCounter()!=-1){
			var _item = $(aArr[playlistManager.getCounter()]);
			if(_item && _item.hasClass('playlistSelected')){
				var id = _item.attr('data-id');
				_item.removeClass('playlistSelected').addClass('playlistNonSelected');
				if(typeof playlistItemEnabled !== 'undefined')playlistItemEnabled(_self, sound_id, _item, id);//callback
			}
		}
	}
	
	function disableActiveItem(){
		if(hidden_playlist) return;
		//console.log('disableActiveItem');
		var _item = $(aArr[playlistManager.getCounter()]);
		if(_item && _item.hasClass('playlistNonSelected')){
			var id = _item.attr('data-id');
			_item.removeClass('playlistNonSelected').addClass('playlistSelected');
			if(typeof playlistItemDisabled !== 'undefined')playlistItemDisabled(_self, sound_id, _item, id);//callback
		}
	}
	
	function checkActiveItem() {
		//console.log('checkActiveItem');
		var ai = settings.activeItem;
		if(isNumber(ai) && ai != -1){
			if(ai<0)ai=0;
			else if(ai > _playlistLength-1)ai = _playlistLength-1;
			playlistManager.setCounter(ai, false);
		}else{
			autoPlay = true;//if no active item on start, we would need to click twice to start playback
		}
	}
	
	//******************
	
	function destroyAudio(){
		if(!lastPlaylist) return;
		if(playlistManager.getCounter() == -1) return;
		//console.log('destroyAudio');
		cleanAudio();
		resetData();
		enableActiveItem();
	}
	
	function destroyPlaylist(){
		//console.log('destroyPlaylist');
		cleanAudio();
		resetData();
		var i = 0, a;
		for(i;i<_playlistLength;i++){
			a = $(aArr[i]).off('click', clickPlaylistItem);
			if(usePlaylistRollovers && !isMobile)a.off('mouseenter').off('mouseleave');
		}
		if(lastPlaylist){
			lastPlaylist.children().each(function(){//clean wrap_multi players inside!
				var _item = $(this);
				//console.log(_item);	
				if(_item.data('hap_wrap_player')){
					//console.log(_item.data('hap_wrap_player'));	
					_item.data('hap_wrap_player').destroyPlaylist();
				}
			});
			lastPlaylist.empty();
			lastPlaylist = null;
		}
		playlist_inner.empty();
		
		_playlistLoaded=false;
		hidden_playlist = false;
		_currentInsert=null;
		_dlink = null;//reset
		global_download=null;
		addTrack_process=false;
		addHiddenTrack_process=false;
		playlist_first_init = false;
		activePlaylist=null;
		
		playlistManager.reSetCounter();
		
		playlistDataArr=[];
		aArr=[];
		liArr=[];
		
		if(scrollPaneApi)scrollPaneApi.reinitialise();//hide scrollbar
		
	}
	
	function cleanAudio(){
		//if(!_soundCreated)return;
		
		if(useHtml5Audio){
			if(dataIntervalID)clearInterval(dataIntervalID);
			if(audioUp2Js){
				audioUp2Js.pause();
				audioUp2Js.src = '';
			}
			if(hap_audio)hap_audio.off('ended pause play canplay canplaythrough loadedmetadata error');
		}
		
		resetData2();
		
		if(global_download){
			player_download.css('display','block');
		}else{
			player_download.css('display','none');
		};
		//reset
		lastSeekPercent = null;
		nullMetaData=false;
		mediaPlaying=false;
		audioInited=false;
		sound_started=false;
		if(!active_inline_song)active_song_link_url=undefined;
		//_soundCreated=false;
	}
	
	function setPlaylist(data){
		//console.log('setPlaylist', data);
		
		//get playlist data
		if(typeof(data) === 'undefined'){
			if(useAlertMessaging) alert('setPlaylist method requires data parameter. loadPlaylist failed.');
			return false;
		}
		if(typeof(data.hidden) === 'undefined'){
			if(useAlertMessaging) alert('setPlaylist method requires data.hidden parameter. loadPlaylist failed.');
			return false;
		}else{
			var hidden = checkBoolean(data.hidden);
		}
		if(typeof(data.id) === 'undefined'){
			if(useAlertMessaging) alert('setPlaylist method requires data.id parameter. loadPlaylist failed.');
			return false;
		}else{
			var id = data.id;
		}
		
		playlistTransitionOn=true;
		if(!preloaderInitShow){
			preloaderInitShow=true;	
			//playlistHolder.css('display','block');
		}
		showPreloader();
		playlist_inner.css('opacity',0);
		
		if(lastPlaylist){
			destroyPlaylist();
		}
		_playlistLoaded=false;
		
		hidden_playlist = hidden;//after destroyPlaylist!
		
		//get new playlist
		if(isPopup && isIE){
			var playlist = $(playlist_list.find(id).css('display','block').clone().wrap('<p>').parent().html());//used for popup in IE (HIERARCHY_REQUEST_ERROR)!! important!
			$(playlist_list.find(id).css('display','none'));
			
		}else{
			var playlist = playlist_list.find(id).css('display','block').clone();
			playlist_list.find(id).css('display','none');//hide after clone
		}
		
		playlist.css('fontSize',0);//remove vertical spacing (http://stackoverflow.com/questions/5256533/a-space-between-inline-block-list-items)
		
		if(playlist.length==0){
			if(useAlertMessaging) alert('Failed to select playlist! Make sure that element: "' + id + '" exist in playlist list! Quitting.');
			hidePreloader();
			return false;	
		}
		
		if(hidden_playlist){
			
			playlist_loader.empty();
			playlist.appendTo(playlist_loader);
			insert_position = 0;
			end_insert = true;
			addHiddenTrack_process=true;
			playlist_first_init = true;
			lastPlaylist = hidden_playlist_holder;
				
		}else{//visible playlist
			
			if(scrollPaneApi){
				//playlist.appendTo(scrollPaneApi.getContentPane());
				playlist.appendTo(playlist_inner);
			}else{
				if(playlist_inner.length==0){
					if(useAlertMessaging) alert('playlist_inner html element seems to be missing! You could be trying to use loadPlaylist method without having necessary html elements inside componentWrapper. Quitting.');
					return false;	
				}
				playlist.appendTo(playlist_inner);
			}
			lastPlaylist = playlist;
		}
		
		playlistDataArr=[];
		aArr=[];
		liArr=[];
		processPlaylistArr = [];
		
		playlist.find("li[class*='playlistItem']").each(function(){//wildcard (*) because of multiple classes
			processPlaylistArr.push($(this));
		});
		//console.log(processPlaylistArr.length);
		checkPlaylistProcess();
	}

	function checkPlaylistProcess() {
		//console.log('checkPlaylistProcess');
		if(processPlaylistArr.length){
			_processPlaylistItem();
		}else{
			//console.log('finished processing playlist');
			createNewPlaylist();
		}
	}
	
	function _processPlaylistItem(){
		
		_trackUrl = null;//reset
		_dlink = null;
		_download=null;
		default_artwork=null;
		default_content = null;
		isDraggable = false; 
		var _item = processPlaylistArr[0],
		data_type = _item.attr('data-type').toLowerCase(), 
		data_path = _item.attr('data-path'),
		isProcessed = _item.hasClass(processed_class);
		processPlaylistDataArr=[];
		if(_item.hasClass(draggable_class))isDraggable = true;
		//console.log(isDraggable);
		//console.log('_processPlaylistItem, data_type = ', data_type, ', isProcessed = ', isProcessed);
		
		if(_item.attr('data-plink') != undefined && !isEmpty(_item.attr('data-plink'))){
			_trackUrl = _item.attr('data-plink');
		}
		if(_item.attr('data-dlink') != undefined){
			if(!isEmpty(_item.attr('data-dlink'))){
				_dlink = _item.attr('data-dlink');
			}else{
				_dlink = true;
			}
		}
		if(_item.attr('data-download') != undefined){
			if(!isEmpty(_item.attr('data-download'))){
				_download = _item.attr('data-download');
			}else{
				_download = true;
			}
		}
		//console.log(_item, _download, _dlink);
		
		if(_item.attr('data-thumb') != undefined && !isEmpty(_item.attr('data-thumb')))default_artwork = _item.attr('data-thumb');
		//console.log(default_artwork);
		if(!isEmpty($.trim(_item.html()))) default_content = _item.html();
		
		if(isProcessed){
		
			_currentInsert=_item;	
			
			processPlaylistArr.shift();
			checkPlaylistProcess();
		
		}else if(data_type == 'local'){
			
			_currentInsert=_item;	
			
			processPlaylistArr.shift();
			checkPlaylistProcess();
			
		}else if(data_type == 'soundcloud') {
			
			_currentInsert=_item.data('toremove','true');
			
			sc_offset=0;//reset
			soundCloudTrackData(data_path);	
			
		}else if(data_type == 'podcast') {
			
			_currentInsert=_item.data('toremove','true');
				
			var url = proxy + '?url='+ encodeURIComponent(data_path);

			$.ajax({
				url: url,
				dataType: "json",
				cache: false
			}).done(function( d ) {

				if(!ieBelow9){

					hap_feedParser.html(d.contents);

					var tempArr =  hap_feedParser.get(0).getElementsByTagName('item');
					var i = 0, len = tempArr.length, entry, dur, obj, thumb;
					if(len > podcast_result_limit)len = podcast_result_limit;
					
					for(i; i < len; i++){
						entry = tempArr[i];
						
						if(entry.getElementsByTagName('enclosure')[0] != undefined){
						
							obj={};
							obj.type = 'podcast';
							obj.mp3 = entry.getElementsByTagName('enclosure')[0].getAttribute('url');
							//console.log(entry.getElementsByTagName('itunes:duration')[0]);
							if(entry.getElementsByTagName('itunes:duration')[0] != undefined){//fix for ios!
								dur = hmsToSecondsOnly(entry.getElementsByTagName('itunes:duration')[0].childNodes[0].nodeValue);
								obj.length = parseInt((dur*1000),10);//we want miliseconds
								//console.log(typeof(obj.length), obj.length);
							}
							//thumb
							if(entry.getElementsByTagName('media:thumbnail')[0] != undefined){
								if(entry.getElementsByTagName('media:thumbnail')[0].getAttribute('url') != undefined){
									obj.thumb = entry.getElementsByTagName('media:thumbnail')[0].getAttribute('url');
								}else if(default_artwork){
									obj.thumb = default_artwork;	
								}
							}else if(default_artwork){
								obj.thumb = default_artwork;	
							}
							obj.title = entry.getElementsByTagName('title')[0].childNodes[0].nodeValue;
							if(_trackUrl)obj.url = _trackUrl;
							if(_dlink)obj.dlink = _dlink;
							if(_download)obj.download = _download;
							//console.log(obj.url ,obj.title);
							processPlaylistDataArr.push(obj);
							
						}
					}

				}else{
					
					var dom = parseXML(d.contents), _item, obj, len = 0;
					$(dom).find("item").each(function(){

						if(len == podcast_result_limit)return false;

						_item=$(this);
						//console.log(_item.find('enclosure').attr('url'));
						//console.log(_item.find('title').text());
						
						obj={};
						obj.type = 'podcast';
						obj.mp3 = _item.find('enclosure').attr('url');
						obj.title = _item.find('title').text();
						//thumb
						//console.log(_item.find('media\\:thumbnail').attr('url'));
						if(_item.find('media\\:thumbnail').length>0){
							if(_item.find('media\\:thumbnail').attr('url')){
								obj.thumb = _item.find('media\\:thumbnail').attr('url');
							}else if(default_artwork){
								obj.thumb = default_artwork;	
							}
						}else if(default_artwork){
							obj.thumb = default_artwork;	
						}
						if(_trackUrl)obj.url = _trackUrl;
						if(_dlink)obj.dlink = _dlink;
						if(_download)obj.download = _download;
						processPlaylistDataArr.push(obj);

						len++;
					});
				}	

				createNodes();

			}).fail(function(jqXHR, textStatus, errorThrown) {
				if(useAlertMessaging) alert('Parse feed error: ' + jqXHR.responseText);
				if(useAlertMessaging) alert('Playlist process failed, podcast: ' + data_path);
				if(_currentInsert && _currentInsert.data('toremove')=='true')_currentInsert.remove();
				processPlaylistArr.shift();
				checkPlaylistProcess();
			}); 
			
		}else if(data_type == 'folder'){
			
			_currentInsert=_item.data('toremove','true');
			
			var url = hap_source_path + 'folder_parser.php', subdirs = true;
			if(_item.attr('data-subdirs') != undefined && _item.attr('data-subdirs') == 'false'){
				subdirs = false;
			}
			var data = {"dir": data_path, "subdirs": subdirs};
			
			$.ajax({
				type: 'GET',
				url: url,
				data: data,
				dataType: "json"
			}).done(function(media) {

				keysrt(media, 'title');
				//console.log(media);
				
				//console.log(media.length, media[0], media[1]);

				var i = 0, len = media.length, entry, obj;
				if(getTrackInfoFromID3)id3_counter=processPlaylistDataArr.length?processPlaylistDataArr.length-1:0;
				//console.log(id3_counter);
				//console.log(len);
				for(i; i < len; i++){
					entry = media[i];
					
					path = stripslashes(entry.path);
					//console.log(entry);
					obj={};
					obj.type = 'folder';
					
					if(/.mp3/.test(path)){
						
						obj.mp3 = path;
						
						//get title from mp3 path
						var no_ext = path.substr(0, path.lastIndexOf('.'));
						if (/\//i.test(no_ext)) {
							title = no_ext.substr(no_ext.lastIndexOf('/')+1);
						}else{
							title = no_ext;
						}
						title = title.split("_").join(" ");//remove underscores from title 
						//console.log('title = ', title);
						
						obj.title = title;
						obj.thumb = path.substr(0, path.lastIndexOf('.')) + '.jpg';//asssume thumb file exist with the same name! 
						
						obj.size = parseInt(entry.size,10);// size in bytes 
						obj.lastmod = parseInt(entry.lastmod,10);//Unix timestamp
						
						if(_trackUrl)obj.url = _trackUrl;
						if(_dlink)obj.dlink = _dlink;
						if(_download)obj.download = _download;
						if(default_artwork)obj.thumb = default_artwork;	
						
						processPlaylistDataArr.push(obj);
					
					}
				}
				//check id3 tags
				if(processPlaylistDataArr.length && getTrackInfoFromID3){
					getId3();
				}else{
					createNodes();
				}
		  
		    }).fail(function(jqXHR, textStatus, errorThrown) {
				//alert('Folder process error: ' + jqXHR.responseText);
				if(useAlertMessaging) alert("Read folder error! Make sure you run this online or on local server!"); 
				if(useAlertMessaging) alert('Playlist process failed, folder: ' + data_path);
				if(_currentInsert && _currentInsert.data('toremove')=='true')_currentInsert.remove();
				processPlaylistArr.shift();
				checkPlaylistProcess();
			});
		  
		}else if(data_type == 'xml'){
				
			_currentInsert=_item;
				
			var url = hap_source_path + data_path, str, ul, li, a, obj, tarr=[];
			//console.log(hap_source_path + data_path);
			$.ajax({
				type: "GET",
				url: url,
				dataType: "html",
				cache: false
			}).done(function(result) {

				processPlaylistArr.shift();//before!
				
				$(result).find("li[class='playlistItem']").each(function(){
					li = createTrackFromHtml($(this));
					
					if(_currentInsert){
						_currentInsert.after($(li));
					}else{
						if(lastPlaylist.children().length>0){
							$(li).prependTo(lastPlaylist);
						}else{
							$(li).appendTo(lastPlaylist);
						}
					}
					_currentInsert=$(li);
					
					tarr.push($(li));
					
				});
				
				//restore order
				var i = 0, len = tarr.length;
				tarr.reverse();
				for(i;i<len;i++){
					processPlaylistArr.unshift(tarr[i]);
				}
				tarr=null;
				
				_item.remove();//remove original li item that holds the data for creating playlist	
				
				checkPlaylistProcess();
					
			}).fail(function(jqXHR, textStatus, errorThrown) {
				//alert('XML process error: ' + jqXHR.responseText);
				if(useAlertMessaging) alert('Playlist process failed, xml: ' + data_path);
				if(_currentInsert)_currentInsert.remove();
				processPlaylistArr.shift();
				checkPlaylistProcess();
			});
			
		}else if(data_type == 'database_data' || data_type == 'database_html'){
			
			if(_item.attr('data-table') == undefined || isEmpty(_item.attr('data-table'))){
				 if(useAlertMessaging){
					 alert('Database table missing!');
					 alert('Playlist process failed, database query: ' + data_path);
				 }
				 processPlaylistArr.shift();
				 checkPlaylistProcess();
				 return;
			}
			
			var limit = null, range_from = null, range_to = null;
			if(_item.attr('data-limit') != undefined && !isEmpty(_item.attr('data-limit'))){
				limit = parseInt(_item.attr('data-limit'),10);
			}
			if(_item.attr('data-range') != undefined && !isEmpty(_item.attr('data-range'))){
				var range = _item.attr('data-range').split(',');
				if(range.length == 2){
					range_from = range[0];
					range_to = range[1];
				}
			}
			
			_currentInsert=_item;
				
			var url = hap_source_path + 'includes/database.php', str, ul, li, a, obj, tarr=[],
			
			data = {db_name: data_path, 
					db_table: _item.attr('data-table'),
					db_type: data_type,
					limit: limit,
					range_from: range_from,
					range_to: range_to};
			//console.log(url);
			
			$.ajax({  
			  type: "POST",  
			  url: url,  
			  data: data 
			  }).done(function(result){  
				  //console.log('result = ', result);
				
				  if(result.indexOf("Database information missing!")>-1 || result.indexOf("Db connection failed")>-1 || result.indexOf("Db selection failed")>-1 || result.indexOf("Db query failed")>-1){
					 if(useAlertMessaging){
						 alert(result);
						 alert('Playlist process failed, database query: ' + data_path);
					 } 
					 if(_currentInsert)_currentInsert.remove();
					 processPlaylistArr.shift();
					 checkPlaylistProcess();
					 return;
				  }
				  
				  processPlaylistArr.shift();//before!
				  
				  var json = $.parseJSON(result), i = 0, len = json.length, src, obj;
				  //console.log(len);
				  for(i;i<len;i++){
					
					src = json[i];
					//console.log(src);
					
					if(data_type == 'database_data'){
						if(src.type && src.mp3 || src.path){//required data!
							li = createTrackFromData(src);
						}else{
							continue;
						}
					}else{
						if(src.path){//required data!
							li = createTrackFromHtml(src.path);
						}else{
							continue;
						}
					}
					
					if(_currentInsert){
						_currentInsert.after($(li));
					}else{
						if(lastPlaylist.children().length>0){
							$(li).prependTo(lastPlaylist);
						}else{
							$(li).appendTo(lastPlaylist);
						}
					}
					_currentInsert=$(li);
					
					tarr.push($(li));
					
				}
				
				//restore order
				var i = 0, len = tarr.length;
				tarr.reverse();
				for(i;i<len;i++){
					processPlaylistArr.unshift(tarr[i]);
				}
				tarr=null;
				
				_item.remove();//remove original li item that holds the data for creating playlist	
				
				checkPlaylistProcess();
				
			}).fail(function(jqXHR, textStatus, errorThrown) {
				if(useAlertMessaging) alert('Playlist process failed, database query: ' + data_path);
				if(_currentInsert)_currentInsert.remove();
				processPlaylistArr.shift();
				checkPlaylistProcess();
			});			
			
		}else{
			if(useAlertMessaging) alert('Invalid playlist data-type attribute!');
			processPlaylistArr.shift();
			checkPlaylistProcess();
			return;	
		}
	}

	function createNodes(){
		//console.log('createNodes');
		if(processPlaylistDataArr.length){
			var li, a, i=0, len = processPlaylistDataArr.length, data, mp3_download;
			
			for(i;i<len;i++){
				data = processPlaylistDataArr[i];
				
				li = $('<li class="playlistItem" data-type="'+data.type+'"data-mp3="'+data.mp3+'" data-thumb="'+data.thumb+'"></li>');
				
				mp3_download=data.mp3;
				if(!(/\.(mp3)$/i).test(data.mp3)) mp3_download+='.mp3';
				
				if(isDraggable)li.addClass(draggable_class);
				
				if(data.url)li.attr('data-plink',data.url);
				if(data.dlink){
					if(data.dlink != true && data.dlink != 'true'){
						li.attr('data-dlink',data.dlink);//custom dlink
					}else{
						li.attr('data-dlink',mp3_download);//use mp3 tag
					}	
				}
				if(data.download){
					if(data.download != true && data.download != 'true'){
						li.attr('data-download',data.download);	//custom dlink
					}else{
						li.attr('data-download',mp3_download);//use mp3 tag
					}
				}
				
				if(data.title)li.attr('data-title',data.title);
				if(data.thumb){
					if(data.thumb.substr(0,2)=='//')data.thumb = 'http:' + data.thumb;//ofm fix
					li.attr('data-thumb',data.thumb);
				}
				if(data.length)li.attr('data-length',data.length);//ios fix
				
				if(playlistItemContent == 'title'){//title
					a = $('<a class="playlistNonSelected" href="#">'+data.title+'</a>').appendTo(li);
					
				}else if(playlistItemContent == 'thumb'){//thumbs
					a = $('<a class="playlistNonSelected" href="#"><img src="'+data.thumb+'" alt="thumb"/></a>').appendTo(li);
					
				}else if(playlistItemContent == 'all'){
					a = $('<a class="playlistNonSelected" href="#"></a>').appendTo(li);
					$('<span class="hap_thumb"><img src="'+data.thumb+'" alt="thumb"/></span>').appendTo(a);
					$('<span class="hap_title"><p>'+data.title+'</p></span>').appendTo(a);
				}
				
				if(default_content){//icon order is: purchase, download, remove track
					a.after(default_content);
				}
			
				if(!_currentInsert){
					li.appendTo(lastPlaylist);
				}else{
					_currentInsert.after(li);
					if(_currentInsert.data('toremove')=='true')_currentInsert.remove();
				}
				_currentInsert=li;
			}
		}
		processPlaylistArr.shift();
		checkPlaylistProcess();
	}
	
	function createNewPlaylist(){
		//console.log('createNewPlaylist');
		
		if(addTrack_process || addHiddenTrack_process){
			
			var counter_add=0;//count how many items in playlist we are going to add (for playlist manager)
			_currentInsert = null;
			
			var li;
			playlist_loader.find("li[class*='playlistItem']").each(function(){
				li = $(this);
				
				if(!_currentInsert){
					if(end_insert){
						li.appendTo(lastPlaylist);
					}else{
						lastPlaylist.children().eq(insert_position).before(li);
					}
				}else{
					_currentInsert.after(li);
				}
				_currentInsert=li;
				counter_add++;
			});
			playlist_loader.empty();
		}
		
		getPlaylist();
		
		playlist_inner.css('opacity',1);
		
		if(!componentInited){
			setupDone();
		}

		_currentInsert=null;
		default_content = null;
		playlistTransitionOn = false;
		hidePreloader();
		
		//console.log(_playlistLength);
		
		if(_playlistLength>0){
			if(!addTrack_process && !addHiddenTrack_process){
				playlistManager.setPlaylistItems(_playlistLength);
				checkActiveItem();	
			}else{
				var current_counter = playlistManager.getCounter();
				playlistManager.setPlaylistItems(_playlistLength, false);
				//console.log(insert_position, current_counter, end_insert, counter_add);
				if(insert_position <= current_counter){
					if(!end_insert)	playlistManager.reSetCounter(current_counter+counter_add);
				}
				if(playlist_first_init){
					playlist_first_init=false;	
					checkActiveItem();	
				}
				
			}
			if(autoSetSongTitle)setMediaTitle();
		}
		
		addTrack_process=false;
		addHiddenTrack_process=false;
		
		if(_playlistLength == 0){
			//if(useAlertMessaging) alert('Processing playlist end message: Empty playlist! sound_id = ' + sound_id);
			if(typeof playlistEmpty !== 'undefined')playlistEmpty(_self, sound_id);//callback
		}
		
		if(typeof audioPlayerPlaylistLoaded !== 'undefined')audioPlayerPlaylistLoaded(_self, sound_id);//callback
		_playlistLoaded= true;
		
	}
	
	function getPlaylist(){
		//console.log('getPlaylist' , hidden_playlist);
		
		playlistDataArr=[];
		liArr = [];
		aArr=[];
		
		if(lastPlaylist.length==0){
			if(useAlertMessaging) alert('lastPlaylist html element seems to be missing! You could be trying to use addTrack method without having necessary html elements inside componentWrapper. Quitting.');
			return false;
		}
		
		var i=0, a, li, tempArr=lastPlaylist.find('li'), len = tempArr.length, title, counter_title, type, origtype, length, mp3, length, download, dlink, plink, thumb;
		_thumbInnerContainerSize=0;//reset
		
		for(i;i<len;i++){
				
			li = $(tempArr[i]).addClass(processed_class);
			liArr.push(li);
			//console.log(li);
			if(_playlistLocked)	li.addClass(locked_class);	
			
			if(playlistScrollOrientation == 'horizontal'){
				_thumbInnerContainerSize+=li.outerWidth(true);
			}else{
				_thumbInnerContainerSize+=li.outerHeight(true);
			}
			
			a = li.find('a[class=playlistNonSelected]');
			if(a.length==0)a = li.find('a[class=playlistSelected]');
			a.off().on('click', clickPlaylistItem).attr('data-id', i);
			aArr.push(a);
			
			if(usePlaylistRollovers && !isMobile){
				a.on('mouseenter', function(e){
					if(!componentInited || playlistTransitionOn) return false;

					if (!e) var e = window.event;
					if(e.cancelBubble) e.cancelBubble = true;
					else if (e.stopPropagation) e.stopPropagation();
					
					var currentTarget = $(e.currentTarget), id = currentTarget.attr('data-id');
					//console.log('id = ', id);
					
					var _item = $(aArr[id]), c = playlistManager.getCounter(), active = false;
					if(c == id)active = true;//active item
					
					if(typeof playlistItemRollover !== 'undefined')playlistItemRollover(_self, sound_id, _item, id, active);//callback
					
					return false;	
				}).on('mouseleave', function(e){
					if(!componentInited || playlistTransitionOn) return false;

					if (!e) var e = window.event;
					if(e.cancelBubble) e.cancelBubble = true;
					else if (e.stopPropagation) e.stopPropagation();
					
					var currentTarget = $(e.currentTarget), id = currentTarget.attr('data-id');
					//console.log('id = ', id);
					
					var _item = $(aArr[id]), c = playlistManager.getCounter(), active = false;
					if(c == id)active = true;//active item
					
					if(typeof playlistItemRollout !== 'undefined')playlistItemRollout(_self, sound_id, _item, id, active);//callback
					return false;	
				});
			}
			
			title = '';
			if(li.attr('data-title') != undefined){
				title = li.attr('data-title');
			}else{
				if(playlistItemContent == 'title'){//title
					title = a.html();
				}else if(playlistItemContent == 'thumb'){//thumbs
					//title = a.find('img');
				}else if(playlistItemContent == 'all'){
					title = a.find('span[class=hap_title]').find('p').html();
				}
			}
			
			if(useNumbersInPlaylist){
				counter_title = stringCounter(i) + titleSeparator + title;
				a.html(counter_title);
			}
			
			li = $(liArr[i]).attr({
				'data-id': i,
				'data-title': title
			});
			
			mp3='', type='', origtype='', length=undefined, download=null, dlink=null, plink=null, thumb = null;
			
			if(li.attr('data-mp3') != undefined){
				mp3 = li.attr('data-mp3');
			}
			if(li.attr('data-type') != undefined){
				type = li.attr('data-type');
			}
			if(li.attr('data-origtype') != undefined){
				origtype = li.attr('data-origtype');
			}
			if(li.attr('data-length') != undefined && !isEmpty(li.attr('data-length'))){
				length = li.attr('data-length');
			}
			//download link
			
			if(li.attr('data-download') != undefined){
				if(!isEmpty(li.attr('data-download')) && li.attr('data-download') != 'true'){
					dlink = download = li.attr('data-download');//will use custom link for download
				}else{
					dlink = download = mp3;//will use mp3 link for download
				}
			}
			if(li.attr('data-dlink') != undefined){
				if(!isEmpty(li.attr('data-dlink')) && li.attr('data-dlink') != 'true'){
					dlink = li.attr('data-dlink');//will use custom link for download
				}else{
					dlink = mp3;//will use mp3 link for download
				} 
			}
			
			//purchase link
			if(li.attr('data-plink') != undefined && !isEmpty(li.attr('data-plink'))){
				plink = li.attr('data-plink');
			}
			if(li.attr('data-thumb') != undefined && !isEmpty(li.attr('data-thumb'))){
				thumb = li.attr('data-thumb');
			}
			
			if(!hidden_playlist){
				//icon order is: purchase, download, remove track
				
				if(plink){
					//create plink icons
					if(li.find('a[class=plink]').length==0){//if not exist (is overwritten by inner)
						var p = $('<a class="plink" href="'+plink+'" target="_blank"><img src="'+trackUrlIcon+'" alt="purchase"/></a>');
						a.after(p);
					}
				}
				
				if(dlink){

					if(hasDownloadSupport){
						if(li.find('a[class=dlink]').length==0){
							var d = $('<a class="dlink" href="'+dlink+'" download><img src="'+trackDownloadIcon+'" alt="download"/></a>');
							a.after(d);
						}
					}else{

						//create dlink icons
						if(li.find('a[class=dlink]').length==0){//if not exist (is overwritten by inner)
							var d = $('<a class="dlink" href="#" data-dlink="'+dlink+'"><img src="'+trackDownloadIcon+'" alt="download"/></a>');
							a.after(d);
							if(isEmpty(li.attr('data-dlink'))){
								//li.attr('data-dlink', dlink);
							}
						} 

					}
				}
				if(useRemoveBtnInTracks){
					//create remove icons
					if(li.find('a[class=premove]').length==0){//if not exist
						var r = $('<a class="premove" href="#"><img src="'+trackRemoveIcon+'" alt="remove"/></a>');
						a.after(r);
					}
				}
				
			}	
			
			playlistDataArr.push({'id': i, 'type': type, 'origtype':origtype, 'title': title, 'mp3': mp3, 'length': length, 'download': download, 'thumb': thumb});
			
		}
		
		tempArr=null;
		
		_playlistLength = playlistDataArr.length;
		
		//console.log('playlistDataArr= ',playlistDataArr);
		//console.log(aArr);
		//console.log(liArr);
		//console.log('_playlistLength = ', _playlistLength);
		
		//if(_playlistLength==0)return false;
		
		if(!hidden_playlist){
		
			//after we place items in playlist!!
			checkTracks();
			
			if(sortablePlaylistItems && playlistHolder.length){
				if(!lastPlaylist.hasClass('ui-sortable')){
					//console.log('ui-sortable');
					//lastPlaylist.sortable('destroy');
					
					/*
					http://stackoverflow.com/questions/2451528/jquery-ui-sortable-scroll-helper-element-offset-firefox-issue
					http://forum.jquery.com/topic/sortable-offset-when-element-is-dragged-and-page-scrolled-down-ff
					*/
					//var userAgent = navigator.userAgent.toLowerCase();
					//if(userAgent.match(/firefox/)) {
					lastPlaylist.on( "sortstart", function (event, ui) {
						ui.helper.css('margin-top', _window.scrollTop() );
					});
					lastPlaylist.on( "sortbeforestop", function (event, ui) {
						ui.helper.css('margin-top', 0 );
					});
					
					lastPlaylist.sortable({ 
						cursor: "move",
						update: function(event, ui) {
							
							getPlaylist();
							
							if(_playlistLength>0)playlistManager.setPlaylistItems(_playlistLength);
							
							//update playlist counter
							var current_counter = playlist_inner.find('a[class=playlistSelected]').attr('data-id');
							//console.log(current_counter);
							if(current_counter){
								playlistManager.reSetCounter(current_counter);
								if(autoSetSongTitle)setMediaTitle();
							}
							
							if(_playlistLength==1)checkActiveItem();//? on drag into the playlist we want first item auto selected
						},
						receive: function (event, ui) {      
							if(typeof dropReceive !== 'undefined')dropReceive(_self, sound_id);//callback
						}
					});
				}
			}
			
			if(activatePlaylistScroll){
				//console.log(_thumbInnerContainerSize);
				if(playlistScrollOrientation=='horizontal')playlist_inner.width(_thumbInnerContainerSize);
				checkScroll(true);
			}
		}
		return true;
	}
	
	function setupDone(){
		componentInited=true;
		playlistTransitionOn=false;
		hidePreloader();
		setTimeout(function(){_doneResizing();getVolumeSize();setVolume();}, 100);
		if(typeof audioPlayerSetupDone !== 'undefined')audioPlayerSetupDone(_self, sound_id);//callback
	}
	
	//******** start download/mail

	/*
	Global download downloads current active song
	Individual download downloads individual (requested) song from playlist
	*/

	function globalDl(){
		//global download wont be available if audio not inited (button appears on COUNTER_READY)
		if(_downloadOn)return false;
		var type = media_type;
		//console.log(type);
		
		if(!media_type){
			if(useAlertMessaging) alert("Invalid data-type for file download function! Quitting."); 
			_downloadOn = false;
			return false;	
		}
		var c = playlistManager.getCounter(), path = playlistDataArr[c].download, name = getTitle(c, false);
		var dwn = getDownloadPath(type, name, path);
		//console.log(dwn.name, dwn.path);
		//return;
		checkDownload(dwn.name, dwn.path);	
	}

	//check tracks for download and for remove icons
	function checkTracks(){
		var evt = hasTouch ? _downEvent : 'click';

		if(hasDownloadSupport){

			componentWrapper.find('a[class=dlink]').each(function(e){
				var t = $(this);
				t.attr('href', t.attr('data-dlink')).attr('download','');
			});

		}else{

			componentWrapper.find('a[class=dlink]').off().on(evt,function(e){
				e.preventDefault();
				if(_downloadOn)return false;
				var a = $(this), li = a.closest('.playlistItem'), type, id = li.attr('data-id');
				if(li.hasClass(locked_class))return false;
				
				if(li.attr('data-type') != undefined && !isEmpty(li.attr('data-type'))){
					type = li.attr('data-type');
					if(li.attr('data-origtype') != undefined && !isEmpty(li.attr('data-origtype'))){
						type = li.attr('data-origtype');
					}
				}else{
					if(useAlertMessaging) alert("Invalid data-type for file download function! Quitting."); 
					_downloadOn = false;
					return false;	
				}
				//console.log(a.attr('data-dlink'));
				
				if(a.attr('data-dlink') != undefined && !isEmpty(a.attr('data-dlink'))){
					var path = a.attr('data-dlink'), name = getTitle(id, false);
					var dwn = getDownloadPath(type, name, path);
					//console.log(dwn.name, dwn.path);
					//return;
					checkDownload(dwn.name, dwn.path);	
				}
			});	

		}
		
		componentWrapper.find('a[class=plink]').off().on('click',function(e){
			var a = $(this), li = a.closest('.playlistItem');
			if(li.hasClass(locked_class))return false;
		});	
		
		if(useRemoveBtnInTracks){
			//remove playlist items
			componentWrapper.find('a[class=premove]').off().on('click',function(e){
				e.preventDefault();
				var a = $(this), li = a.closest('.playlistItem'), id = parseInt(li.attr('data-id'),10);
				if(li.hasClass(locked_class))return false;
				_self.removeTrack(id);
			});
		}
	}
	
	function getDownloadPath(type, name, path){
		if(type == 'local' || type == 'folder'){
			if(path.indexOf('\\')){//replace backward slashes
				path = path.replace(/\\/g,"/");
			}
			//construct full download path for local videos
			if(!path.match(/^http([s]?):\/\/.*/)){
				//console.log(window.location);
				var main_path = window.location.href;
				main_path = main_path.substr(0, main_path.lastIndexOf('/')+1);
				if((/^\.\.\//i).test(path)){//replace ../ for one level up since we have media files one level up from root
					path = path.substr(3);//remove ../
					if(main_path.charAt(main_path.length-1)=='/')main_path = main_path.substr(0,main_path.lastIndexOf('/'));//remove last slash
					main_path = main_path.substr(0,main_path.lastIndexOf('/')+1);//remove current directory
				}	
				path = main_path + path;
			}
			if(!isMobile){
				if (path.lastIndexOf('/')>0) {	
					name = path.substr(path.lastIndexOf('/')+1);
				}else{
					name = path;
				}	
			}
		}else if(type == 'soundcloud'){//correct download path for soundcloud (not the same as mp3 url!)
			path = path.replace(/\/stream\\?/, "/download").replace(/\.mp3/, "");//remove mp3 extension as well!
		}
		name = name.replace(/[^A-Z0-9\-\_\.]+/ig, "_");//remove spaces and spec chars
		if(!(/\.(mp3)$/i).test(name)) name+='.mp3';//append extension
		return {name:name, path:path};
	}
	
	function checkDownload(name, path){
		if(!isMobile){
			dl_iframe.attr('src',hap_source_path+"dl.php?path="+path+"&name="+name);
		}else{
			_downloadOn = true;
			if(autoReuseMailForDownload){
				if(!mailSet){
					dl_mail = getMail();
					if(dl_mail)mailSet = true;
				}
				if(dl_mail){
					sendMail(dl_mail, name, path);
				}else{
					_downloadOn = false;	
				}
			}else{
				var email = getMail();
				if(email){
					sendMail(email, name, path);
				}else{
					//console.log('no mail');
					_downloadOn = false;	
				}
			}
		}
	}
	
	function sendMail(mail, name, path){//send mail on ios
		//console.log('sendMail');
		var data = "mail=" + mail + "&name=" + name + "&path=" + path;
		//console.log(data);
		$.ajax({
			type: "POST",
			url: hap_source_path+"mail.php",
			data: data
		}).done(function(msg) {
			//console.log('Send mail success: ' + msg);
			_downloadOn = false;	
		}).fail(function(jqXHR, textStatus, errorThrown) {
			//console.log('Send email error: ' + jqXHR.responseText);
			if(useAlertMessaging) alert('Send email error: ' + jqXHR.responseText);
			hideDownConf();
			_downloadOn = false;
		});	
		download_confirm.css({marginTop:-download_confirm.height()/2+'px',display:'block'}).stop().animate({'opacity': 1},{duration: 500});
		if(downConf_timeoutID) clearTimeout(downConf_timeoutID);
		downConf_timeoutID = setTimeout(hideDownConf, downConf_timeout);
	}
	
	function hideDownConf(){
		if(downConf_timeoutID) clearTimeout(downConf_timeoutID);
		download_confirm.stop().animate({'opacity': 0},  {duration: 500, complete: function(){
			download_confirm.css('display','none');	
		}});
	}
	
	function getMail(){
		var email = prompt("Please enter your email address where download link will be sent:");
		//validate email
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		while(!emailReg.test(email) || isEmpty(email)){
			if(email == null){
				break;
			}
			email = prompt("Please enter a valid email address:");
		}
		return email;
	}
	
	//******** end mail
	
	//******************* start playable links
	
	function checkPlayableLinks(){
		 
		$('.hap_text_link').each(function(){
			//console.log($(this).attr('href'));
			var a = $(this), attr = a.attr('href');
			if(typeof attr !== 'undefined' && attr !== false){
				if(attr.toLowerCase().indexOf('.mp3')>-1){
					a.prepend('<img class="play_link" src="'+link_play+'"/>');
				}
			}
		});
		//hap_image_link
		$('.hap_text_link, .hap_image_link').click(function(e){
			if(!componentInited) return false;
			if(playlistTransitionOn) return false;
			
			var a = $(this), attr = a.attr('href');
			if(typeof attr === 'undefined' || attr === false) return false;
			
			//console.log(active_song_link_url, attr);
			if(active_song_link_url && active_song_link_url == attr){//click on already active link
				return togglePlayback();
				
			}else{
				//enable active item, if exist, but dont dispose current playlist, if exist (optional)
				enableActiveItem();
				playlistManager.reSetCounter();
			
				active_song_link_url = attr;
				active_hap_inline = a;
				active_inline_song=true;
				
				if(active_text_link) active_text_link.attr('src', link_play);
				if(a.hasClass('hap_text_link')) active_text_link = a.find('img').attr('src', link_pause);
					
				mp3 = active_song_link_url;
				
				autoPlay=true;
		
				findMedia();
				active_inline_song = false;//after clean media
			
				return false;
			
			}
		});
	}
	
	//******************* end playable links
	
	
	//************* start soundcloud
	
	function soundCloudTrackData(linkUrl) {
		if(isEmpty(soundcloudApiKey)){
			alert('soundcloudApiKey has not been set! Skipping Soundcloud url.');
			processPlaylistArr.shift();
			checkPlaylistProcess();
			return false;	
		}
		if(/\/favorites$/.test(linkUrl)){	
			linkUrl = linkUrl.replace(/\/favorites$/, "/likes");
		}
		
		var url = soundCloudApiUrl(linkUrl, soundcloudApiKey);
		
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false
		}).done(function( data ) {
			//console.log(data);
			//console.log('data loaded');
			var obj, len, i, track;
			if(data.tracks) {
				//console.log(data);
				//console.log('data.tracks.length = ', data.tracks.length)
				len = data.tracks.length;
				if(len>soundcloud_result_limit)len=soundcloud_result_limit;
				for(i=0; i < len; i++) {
					if(data.tracks[i].streamable && data.tracks[i].stream_url){
						processPlaylistDataArr.push(getScTrack(data.tracks[i]));
					}else{
						len+=1;
						if(len > data.tracks.length)len = data.tracks.length;
						continue;
					}
				}
				//according to testing this returns all results not in the limit of 50 like DATA.ISARRAY
				if(processPlaylistDataArr.length > soundcloud_result_limit)processPlaylistDataArr = processPlaylistDataArr.slice(0, soundcloud_result_limit);
				createNodes();
					 
			}else if(data.duration) {
				//console.log(data);
				//a secret link fix, till the SC API returns permalink with secret on secret response
				data.permalink_url = linkUrl;
				
				if(data.streamable && data.stream_url){
					processPlaylistDataArr.push(getScTrack(data));
				}
				if(processPlaylistDataArr.length > soundcloud_result_limit)processPlaylistDataArr = processPlaylistDataArr.slice(0, soundcloud_result_limit);
				createNodes();
				
			}else if(data.username) {
				// if user, get his tracks or favorites
				if(/likes/.test(linkUrl)) {
					console.log('DATA.USERNAME.LIKES');
					sc_uri = data.uri + '/likes';
					soundCloudTrackData(sc_uri);
				}else if(/favorites/.test(linkUrl)) {
					sc_uri = data.uri + '/favorites';
					soundCloudTrackData(sc_uri);
				}else{
					//console.log('DATA.USERNAME.TRACKS');
					sc_uri = data.uri + '/tracks';
					soundCloudTrackData(sc_uri);
				}
			}else if($.isArray(data)) {
				len = data.length;
				//console.log(data);
				if(len>soundcloud_result_limit)len=soundcloud_result_limit;
				for(i=0; i < len; i++) {
					if(data[i].streamable && data[i].stream_url){
						processPlaylistDataArr.push(getScTrack(data[i]));
					}else{
						len+=1;
						if(len > data.length)len = data.length;
						continue;	
					}
				}
				if(len == sc_limit){
					sc_offset+=sc_limit;
					if(sc_offset<soundcloud_result_limit){
						soundCloudTrackData(sc_uri);
					}else{
						if(processPlaylistDataArr.length > soundcloud_result_limit)processPlaylistDataArr = processPlaylistDataArr.slice(0, soundcloud_result_limit);
						createNodes();
					}
				}else{
					if(processPlaylistDataArr.length > soundcloud_result_limit)processPlaylistDataArr = processPlaylistDataArr.slice(0, soundcloud_result_limit);
					createNodes();
				}
			}else if(data.kind && data.kind == 'group'){//groups
				//console.log(data.uri);	
				sc_uri = data.uri + '/tracks';
				soundCloudTrackData(sc_uri);
			}else{
				//console.log('soundcloud unknown?');
				processPlaylistArr.shift();
				checkPlaylistProcess();	
			}
		
		}).fail(function(jqXHR, textStatus, errorThrown) {
			//alert('Soundcloud process error: ' + jqXHR.responseText);
			if(useAlertMessaging) alert('Playlist process failed, soundcloud: ' + linkUrl);
			processPlaylistArr.shift();
			checkPlaylistProcess();
		});
	};
	
	function getScTrack(track){
		
		var obj={};
		
		//console.log(track.artwork_url);
		//console.log(track.stream_url + (/\?/.test(track.stream_url) ? '&' : '?') + 'consumer_key=' + soundcloudApiKey);
		//console.log(track.title);
		
		obj.type = 'soundcloud';
		if(track.duration){
			//console.log(track.duration);
			obj.length = track.duration;
		}
		obj.mp3 = track.stream_url + (/\?/.test(track.stream_url) ? '&' : '?') + 'consumer_key=' + soundcloudApiKey;
		obj.title = track.title;
		if(_trackUrl)obj.url = _trackUrl;
		if(track.downloadable && track.download_url){
			if(_dlink)obj.dlink = _dlink;
			if(_download)obj.download = _download;
		}else{
			//if we added custom links for download! (special case on soundcloud because even if we add 'true' on download, track 'downloadable' property can be false, so we can only use custom download in this case)
			if(_dlink && _dlink != true)if(_dlink != 'true')obj.dlink = _dlink;
			if(_download && _download != true)if(_download != 'true')obj.download = _download;
		}
		if(track.artwork_url){
			obj.thumb = track.artwork_url;
		}else if(default_artwork){
			obj.thumb=default_artwork; 
		}
		return obj;
	}
	
	// convert a SoundCloud resource URL to an API URL
	function soundCloudApiUrl(url, soundcloudApiKey) {
		var useSandBox = false;
		var domain = useSandBox ? 'sandbox-soundcloud.com' : 'soundcloud.com'
		return (/api\./.test(url) ? url + '?' : 'http://api.' + domain +'/resolve?url=' + url + '&') + 'format=json&offset='+sc_offset+'&consumer_key=' + soundcloudApiKey +'&callback=?';
	};	
	
	//************* end soundcloud

	//************* start id3
	
	function getId3(){
		var url = processPlaylistDataArr[id3_counter].mp3+"?rand=" + (Math.random() * 99999999);
		ID3.loadTags(url, function() {
		 
		  var tags = ID3.getAllTags(url); 
		  
		  if(tags.title) processPlaylistDataArr[id3_counter].title = tags.title;
		  if(tags.artist) processPlaylistDataArr[id3_counter].artist = tags.artist;
		  if(tags.album) processPlaylistDataArr[id3_counter].album = tags.album;
		 
		  var image = tags.picture;
		  if(image){
			var base64String = "", i = 0, len = image.data.length;
			for(i; i < len; i++)base64String += String.fromCharCode(image.data[i]);
			processPlaylistDataArr[id3_counter].thumb = "data:" + image.format + ";base64," + window.btoa(base64String);
		  }
		  
		  id3_counter++;
		  if(id3_counter < processPlaylistDataArr.length){
			 getId3();  
		  }else{
			 //console.log(processPlaylistDataArr);
			 createNodes();
		  }
		}, {
		  tags: ["title","artist","album","picture"],
		  onError: function(reason) {
			  //console.log("error: ", reason.xhr);
			  if (reason.error === "xhr") {
			      //console.log("There was a network error: ", reason.xhr);
			  }
		  }
		});
	}
	
	//************* end id3

	//***************** audio
		
	function findMedia(){
		//console.log('findMedia');
		cleanAudio();
		createSound();
	}

	function hap_trackData(){
		
		var t = audioUp2Js.currentTime, d = audioUp2Js.duration;
		if ((audioUp2Js.buffered != undefined) && (audioUp2Js.buffered.length != 0) && isNumber(d)) {
			loadPercent = (audioUp2Js.buffered.end(0) / d);
		}
		
		if(isNumber(t) && isNumber(d)){
			if(player_mediaTime_current)player_mediaTime_current.html(formatCurrentTime(t)+mediaTimeSeparator);
			if(player_mediaTime_total)player_mediaTime_total.html(formatDuration(d));
		}
		
		if(!hap_circle){
			if(isNumber(loadPercent)){
				var w = loadPercent * seekBarSize;
				if(w > seekBarSize) w = seekBarSize;
				if(load_progress)load_progress.width(w);
			}
			if(isNumber(t) && isNumber(d)){
				if(!seekBarDown && play_progress) play_progress.width((t/d)*seekBarSize);
			}
		}else{
			if(canvasSupport){
				if(isNumber(loadPercent)){
					drawLoadbar(loadPercent);
				}
				if(isNumber(t) && isNumber(d)){
					last_circle_percentage = t/d;
					if(!seekBarDown && mediaPlaying){
						drawSeekbar(t/d);
					}
				}
			}else{
				
			}
		}
	}
	
	function _onFinish(){
		//console.log('_onFinish');
		if(typeof audioPlayerSoundEnd !== 'undefined')audioPlayerSoundEnd(_self, sound_id, playlistManager.getCounter());//callback
		enableActiveItem();
		playlistManager.advanceHandler(1, true);
	}
	
	function _onPlay(){
		//console.log('_onPlay');
		if(!sound_started){//fires only first time sound is played
			if(typeof audioPlayerSoundStart !== 'undefined')audioPlayerSoundStart(_self, sound_id, playlistManager.getCounter());//callback
			sound_started=true;	
		}
		if(typeof audioPlayerSoundPlay !== 'undefined')audioPlayerSoundPlay(_self, sound_id, playlistManager.getCounter());//callback 
		if(hap_circle && canvasSupport)drawToggleBtn();
	}
	
	function _onPause(){
		//console.log('_onPause');
		if(typeof audioPlayerSoundPause !== 'undefined')audioPlayerSoundPause(_self, sound_id, playlistManager.getCounter());//callback
	}
	
	function createSound(){
	
		if(useHtml5Audio){
			if(!html5_audio_created){
				hap_audio = $(document.createElement("audio")).attr('preload',autoLoad);
				audioUp2Js = hap_audio[0];
				html5_audio_created = true;
			}
			if(mp3Support){
				audioUp2Js.src = mp3;
			}
			if(autoPlay){
				audioUp2Js.load();
				audioUp2Js.play();
			}
			
			hap_audio.on('ended', function(e){
				_onFinish();
			}).on('pause', function(e){
				_onPause();
			}).on('play', function(e){
				_onPlay();
			}).on('canplay', function(e){
			}).on('canplaythrough', function(e){
			}).on('loadedmetadata', function(e){
				audioUp2Js.volume = _defaultVolume;

				if(lastSeekPercent){
					if(audioUp2Js.seekable && audioUp2Js.seekable.length > 0){
						audioUp2Js.currentTime= lastSeekPercent * audioUp2Js.duration;
					}
					lastSeekPercent=null;
				}	

				if(dataIntervalID)clearInterval(dataIntervalID);
				dataIntervalID=setInterval(hap_trackData, dataInterval);

			}).on('error', function(e){
				switch (audioUp2Js.error.code) {
				   case audioUp2Js.error.MEDIA_ERR_ABORTED:
					   console.log('You aborted the audio playback.');
					   break;
				   case audioUp2Js.error.MEDIA_ERR_NETWORK:
					   console.log('A network error caused the audio download to fail part-way.');
					   break;
				   case audioUp2Js.error.MEDIA_ERR_DECODE:
					   console.log('The audio playback was aborted due to a corruption problem or because the audio used features your browser did not support.');
					   break;
				   case audioUp2Js.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
					   console.log('The audio could not be loaded, either because the server or network failed or because the format is not supported.');
					   break;
				   default:
					   console.log('An unknown error occurred.');
					   break;
				}	
			});
					
		}
		

	    if(autoPlay){
			mediaPlaying=true;
			setPauseIcon('off');
		}else{
			mediaPlaying=false;
			setPlayIcon('off');
		}
		//setVolume();
		audioInited=true;
		autoPlay=true;//set autoplay after first play
		
	}
	
	function endInit(){
		//console.log('endInit');
		initButtons();
		checkPlayableLinks();
		if(activePlaylist){
			setPlaylist(activePlaylist);
		}else{
			if(!componentInited){
				setupDone();
			}	
		}
	}
	
	//***************** helper functions
	
	if(useKeyboardNavigation){
		_doc.keyup(function(e) {
			if(!componentInited || playlistTransitionOn) return false;
			
			if (!e) var e = window.event;
			if(e.cancelBubble) e.cancelBubble = true;
			else if (e.stopPropagation) e.stopPropagation();
			
			var key = e.keyCode;
			//console.log(key);
			
			if(key == 37) {//left arrow
			  	_self.previousAudio();
			} 
			else if(key == 39) {//right arrow
				_self.nextAudio();
			}
			else if(key == 32) {//space
				_self.toggleAudio();
			}
			else if(key == 77) {//m
				toggleVolume();
				setVolume();
			}
			return false;
		});	
	}
	
	_window.resize(function() {
		 if(!componentInited || playlistTransitionOn) return false;
		 if(windowResizeIntervalID) clearTimeout(windowResizeIntervalID);
		 windowResizeIntervalID = setTimeout(_doneResizing, windowResizeInterval);
	});
	
	this.getCurrentTime = function(){
		if(!componentInited) return false;
		if(!media_type) return false;
		var v;
		if(useHtml5Audio){
			if(audioUp2Js)v = audioUp2Js.currentTime;
		}
		return v;
	}
	//player.getCurrentTime(); 

	function _doneResizing(){
		//console.log('_doneResizing');

		if(!hap_circle){
			
			seekBarSize=progress_bg.width();
			
			if(isNumber(loadPercent) && load_progress) load_progress.width(loadPercent * seekBarSize);	
			
			if(!seekBarDown && play_progress){
				var t, d;
			
				if(useHtml5Audio){
					if(audioUp2Js)t = audioUp2Js.currentTime, d = audioUp2Js.duration;
				}
				try{
					if(t && isNumber(t) && d && isNumber(d)) play_progress.width((t/d)*seekBarSize);
				}catch(er){
					//alert(er);
				}
			}
		}
		
		if(activatePlaylistScroll && !hidden_playlist)checkScroll();
		
		if(useSongNameScroll && textScroller){
		   textScroller.checkSize();
	    }
	}
	
	function hidePreloader(){
		preloader.css('display','none');
	}
	function showPreloader(){
		preloader.css('display','block');
	}
	
	function resetData(){
	  //console.log('resetData');
	  if(dataIntervalID) clearInterval(dataIntervalID);
	  if(useSongNameScroll && textScroller){
		   textScroller.deactivate();
	  }
	  player_mediaName.html(defaultArtistData);
	  player_mediaTime_current.html(songTimeCurr + mediaTimeSeparator);
	  player_mediaTime_total.html(songTimeTot);
	  if(!hap_circle){
		 play_progress.width(0);
		 load_progress.width(0);
	  }else{
		 if(canvasSupport){
			 last_circle_percentage = 0;
			 ctx.clearRect(0, 0, circleWidth, circleHeight);
			 ctx2.clearRect(0, 0, circleWidth, circleHeight);
		 }else{
			
		 }
	  }
	  setPlayIcon('off');
	  player_download.css('display','none');
	}
	
	function resetData2(){
	  //console.log('resetData2');
	  if(dataIntervalID) clearInterval(dataIntervalID);
	  if(!autoSetSongTitle){//reset if we manually set song title
		 if(useSongNameScroll && textScroller)textScroller.deactivate();
		 player_mediaName.html(defaultArtistData);
	  }
	  player_mediaTime_current.html(songTimeCurr + mediaTimeSeparator);
	  player_mediaTime_total.html(songTimeTot);
	  if(!hap_circle){
		 play_progress.width(0);
		 load_progress.width(0);
	  }else{
		 if(canvasSupport){
			 last_circle_percentage = 0;
			 ctx.clearRect(0, 0, circleWidth, circleHeight);
			 ctx2.clearRect(0, 0, circleWidth, circleHeight);
		 }else{
			
		 }
	  }
	  setPlayIcon('off');
	  player_download.css('display','none');
	  //console.log('resetData2');
	}
	
	this.setPlayIcon = function(){//just a addition for inline demo
		if(active_text_link && active_text_link.hasClass('play_link')) active_text_link.attr('src', link_play);
		mediaPlaying=false;
	}
	
	function setPlayIcon(state){
		if(state == 'on'){
			componentWrapper.find('.controls_toggle').find('img').attr('src', playOnBtnUrl);
		}else{
			componentWrapper.find('.controls_toggle').find('img').attr('src', playBtnUrl);
		}
		if(active_text_link && active_text_link.hasClass('play_link')) active_text_link.attr('src', link_play);
		if(hap_circle){
			if(canvasSupport){
				ctx.clearRect(0, 0, circleWidth, circleHeight);//because toggle btn is drawn on play_canvas
				drawSeekbar(last_circle_percentage);//because toggle btn is drawn on play_canvas
				drawToggleBtn();
			}
		}
	}
	
	function setPauseIcon(state){
		if(state == 'on'){
			componentWrapper.find('.controls_toggle').find('img').attr('src', pauseOnBtnUrl);
		}else{
			componentWrapper.find('.controls_toggle').find('img').attr('src', pauseBtnUrl);
		}
		if(active_text_link && active_text_link.hasClass('play_link')){
			if(active_hap_inline.hasClass('hap_text_link'))active_text_link.attr('src', link_pause);//prevent image link set pause icon on last playing text link
		} 
		if(hap_circle){
			if(canvasSupport){
				ctx.clearRect(0, 0, circleWidth, circleHeight);//because toggle btn is drawn on play_canvas
				drawSeekbar(last_circle_percentage);//because toggle btn is drawn on play_canvas
				drawToggleBtn();
			}
		}
	}	
	
	function isNumber(n) {
	   //http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
	   return !isNaN(parseFloat(n)) && isFinite(n);
	   /*
	   if(n == null || n == undefined || isNaN(n) || !isFinite(n))return false;	
		else return true;
	   */
	}
	
	function formatCurrentTime(seconds) {
		seconds = Math.round(seconds);
		minutes = Math.floor(seconds / 60);
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		return minutes + ":" + seconds;
	}
	
	function formatDuration(seconds) {
		seconds = Math.round(seconds);
		minutes = Math.floor(seconds / 60);
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		//return " - " + minutes + ":" + seconds;
		return minutes + ":" + seconds;
	}
	
	function setMediaTitle(val){
		//console.log('setMediaTitle');
		if(typeof(val)==='string'){
			if(useNumbersInPlaylist && playlistManager && playlistManager.getCounter()!=-1){
				var c = playlistManager.getCounter();
				var title = stringCounter(playlistDataArr[c].id) + titleSeparator + val;
			}else{
				var title = val;
			}
		}else if(typeof(val)==='number'){
			if(!playlistManager) return false;
			if(val<0 || val > _playlistLength-1){
				return false;
			}else{
				var c = playlistManager.getCounter(), title = getTitle(c);
			}
		}else{//no val passed (undefined)
			if(!playlistManager) return false;
			var c = playlistManager.getCounter(), title = getTitle(c);
		}
		if(useSongNameScroll && textScroller){
			textScroller.input(title);
			textScroller.activate();
		}else{
			if(player_mediaName)player_mediaName.html(title);
		}
	}
	
	function getTitle(c, formatted){
		//console.log('getTitle');
		if(typeof formatted === "undefined" || formatted===null) formatted = true;
		if(!playlistDataArr[c] || !playlistDataArr[c].title || isEmpty(playlistDataArr[c].title)){
			return defaultArtistData;	
		}
		if(formatted){
			if(useNumbersInPlaylist){
				return stringCounter(playlistDataArr[c].id) + titleSeparator + playlistDataArr[c].title;	
			}else{
				return playlistDataArr[c].title;	
			}
		}else{
			return playlistDataArr[c].title;	
		}
	}
	
	//strip slashes from text
	function stripslashes(str) {
		str=str.replace(/\\'/g,'\'');
		str=str.replace(/\\"/g,'"');
		str=str.replace(/\\0/g,'\0');
		str=str.replace(/\\\\/g,'\\');
		return str;
	};
	
	function stringCounter(i) {
		var s;
		if(i < 9){
			s = "0" + (i + 1);
		}else{
			s = i + 1;
		}
		return s;
	}
	
	function preventSelect(arr){
		$(arr).each(function() {           
		$(this).attr('unselectable', 'on')
		   .css({
			   '-moz-user-select':'none',
			   '-webkit-user-select':'none',
			   'user-select':'none'
		   })
		   .each(function() {
			   this.onselectstart = function() { return false; };
		   });
		});
	}	
	
	function randomiseIndex(num) {
		var arr = [],randomArr = [],i = 0;
		for (i; i < num; i++) {//first fill the ordered set of indexes
			arr[i] = i;
		}
		var j = 0, randomIndex;
		for (j; j < num; j++) { //then randomize those indexes
			randomIndex = Math.round(Math.random()*(arr.length-1));
			randomArr[j] = arr[randomIndex];
			arr.splice(randomIndex, 1);
		}
		return randomArr;
	}
	
	function populateIndex(num) {
		var arr = [],i = 0;
		for (i; i < num; i++) {//first fill the ordered set of indexes
			arr[i] = i;
		}
		return arr;
	}
	
	//contains in array
	function contains(arr, obj) {
		var i = arr.length;
		while (i--) {
		   if(RegExp(arr[i]).test(obj)){
			   //console.log(arr[i], obj);
			   return true;
		   }
		}
		return false;
	}
	
	function keysrt(arr, type, desc){
		if(type == 'title'){
			arr.sort(function(a, b) { 
				return a.title == b.title ? 0 : a.title < b.title ? -1 : 1 
			});	
		}else if(type == 'type'){
			arr.sort(function(a, b) { 
				return a.type == b.type ? 0 : a.type < b.type ? -1 : 1 
			});	
		}
		if(desc)arr.reverse();
	}
	
	function isEmpty(str) {
		if(!str)return true;
	    return str.replace(/^\s+|\s+$/g, '').length == 0;
	}
	
	function timeToSec(time) { // time must be a string type: "HH:mm:ss"
		var a = time.split(':');
		return seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
	}
	
	function hmsToSecondsOnly(str) {//This function handels "HH:MM:SS" as well as "MM:SS" or "SS".
		var p = str.split(':'),
			s = 0, m = 1;
		while (p.length > 0) {
			s += m * parseInt(p.pop());
			m *= 60;
		}
		return s;
	}
	
	function parseXML(xml) {
		if(window.ActiveXObject && window.GetObject) {
			var dom = new ActiveXObject('Microsoft.XMLDOM');
			dom.loadXML(xml);
			return dom;
		}
		if(window.DOMParser){
			return new DOMParser().parseFromString(xml, 'text/xml');
		}else{
			throw new Error('No XML parser available');
		}
	}
	
	function getFirstChild(el){
	    var firstChild = el.firstChild;
	    while(firstChild != null && firstChild.nodeType == 3){ // skip TextNodes
		  firstChild = firstChild.nextSibling;
	    }
	    return firstChild;
	}
	
	function htmlDecode(value){
	    return $('<div/>').html(value).text();
	}
	
	function sorta(a, b){//sort array
		return (b - a);
	}
	
	function checkBoolean(value){
		if(typeof(value) === 'string'){
			switch(value.toLowerCase()){
				case "true": case "yes": case "1": return true;
				case "false": case "no": case "0": case null: return false;
				default: return Boolean(value);
			}
		}else if(typeof(value) === 'boolean'){
			return Boolean(value);
		}
	}
	
	function isCanvasSupported(){
		var elem = document.createElement('canvas');
		return !!(elem.getContext && elem.getContext('2d'));
	}
	
	
	
	
	
	// ************************************************************ //
	// ******************************** PUBLIC API **************** //
	
	/* play current active media */ 
	this.playAudio = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		if(mediaPlaying) return false;
		if(!audioInited) return false;
		if(useHtml5Audio){
			if(audioUp2Js)audioUp2Js.play();
		}
		setPauseIcon('off');
		mediaPlaying=true;
		audioInited=true;
	}
	/* pause current active media */ 
	this.pauseAudio = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		if(!mediaPlaying) return false;
		if(!audioInited) return false;
		if(useHtml5Audio){
			if(audioUp2Js)audioUp2Js.pause();
		}
		setPlayIcon('off');
		mediaPlaying=false;
	}
	/* toggle current active media */ 
	this.toggleAudio = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		if(!audioInited) return false;
		togglePlayback();
	}
	/* stop current active media (stops loading as well) */ 
	this.stopAudio = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		if(!audioInited) return false;
		if(useHtml5Audio){
			if(audioUp2Js){
				audioUp2Js.src = '';
				if(mp3Support){
					audioUp2Js.src = mp3;
				}
			}
		}
		resetData2();
		mediaPlaying=false;
	}
	/* used in multiple instances to toggle one instance if another has started */ 
	this.checkAudio = function(act){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		//console.log('checkAudio');
		var action = act.toLowerCase();
		if(mediaPlaying){
			if(action=='pause'){
				
				if(useHtml5Audio){
					if(audioUp2Js)audioUp2Js.pause();
				}
				
			}else if(action=='stop'){
			
				if(useHtml5Audio){
					if(audioUp2Js){
						audioUp2Js.src = '';
						if(mp3Support){
							audioUp2Js.src = mp3;
						}
					}
				}
				
				resetData2();
			}
			mediaPlaying=false;
			setPlayIcon('off');
		}
	}
	/* play next media */ 
	this.nextAudio = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		enableActiveItem();
		playlistManager.advanceHandler(1, true);
	}
	/* play previous media */ 
	this.previousAudio = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		enableActiveItem();
		playlistManager.advanceHandler(-1, true);
	}
	/* load media from current playlist 
			param1: pass track as string or number (for numbers, counting starts from zero). */ 
	this.loadAudio = function(value) {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		
		if(typeof(value) === 'string'){
			
			var i = 0, found = false;
			for(i;i<_playlistLength;i++){//find song name and counter
				//console.log(value, value.length, playlistDataArr[i].title, playlistDataArr[i].title.length);
				if(value == playlistDataArr[i].title){
					value = i;
					found=true;
					break;	
				}
			}
			if(!found){
				if(useAlertMessaging) alert('Track with name "' + value + '" doesnt exist. Load audio failed.');
				return false;	
			}
			
		}else if(typeof(value) === 'number'){
			
			if(value<0){
				if(useAlertMessaging) alert('Invalid track number. Track number  "' + value + '" doesnt exist. Load audio failed.');
				return false;
			}
			else if(value > _playlistLength-1){
				if(useAlertMessaging) alert('Invalid track number. Track number  "' + value + '" doesnt exist. Load audio failed.');
				return false;
			}
			
		}else{
			if(useAlertMessaging) alert('Load audio method requires either a track number or a track title to load. Load audio failed.');
			return false;	
		}
		
		enableActiveItem();
		playlistManager.processPlaylistRequest(value);
	}
	
	/* load new playlist 
			param1: hidden (boolean) true/false (visible/hidden playlist)
			param2: id (pass element 'id' attribute from the dom) */
	this.loadPlaylist = function(data) {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		//console.log(data, activePlaylist);
		if(typeof(data) === 'undefined'){
			if(useAlertMessaging) alert('loadPlaylist method requires data parameter. loadPlaylist failed.');
			return false;
		}
		activePlaylist = data;
		setPlaylist(activePlaylist);
	}
	/* add track to current playlist(
			 param1 (required): type of track, visible/hidden (string),
			 param2 (required): track format, html/data (string),
			 param3 (required): pass track or array of tracks,
			 param4 (optional): position to insert track(s) (number, counting starts from 0), leave out parameter for the end append) */
	this.addTrack = function(type, format, track, position) {
		//console.log('addTrack');
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		
		if(typeof(type) === 'undefined'){
			if(useAlertMessaging) alert('addTrack method requires type parameter. AddTrack failed.');
			return false;
		}
		if(typeof(format) === 'undefined'){
			if(useAlertMessaging) alert('addTrack method requires format parameter. AddTrack failed.');
			return false;
		}
		if(typeof(track) === 'undefined'){
			if(useAlertMessaging) alert('addTrack method requires track parameter. AddTrack failed.');
			return false;
		}
		
		var len = 1, is_array = false;	
		
		if(typeof(track) === 'string' || Object.prototype.toString.call(track) === '[object Object]'){
		}else if(Object.prototype.toString.call(track) === '[object Array]'){
			//console.log('object');
			len = track.length;
			is_array=true;
		}else{
			if(useAlertMessaging) alert('addTrack method requires track as string, object or array parameter. AddTrack failed.');
			return false;
		}
		
		insert_position = position;
		type=type.toLowerCase();
		if(type == 'visible'){
			if(lastPlaylist && hidden_playlist){//needs to be here, above bottom if(lastPlaylist){ statement, so that lastPlaylist becomes null again!
				destroyPlaylist();
			}
			addTrack_process=true;
			hidden_playlist=false;
		}else{
			if(lastPlaylist && !hidden_playlist){//needs to be here, above bottom if(lastPlaylist){ statement, so that lastPlaylist becomes null again!
				destroyPlaylist();
			}
			addHiddenTrack_process=true;
			hidden_playlist=true;
		}
		end_insert = false;
		
		if(lastPlaylist){
			if(typeof(insert_position) !== 'undefined'){
				//console.log(insert_position, _playlistLength);
				if(insert_position<0){
					if(useAlertMessaging) alert('Invalid position to insert track to. Position number "' + position + '" doesnt exist. AddTrack failed.');
					return false;
				}
				else if(insert_position > _playlistLength){
					if(useAlertMessaging) alert('Invalid position to insert track to. Position number "' + position + '" doesnt exist. AddTrack failed.');
					return false;
				}
				else if(insert_position == _playlistLength){
					end_insert=true;
				}
			}else{
				end_insert=true;
				insert_position = _playlistLength;	
			}
		}else{//first time create playlist from addTrack method
			if(typeof(insert_position) !== 'undefined'){
				if(insert_position!=0){
					if(useAlertMessaging) alert('Invalid position to insert track to. Position number "' + position + '" doesnt exist. AddTrack failed.');
					return false;
				}
			}else{
				insert_position=0;
			}
			end_insert=true;
		}
		
		showPreloader();
		playlistTransitionOn=true;
		_playlistLoaded=false;
		
		var i = 0, _li, _track, playlist_id = 'playlist' + Math.floor((Math.random()*9999)), playlist_ul = $('<ul id = '+playlist_id+'></ul>');
		format = format.toLowerCase();	
		for(i; i < len; i++){
			//create playlist item node	
			_track = is_array ? track[i] : track;
			if(format == 'html'){
				_li = createTrackFromHtml(_track).appendTo(playlist_ul);
			}else{//data
				if(_track.type && _track.mp3 || _track.path){//required data!
					_li = createTrackFromData(_track).appendTo(playlist_ul);
				}else{
					continue;	
				}
			}
		}
		
		processPlaylistArr = [];
		playlist_loader.empty();
		
		playlist_ul.appendTo(playlist_loader).find("li[class='playlistItem']").each(function(){
			processPlaylistArr.push($(this));
		});
		
		playlist_first_init = false;//reset
		if(!lastPlaylist){
			playlist_first_init = true;
			if(type == 'visible'){
				if(scrollPaneApi){
					//lastPlaylist = scrollPaneApi.getContentPane();
					lastPlaylist = playlist_inner;
				}else{
					lastPlaylist = playlist_inner;
				}
			}else{//hidden
				lastPlaylist = hidden_playlist_holder;
			}
		}
		
		checkPlaylistProcess();
	}
	
	/* creates tracks from data (object) format */	
	function createTrackFromData(data){
		//console.log('createTrackFromData',data);
		var type, origtype='', mp3, title='', thumb='', download, dlink, plink, ul, li, str, append, match;	
			
		type = data.type.toLowerCase();
		if(data.origtype)origtype = data.origtype.toLowerCase();
		
		if(data.mp3){
			mp3 = data.mp3;
		}else if(data.path){
			mp3 = data.path;
		}
		if(data.title)title = data.title;
		if(data.thumb)thumb = data.thumb;
		
		if(data.download){
		
			if(data.download == true){
				download=mp3;//will use mp3 link for download
			}else{
				download=data.download;//will use custom link for download
			}
			
		}
		if(data.url)plink = data.url;
		if(data.dlink){
		
			if(data.dlink == true){
				dlink=mp3;//will use mp3 link for download
			}else{
				dlink=data.dlink;//will use custom link for download
			}
			
		}
		//console.log(download, dlink);
		
		if(type == 'local'){
			
			if(playlistItemContent == 'title'){//title
			
				str = "<li class= 'playlistItem' data-type='local' data-origtype='"+origtype+"' data-mp3='"+mp3+"' data-thumb='"+thumb+"' data-title='"+title+"'><a class='playlistNonSelected' href='#'>"+title+"</a></li>";
			
			}else if(playlistItemContent == 'thumb'){//thumbs
			
				str = "<li class= 'playlistItem' data-type='local' data-origtype='"+origtype+"' data-mp3='"+mp3+"' data-thumb='"+thumb+"' data-title='"+title+"'><a class='playlistNonSelected' href='#'><img src='"+thumb+"' alt='thumb'/></a></li>";
				
			}else if(playlistItemContent == 'all'){
				
				str = "<li class= 'playlistItem' data-type='local' data-origtype='"+origtype+"' data-mp3='"+mp3+"' data-thumb='"+thumb+"' data-title='"+title+"'><a class='playlistNonSelected' href='#'><span class='hap_thumb'><img src='"+thumb+"' alt='thumb'/></span><span class='hap_title'><p>'"+title+"'</p></span></a></li>";
			}
			
		}else{
			str = "<li class= 'playlistItem' data-type='"+type+"' data-path='"+mp3+"' data-thumb='"+thumb+"'></li>";
			if(type == 'database_data'){
				var table = data.table ? data.table : null;
				var limit = data.limit ? data.limit : null;
				var range = data.range ? data.range : null;
				if(table){
					append = ' data-table="'+table+'" ';
					match = str.match(/\>/);//first occurence of greater than sign
					str = str.slice(0, match.index) + append + str.slice(match.index);
				}
				if(limit){
					append = ' data-limit="'+limit+'" ';
					match = str.match(/\>/);//first occurence of greater than sign
					str = str.slice(0, match.index) + append + str.slice(match.index);
				}
				if(range){
					append = ' data-range="'+range+'" ';
					match = str.match(/\>/);//first occurence of greater than sign
					str = str.slice(0, match.index) + append + str.slice(match.index);
				}
			}
		}
			
		//append other attributes/elements	
		if(download){

			append = ' data-download="'+download+'" ';
			match = str.match(/\>/);//first occurence of greater than sign
			str = str.slice(0, match.index) + append + str.slice(match.index);

		}
		
		if(type == 'local'){
			if(dlink){
				append = "<a class='dlink' href='#' data-dlink='"+dlink+"'><img src='"+trackDownloadIcon+"' alt='download'/></a>";
				match = str.match(/\<\/a\>\<\/li\>/);//last occurence of closing a tag
				str = str.slice(0, match.index) + append + str.slice(match.index);
			}
			if(plink){
				append = "<a class='plink' href='"+plink+"' target='_blank'><img src='"+trackUrlIcon+"' alt='purchase'/></a>";
				match = str.match(/\<\/a\>\<\/li\>/);//last occurence of closing a tag
				str = str.slice(0, match.index) + append + str.slice(match.index);
			}
		}else{
			if(dlink){
				append = ' data-dlink="'+dlink+'" ';
				match = str.match(/\>/);//first occurence of greater than sign
				str = str.slice(0, match.index) + append + str.slice(match.index);
			}
			if(plink){
				append = ' data-plink="'+plink+'" ';
				match = str.match(/\>/);//first occurence of greater than sign
				str = str.slice(0, match.index) + append + str.slice(match.index);
			}
		}
		
		//create playlist item node	
		ul = document.createElement('ul');
		ul.innerHTML = str;
		li = ul.firstChild;

		return $(li);
		
	}
	
	/* creates tracks from html format */	
	function createTrackFromHtml(data){
		//console.log(data);
		var obj = $(data), str, ul, li;
		str = $('<div>').append(obj.clone()).html();//convert object to string
		
		ul = document.createElement('ul');
		ul.innerHTML = str;
		li = ul.firstChild;
		
		return $(li);
	}
	
	/*
	Play sound without creating any data/playlist (will not destroy current playlist if exist, only enableActiveItem).
		param1: (object containing following properties): 
			required:
				mp3: mp3 path to audio file
			optional:
				title: add song title
	*/
	this.inputAudio = function(data){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;

		if(typeof(data) === 'undefined'){
			if(useAlertMessaging) alert('inputAudio method requires data parameter. inputAudio failed.');
			return false;
		}
		
		if(data.mp3 === 'undefined'){
			if(useAlertMessaging) alert('inputAudio method requires data.mp3 parameter. inputAudio failed.');
			return false;
		}
		
		//enable active item, if exist, but dont dispose current playlist, if exist (optional)
		enableActiveItem();
		playlistManager.reSetCounter();
		
		mp3 = data.mp3;
		if(data.title !== 'undefined'){//after we reset playlistManager counter!
			setMediaTitle(data.title);
		}else{
			setMediaTitle(defaultArtistData);
		}
		
		if(isMobile){
			autoPlay=true;
		}
		
		findMedia();
	}

	
	/*remove track from current playlist(
         param1: pass track or array or tracks as string(s) or number(s) (for numbers, counting starts from zero). If passing array make sure array contains only strings or only numbers, not both at the same time! */
	this.removeTrack = function(track) {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		
		if(typeof(track) === 'undefined'){
			if(useAlertMessaging) alert('removeTrack method requires track parameter. removeTrack failed.');
			return false;
		}
		
		if(typeof(track) === 'string'){
			
			var i = 0, found = false;
			for(i;i<_playlistLength;i++){//find song name and counter
				//console.log(track, track.length, playlistDataArr[i].title, playlistDataArr[i].title.length);
				if(track == playlistDataArr[i].title){
					track = i;
					found=true;
					break;	
				}
			}
			if(!found){
				if(useAlertMessaging) alert('Track with name "' + track + '" doesnt exist. RemoveTrack failed.');
				return false;	
			}
			
			if(liArr[track] && playlistDataArr[track]){
				liArr[track].remove();
				playlistDataArr.splice(track,1);
				updateTrackRemoval(track);
			}else{
				if(useAlertMessaging) alert('RemoveTrack with name "' + track + '" failed.');
			}
			
		}else if(typeof(track) === 'number'){
			
			if(track<0 || track > _playlistLength-1){
				if(useAlertMessaging) alert('Invalid track number. Track number  "' + track + '" doesnt exist. RemoveTrack failed.');
				return false;
			}
			
			if(liArr[track] && playlistDataArr[track]){
				liArr[track].remove();
				playlistDataArr.splice(track,1);
				updateTrackRemoval(track);
			}else{
				if(useAlertMessaging) alert('RemoveTrack with name "' + track + '" failed.');
			}
			
		}else if(Object.prototype.toString.call(track) === '[object Array]'){//array
			
			var name_removal;
			if(typeof(track[0]) === 'string')name_removal = true;
			else if(typeof(track[0]) === 'number')name_removal = false;
			//Mixed array removal not supported! removeTrack parameter array requires array to be filled either with strings or numbers, not both at the same time! removeTrack failed.
			
			if(name_removal){//remove title by name
				
				var i = 0, len = track.length, len2, _track, j;
				outer:
				for(i; i < len; i++){
					_track = track[i];
					if(typeof(_track) === 'string'){
						
						j = 0, len2 = playlistDataArr.length;
						if(len2 == 0) {
							updateTrackRemoval();
							break outer;
						}
						
						for(j;j<len2;j++){//find song name and counter
							if(_track == playlistDataArr[j].title){
								
								if(liArr[j] && playlistDataArr[j]){
									liArr[j].remove();
									playlistDataArr.splice(j,1);
									updateTrackRemoval(j);
									break;	
								}
							}
						}
					}
				}
				
			}else{//number removal
				
				track.sort(sorta); //sort by higest first so we dont break array indexes!! (remove from bottom up)
			
				var i = 0, len = track.length, len2, _track;
				outer:
				for(i; i < len; i++){
					_track = track[i];
					if(typeof(_track) === 'number'){
						
						len2 = playlistDataArr.length;
						if(len2 == 0) {
							updateTrackRemoval();
							break outer;
						}
						
						if(_track > -1 && _track < len2){
							
							if(liArr[_track] && playlistDataArr[_track]){
								liArr[_track].remove();
								playlistDataArr.splice(_track,1);
								updateTrackRemoval(_track);
							}
						}
					}
				}
			}
			
		}else{
			if(useAlertMessaging) alert('removeTrack method requires track parameter as string, number or array. removeTrack failed.');
			return false;
		}
	}
	
	function updateTrackRemoval(track){//called on each iteration when removeTrack from array is used!
		
		_playlistLength = playlistDataArr.length;
		
		if(_playlistLength > 0){
			
			getPlaylist();
			
			var current_counter = playlistManager.getCounter();
			if(track == current_counter){//remove number equal to current counter
				destroyAudio();	
				playlistManager.setPlaylistItems(_playlistLength);//counter resets to -1
			}else{
				playlistManager.setPlaylistItems(_playlistLength, false);
				if(track < current_counter){//remove number less than current counter
					playlistManager.reSetCounter(playlistManager.getCounter()-1);//if we removed song before current playing media, descrease counter!	
				}else{//remove number larger than current counter, current counter doesnt change
				}
			}
			if(autoSetSongTitle)setMediaTitle();
			
		}else{//we removed last track in playlist
			destroyPlaylist();	
			activePlaylist=null;
			if(typeof playlistEmpty !== 'undefined')playlistEmpty(_self, sound_id);//callback
		}
	}
	/* destroy active song */
	this.destroyAudio = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		destroyAudio();
	}
	/* destroy active playlist */
	this.destroyPlaylist = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		destroyPlaylist();
	}
	/* set title in player title element (player_mediaName)
		param1: pass title as string. */
	this.setTitle = function(title) {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		setMediaTitle(title);
	}
	/* toggle random playback */ 
	this.toggleShuffle = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(randomPlay){
			componentWrapper.find('.player_shuffle').find('img').attr('src', shuffleBtnUrl);
			randomPlay=false;
		}else{
			componentWrapper.find('.player_shuffle').find('img').attr('src', shuffleOnBtnUrl);
			randomPlay=true;
		}
		playlistManager.setRandom(randomPlay);
	}
	/* toggle playlist loop */ 
	this.toggleLoop = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(loopingOn){
			componentWrapper.find('.player_loop').find('img').attr('src', loopBtnUrl);
			loopingOn=false;
		}else{
			componentWrapper.find('.player_loop').find('img').attr('src', loopOnBtnUrl);
			loopingOn=true;
		}
		playlistManager.setLooping(loopingOn);
	}
	/* set volume, accepts value between 0-1 */ 
	this.setVolume = function(val) {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(val<0) val=0;
		else if(val>1) val=1;
		_defaultVolume = val;
		setVolume();
	}
	/* returns current volume */ 
	this.getVolume = function() {
		if(!componentInited) return false;
		return _defaultVolume;
	}
	/* set autoplay */
	this.setAutoPlay = function(val){
		if(!componentInited) return false;
		autoPlay = val;
	}
	/* get autoplay */
	this.getAutoPlay = function(){
		if(!componentInited) return false;
		return autoPlay;
	}
	/* return is mobile device or desktop */
	this.getIsMobile = function(){
		return isMobile;
	}
	this.getMobileType = function(){
		return mobile_type;
	}
	/* return component setup is finished */
	this.getSetupDone = function(){
		return componentInited;
	}
	/* return playlist loaded (finished loading) */
	this.getPlaylistLoaded = function(){
		return _playlistLoaded;
	}
	/* return playlist loading (is playlist loading) */
	this.getPlaylistTransition = function(){
		return playlistTransitionOn;
	}
	/* return media playing or paused */
	this.getMediaPlaying = function(){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		return mediaPlaying;
	}
	/* return media initiated (active song ready) */
	this.getAudioInited = function(){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		return audioInited;
	}
	/* return active media type (soundcloud, podcast... etc) */
	this.getMediaType = function(){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		return media_type;
	}
	/* return active media item number (counting starts from zero) */
	this.getActiveItem = function(){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		return playlistManager.getCounter();
	}
	/* return playlist items (li class='playlistItem') */
	this.getPlaylistItems = function(value){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!liArr || liArr.length==0) return false;
		if(typeof(value) === 'string'){//all
			return liArr;
		}else if(typeof(value) === 'number'){
			if(num < 0 || num > _playlistLength-1) return false;
			if(!liArr[num]) return false; 
			return liArr[num];
		}
	}
	/* return number of items in playlist */ 
	this.getMediaCount = function(){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		return isNumber(_playlistLength) ? _playlistLength : 0;
	}
	/* return playlist hidden or visible */ 
	this.getPlaylistHidden = function(){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		return hidden_playlist;
	}
	/* return hidden_playlist_holder */
	this.get_hidden_playlist_holder = function(){
		if(!componentInited) return false;
		return hidden_playlist_holder;
	}
	/* returns playlist list element (holds list of all playlists). General method needed because its treated differently from parent window and from popup! */
	this.getPlaylistList = function() {
		if(!componentInited) return false;
		if(!playlist_list || playlist_list.length==0) return false;
		return playlist_list;
	}
	/* reorder playlist items
		param1: action as string. 
			'reverse': reverse from top to bottom, 
			'random': randomise playlist items, 
			'remap': reposition to new array order (required numbered array the same length as number of playlist items), 
			'swap': swap two playlist items position (required numbered array length of 2).
		param2: data for reordering as array.
			required for remap, swap. */
	this.orderPlaylist = function(act, arr) {
		if(!componentInited) return false;
		if(!lastPlaylist)return false;
		
		if(typeof(act) === 'undefined'){
			if(useAlertMessaging) alert('orderPlaylist method requires action parameter. orderPlaylist failed.');
			return false;
		}
		
		var listItems = lastPlaylist.children('li'), len = listItems.length;
		if(len == 0)return false;
		//console.log(listItems);
		
		var action = act.toLowerCase();
		//console.log(action);
		if(action == 'reverse'){
			lastPlaylist.append(listItems.get().reverse());
			//lastPlaylist.children().each(function(i,li){lastPlaylist.prepend(li)});//other working method to reverse
		}else if(action == 'random' || action == 'remap' || action == 'swap'){
			//http://stackoverflow.com/questions/3050830/reorder-list-elements-jquery
			if(action == 'random'){
				var arr = randomiseIndex(len);
			}else if(action == 'remap'){
				if(typeof(arr)=== "undefined" || arr.length != len)return false;//needs to be the same length as number of playlist items
			}else if(action == 'swap'){
				if(typeof(arr)=== "undefined" || arr.length != 2)return false;
				var tarr = populateIndex(len);
				tarr.splice(arr[1], 1, arr[0]);
				tarr.splice(arr[0], 1, arr[1]);
				var arr = $.extend(true, [], tarr);
			}else{
				return false;
			}
			//console.log(arr);
			// Map the existing items to their new positions        
			orderedItems = jQuery.map(arr, function(value) {
				return jQuery(liArr).get(value);
			});
			//console.log(orderedItems);
			// Clear the old list items and insert the newly ordered ones
			lastPlaylist.empty().html(orderedItems);
		}else{
			if(useAlertMessaging) alert('Wrong action parameter for orderPlaylist method. orderPlaylist failed.');
			return false;
		}
		
		//update playlist data
		getPlaylist();
		//update playlist counter
		var current_counter = playlist_inner.find('a[class=playlistSelected]').attr('data-id');
		if(current_counter){
			playlistManager.reSetCounter(current_counter);
			if(autoSetSongTitle)setMediaTitle();
		}
	}
	/* (re)initialize playlist scroll */
	this.checkScroll = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		checkScroll();
	}
	/*
	Call this when some container (like a div) in which '#componentWrapper' is placed is set to 'display:none' in css. 
	Then when you show that container, call reinitScroll(), to reinitialize jScrollPane, 
	because jScrollPane needs container to be visible.
	Also, text scoller needs '.fontMeasure' element visible to get the correct width of the font.
	*/
	this.reinitScroll = function() {
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		if(scrollPaneApi){
			scrollPaneApi.reinitialise();
			if(playlistScrollOrientation == 'vertical'){
				scrollPaneApi.scrollToY(0);
				$('.jspPane').css('top',0+'px');
			}else{
				scrollPaneApi.scrollToX(0);
				$('.jspPane').css('left',0+'px');
			}
		}
		if(useSongNameScroll && textScroller){
			if(playlistManager && playlistManager.getCounter()!=-1){
				if(autoSetSongTitle)setMediaTitle();
			}
		}
	}
	
	/* returns array of objects for every song in current playlist: {id, type, mp3, length, title, thumb, download, dlink, plink} */ 
	this.getPlaylistData = function(){
		if(!componentInited) return false;
		if(playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		return playlistDataArr;	
	}
	/* return sound_id (player instance reference) */
	this.getSoundId = function(){
		if(!componentInited) return false;
		return sound_id;
	}
	/* return "ontouchstart" in window */
	this.getTouch = function(){
		if(!componentInited) return false;
		return hasTouch;
	}
	/* return hap_source_path */
	this.get_hap_source_path = function(){
		if(!componentInited) return false;
		return hap_source_path;
	}
	
	
	
	
	endInit();
	return this;

	}
	
})(jQuery);



(function($) {

	 $.playlistManager = function(data) {
		var pm = new ap_PlaylistManager(data);
		return pm;
	 };

	 function ap_PlaylistManager(settings) {
		
		this._loopingOn = settings.loopingOn;
		this._randomPlay = settings.randomPlay;
		
		this._playlistItems;
		this._lastInOrder = false;
		this._counter = -1;
		this._lastPlayedFromPlaylistClick;//last played on click.
		this._lastRandomCounter;//last played random media in random playlist.
		this._randomPaused = false;//when random is playing and we interrupt it by click on the playlist.
		this._randomArr = [];
		this._playlistSelect = false;//prevent geting counter from randomArr on playlist click (get 'normal' counter instead)
		
	 }
	 
	 ap_PlaylistManager.prototype = {
				 
		//set counter to specific number or add it to the currect counter value		 
		setCounter:function(value, _add) {
			if (typeof _add === 'undefined') _add = true;
			if(_add){
				this._counter += parseInt(value, 10);
			}else{
				this._counter = parseInt(value, 10);
			}
			//console.log('setCounter ', this._counter);
			this._checkCounter();
		},
		getCounter:function() {
			var i;
			if(this._randomPlay){
				if(!this._playlistSelect){
					i = this._randomArr[this._counter];
				}else{
					i = this._counter;
				}
			}else{
				i = this._counter;
			}
			return i;
		},
		advanceHandler:function(a) {
			this._playlistSelect = false;//reset
			if(this._randomPaused){
				this._handleRandomPaused(a);
			}else{
				this.setCounter(a);
			}
		},
		processPlaylistRequest:function(id) {
			this._playlistSelect = false;//reset
			if(this._randomPlay){
				this._playlistSelect = true;
				this._lastPlayedFromPlaylistClick = id;//always remember last played on each click.
				if(!this._randomPaused){
					this._lastRandomCounter = this._counter;
					//console.log("memory = " + _lastRandomCounter);
					this._randomPaused = true;//this needs to stay until random play comes back again! So that the above reference to last random counter doesnt get lost. (if we constantly clicking playlist)
				}
			}
			this.setCounter(id, false);
		},
		getLastInOrder:function() {
			return this._lastInOrder;
		},
		getRandomPaused:function() {
			return this._randomPaused;
		},
		setPlaylistItems:function(val, resetCounter) {
			if(typeof resetCounter === 'undefined') resetCounter = true;
			if(resetCounter)this._counter = -1;
			this._playlistItems = val;
			if(this._randomPlay) this._makeRandomList();
		},
		reSetCounter:function(num) {
			if(typeof num === 'undefined'){
				 this._counter = -1;
			}else{//set counter to specific number
				var n = parseInt(num,10);
				if(this._playlistItems){
					if(n > this._playlistItems - 1){
						n = this._playlistItems - 1;
					}else if(n < 0){
						n = 0;
					}
					this._counter = n;
				}else{
					this._counter = -1;
				}
			}
		},
		setRandom:function(val) {
			this._randomPlay = val;
			if(this._randomPlay) this._makeRandomList();
			this._randomChange();
		},
		setLooping:function(val) {
			this._loopingOn = val;
		},
		
		//******PRIVATE
		//exiting _randomPaused and going back to random mode
		_handleRandomPaused:function(a) {
			//this is just an exit out of _randomPaused (because of a playlist click) and back to random again
			//console.log("handleRandomPaused");
			//console.log("_lastRandomCounter ", _lastRandomCounter);
			var self = $(this);
			this._randomPaused = false;//reset before because of the getCounter()
			
			if(this._lastRandomCounter + a > this._playlistItems - 1){
				this._counter = this._playlistItems - 1;
				//trace("end");
				self.trigger('ap_PlaylistManager.COUNTER_READY');
				return;
			} else if( this._lastRandomCounter + a < 0){
				this._counter = 0;
				//trace("beginning");
				self.trigger('ap_PlaylistManager.COUNTER_READY');
				return;
			}
			this.setCounter(this._lastRandomCounter + a, false);
		},
		_randomChange:function() {//when random is turned on / off
			//console.log('randomChange');
			if(this._randomPlay){
				this._activeIndexFirst();
				this._counter = 0;//we have to do it like this, because with (setCounter(0, false)) media starts to play from the beginning if its already playing. (when random requested)
				//we need to say this on the every beginning of random to redirect the counter from wherever the currently is to 0, so that it becomes first index in randomArr. (after we have moved active index to beginning of randomArr)
				
			}else{
				//we are not going through setCounter here because its just getting out of random mode, and its not changing counter, it just stays where it is (playing or not)
				if(this._randomPaused){
					this._counter = this._lastPlayedFromPlaylistClick;
					this._randomPaused = false;//when random mode stops _randomPaused stops also.
				}else{
					this._counter = this._randomArr[this._counter];//when we turn off random we need to set counter to the value of the current counter in randomArr, so if the counter is 1, and thats value 3 in randomArr for example, we want the active counter to stay 3, not 1, and next to go to 4, not 2.
				}
			}
		},
		_checkCounter:function() {
			//console.log('_checkCounter');
			if(isNaN(this._counter)){
				alert('ap_PlaylistManager message: No active media, counter = ' + this._counter);
				return;
			}
			//reset
			var self = $(this);
			this._lastInOrder = false;
			
			if(this._loopingOn){
				if(this._randomPlay){
					
					if(this._counter > this._playlistItems - 1){//moving fowards
						this._counter = this._randomArr[ this._playlistItems - 1];//remember counter for comparison
						this._makeRandomList();
						this._firstIndexCheck();
						this._counter = 0;
						self.trigger('ap_PlaylistManager.PLAYLIST_END');
						
					}else if(this._counter < 0){//moving backwards
						this._counter = this._randomArr[0];//remember counter for comparison
						this._makeRandomList();
						this._lastIndexCheck();
						this._counter = this._playlistItems - 1;
					}
					
				}else{//random off
					if(this._counter > this._playlistItems - 1){
						this._counter = 0;
						self.trigger('ap_PlaylistManager.PLAYLIST_END');
					}else if( this._counter < 0){
						this._counter = this._playlistItems - 1;
					}
				}
				
				self.trigger('ap_PlaylistManager.COUNTER_READY');
				
			}else{//looping off
				
				if(this._counter > this._playlistItems - 1){
					this._counter = this._playlistItems - 1;
					this._lastInOrder = true;//last item
					//console.log("last item");
				}else if(this._counter < 0){
					this._counter = 0;
					//console.log("first item");
				}
				
				if(!this._lastInOrder){
					self.trigger('ap_PlaylistManager.COUNTER_READY');
				}else{
					self.trigger('ap_PlaylistManager.PLAYLIST_END');
				}
			}
			
		},
		//make random set of numbers
		_makeRandomList:function() {
			if(this._playlistItems < 3) return;
			this._randomArr = this._randomiseIndex(this._playlistItems);
			//console.log('_randomArr = ', this._randomArr);
		},
		_firstIndexCheck:function() {
			//we need to check that first item in newly generated random array isnt equal to last active item.
			if(this._randomArr[0] == this._counter){//if yes, put it at the last place in array.
				var i = this._randomArr.splice(0,1);
				this._randomArr.push(i);
				//console.log("firstIndexCheck " + _randomArr);
			}
		},
		_lastIndexCheck:function() {
			if(this._randomArr[this._playlistItems - 1] == this._counter){//if yes, put it at the first place in array.
				var i = this._randomArr.splice(this._playlistItems - 1,1);
				this._randomArr.unshift(i);
				//console.log("lastIndexCheck " + _randomArr);
			}
		},
		_activeIndexFirst:function() {//when going into random (playing or not) put currently active index on the first place of random array.
			//console.log("activeIndexFirst");
			var i,len = this._randomArr.length, j;
			
			for(i = 0; i < len; i++){
				
				if(this._randomArr[i] == this._counter){
					if(i == 0){//if its already on the first place no need for action.
						break;
					}
					j = this._randomArr.splice(i,1);
					//console.log('_randomArr = ', this._randomArr);
					//console.log(i,j);
					this._randomArr.unshift(parseInt(j,10));
					break;
				}
			}
			//console.log(this._randomArr);
		},
		_randomiseIndex:function(num) {
			var arr = [],randomArr = [],i;
			
			for (i = 0; i < num; i++) {//first fill the ordered set of indexes
				arr[i] = i;
			}
			
			var j, randomIndex;
			for (j = 0; j < num; j++) { //then randomize those indexes
				randomIndex = Math.round(Math.random()*(arr.length-1));
				randomArr[j] = arr[randomIndex];
				arr.splice(randomIndex, 1);
			}
			return randomArr;
		}

	}


})(jQuery);	


(function($) {

apTextScroller = function() {
	
	var _textField;
	var _scrolingSpeed;//speed which text moves (its enter frame based)
	var _mask;
	var _spaceString;//text inbetween main text
	var _oneLength;
	var _direction;
	var scrollInterval = 100;
	var scrollIntervalID;
	var scrollValue=0;
	var fontMeasure;
	var originalString, originalStringSize, scrollString;
	var _inited=false;
	
	//**************** CONSTRUCTOR
	
	this.init = function(fm, txt, mask, direction, spaceString, scrolingSpeed){
		fontMeasure=fm;
		_textField=txt;
		_mask = mask;
		_direction=direction;
		_spaceString=spaceString;
		_scrolingSpeed=scrolingSpeed;
	}	
	
	//**************** PUBLIC
	
	this.input = function(s) {
		//console.log('s = ', s);
		
		originalString = s;
		
		fontMeasure.html(s);
		originalStringSize=fontMeasure.width();
		//var w = fontMeasure.width();
		//var h = fontMeasure.height();
		
		var noSpace = s.replace(/\s/g, '&nbsp;');
		//console.log(noSpace);
		var t=noSpace + _spaceString;
		//console.log(t);
		
		_textField.html('');//reset
		_textField.css('width', 'auto');
		_textField.html(t);
		_oneLength=_textField.width();
		//console.log('_oneLength = ', _oneLength);
		if(_oneLength == 0) return;
		var size;
		var z=t;
		//we need to append so many times that its at least 2 oneLength's long.
		if (_oneLength <= _mask.width() * 2) {
			//trace(visibleSpace * 2 / oneLength);
			var limit=Math.floor(_mask.width() * 2 / _oneLength);///we lower it down because we already have one text inside.
			//console.log('limit = ', limit);
			for (var i=0; i < limit; i++) {
				z+=t;
			}
			size=_oneLength*(limit+1);
		} else {//the above loop didnt handle case if text is longer than visibleSpace * 2!,   then it wouldnt be copied at all and it still need to be copied once.
			z+=t;
			size=_oneLength*2;
		}
		_textField.html(z);
		_textField.css('width', size+1+'px');
		scrollString=z;

		/*if(_direction == "right"){//reverse words
		
		
		}*/
		
		_inited=true;
	}
	
	this.inputSingle = function(s) {
		//_textField.text = s;
		//_textField.x = 0;
	}
	
	this.activate = function() {
		//console.log('activate');
		this.deactivate();
		//console.log(_mask.width());
		if(_mask.width() >= originalStringSize){
			_textField.html(originalString);
		}else{
			_textField.html(scrollString);
			scrollIntervalID = setInterval(scrollText, scrollInterval);	
		}
	}
	
	this.deactivate = function() {
		//console.log('deactivate');
		if(scrollIntervalID) clearInterval(scrollIntervalID);
		if(_direction == "left"){//reset
			_textField.css('left', 0+'px');
			scrollValue=0;
		}
	}
	
	this.checkSize = function() {
		if(!_inited)return;
		//console.log(_mask.width(), originalStringSize);
		if(_mask.width() >= originalStringSize){
			this.deactivate();
			_textField.html(originalString);
		}else{
			_textField.html(scrollString);
			this.activate();
		}
	}
		
	//**************** PRIVATE
	
	function scrollText() {
		if (_direction == "left") {
			scrollValue -= _scrolingSpeed;
			//console.log(scrollValue);
			_textField.css('left', scrollValue+'px');
			if(parseInt(_textField.css('left'),10) < -_oneLength) {
				scrollValue=-_scrolingSpeed;//reset
			}
		} else {
			/*_textField.x+= _scrolingSpeed;
			if (_textField.x > 0) {
				_textField.x=- _oneLength + _scrolingSpeed;// because it should accomodate for the shift
			}*/
		}
	}
}

})(jQuery);