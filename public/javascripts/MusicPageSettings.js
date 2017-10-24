
// SETTINGS

var hap_settings = {
	/* sound_id: unique string for player identification (if multiple player instances were used, then strings need to be different!) */
	sound_id: 'full2a',

	/* playlistList: dom elements which holds list of playlists */
	playlistList: '#playlist_list',
	/* activePlaylist: set active playlist that will be loaded on beginning.
	param1: hidden (boolean) true/false (visible/hidden playlist)
	param2: id (pass element 'id' from the dom)
	Leave empty for no playlist loaded at start like this: activePlaylist: '' */
	activePlaylist: {hidden: false, id: '#playlist1'},
	/* activeItem: active item to start with when playlist is loaded (0 = first, 1 = second, 2 = third... -1 = none) */
	activeItem: 0,

	/* autoOpenPlayerInPopup: true/false. Auto open player in popup (removes player in parent window when player in popup opens) */
	autoOpenPlayerInPopup: false,
	/* autoUpdateWindowData: true/false. Auto update data between parent window and popup window (current (last) playlist, active item, last volume) */
	autoUpdateWindowData: true,

	/* soundcloudApiKey: If you want to use SoundCloud music, register you own api key here for free:
	'http://soundcloud.com/you/apps/new' and enter Client ID */
	soundcloudApiKey: '',
	/* soundcloud_result_limit: max number of results to retrieve from soundcloud. BEWARE! Some results may contain thousands of songs so keep this in mind!! */
	soundcloud_result_limit: 4,

	/* podcast_result_limit: max number of results to retrieve from podcast. 250 = max possible results by google api feed. */
	podcast_result_limit: 3,

	/*defaultVolume: 0-1 (Irrelevant on ios mobile) */
	defaultVolume:0.5,
	/*autoPlay: true/false (false on mobile by default) */
	autoPlay:false,
	/*autoLoad: auto/metadata/none (auto start sound load) */
	autoLoad:'auto',
	/*randomPlay: true/false */
	randomPlay:false,
	/*loopingOn: true/false (loop on the end of the playlist) */
	loopingOn:true,

	/* usePlaylistRollovers: true/false. Use rollovers on playlist items (mouseenter, mouseleave + callbacks) */
	usePlaylistRollovers: false,
	/* playlistItemContent: title/thumb/all. Auto create titles or thumbnails in playlist items, or both. */
	playlistItemContent: 'title',
	/* useNumbersInPlaylist: true/false. Prepend numbers in playlist items. */
	useNumbersInPlaylist: true,
	/* titleSeparator: String to append between song number and title. */
	titleSeparator: '.&nbsp;',

	/* autoSetSongTitle: true/false. Auto set song title in 'player_mediaName'. */
	autoSetSongTitle: true,

	/* useSongNameScroll: true/false. Use song name scrolling. */
	useSongNameScroll: true,
	/* scrollSpeed: speed of the scroll (number higher than zero). */
	scrollSpeed: 1,
	/* scrollSeparator: String to append between scrolling song name. */
	scrollSeparator: '&nbsp;&#42;&#42;&#42;&nbsp;',

	/* mediaTimeSeparator: String between current and total song time. */
	mediaTimeSeparator: '&nbsp;-&nbsp;',

	/* useVolumeTooltip: true/false. use tooltip over volume seekbar */
	useVolumeTooltip: true,

	/* useSeekbarTooltip: true/false. use tooltip over progress seekbar */
	useSeekbarTooltip: true,
	/* seekTooltipSeparator: String between current and total song position, for progress tooltip. */
	seekTooltipSeparator: '&nbsp;/&nbsp;',

	/* defaultArtistData: Default text for song media name. */
	defaultArtistData: 'Artist&nbsp;Name&nbsp;-&nbsp;Artist&nbsp;Title',

	/* useBtnRollovers: true/false. Use rollovers on buttons */
	useBtnRollovers: true,
	/* buttonsUrl: url of the buttons for normal and rollover state */
	buttonsUrl: {prev: '/images/icons/set1/prev.png', prevOn: '/images/icons/set1/prev_on.png',
				 next: '/images/icons/set1/next.png', nextOn: '/images/icons/set1/next_on.png',
				 pause: '/images/icons/set1/pause.png', pauseOn: '/images/icons/set1/pause_on.png',
				 play: '/images/icons/set1/play.png', playOn: '/images/icons/set1/play_on.png',
				 volume: '/images/icons/set1/volume.png', volumeOn: '/images/icons/set1/volume_on.png',
				 mute: '/images/icons/set1/mute.png', muteOn: '/images/icons/set1/mute_on.png',
				 download: '/images/icons/set1/download.png', downloadOn: '/images/icons/set1/download_on.png',
				 loop: '/images/icons/set1/loop.png', loopOn: '/images/icons/set1/loop_on.png',
				 shuffle: '/images/icons/set1/shuffle.png', shuffleOn: '/images/icons/set1/shuffle_on.png',
				 trackUrlIcon: '/images/icons/url.png',
				 trackDownloadIcon: '/images/icons/dlink.png',
				 trackRemoveIcon: '/images/icons/remove.png',
				 link_play: '/images/icons/link_play.png', link_pause: '/images/icons/link_pause.png'},

	/* useAlertMessaging: true/false. Alert error messages to user */
	useAlertMessaging: true,

	/* activatePlaylistScroll: true/false. activate jScrollPane. */
	activatePlaylistScroll: true,
	/* playlistScrollOrientation: vertical/horizontal. */
	playlistScrollOrientation: 'vertical',

	/* sortablePlaylistItems: true/false. Make playlist items sortable */
	sortablePlaylistItems: true,
	/* useRemoveBtnInTracks: true/false. Create remove buttons in playlist items for removing tracks. */
	useRemoveBtnInTracks: false,

	/* autoReuseMailForDownload: true/false. download backup for ios, save email after client first enters email address and auto send all emails to the same address */
	autoReuseMailForDownload: true,

	/* useKeyboardNavigation: false/false. Use keyboard navigation for music (space=toggle audio, left arrow=previous media, right arrow=next media, m=toggle volume) */
	useKeyboardNavigation: false,

	/* getTrackInfoFromID3: false/false. Get track info from id3 tags (title, artist, album, artwork) */
	getTrackInfoFromID3: false
};


var hap_settings2 = {
	/* sound_id: unique string for player identification (if multiple player instances were used, then strings need to be different!) */
	sound_id: 'full2b',

	/* playlistList: dom elements which holds list of playlists */
	playlistList: '#playlist_list',
	/* activePlaylist: set active playlist that will be loaded on beginning.
	param1: hidden (boolean) true/false (visible/hidden playlist)
	param2: id (pass element 'id' from the dom)
	Leave empty for no playlist loaded at start like this: activePlaylist: '' */
	activePlaylist: {hidden: false, id: '#playlist2'},
	/* activeItem: active item to start with when playlist is loaded (0 = first, 1 = second, 2 = third... -1 = none) */
	activeItem: 0,

	/* autoOpenPlayerInPopup: true/false. Auto open player in popup (removes player in parent window when player in popup opens) */
	autoOpenPlayerInPopup: false,
	/* autoUpdateWindowData: true/false. Auto update data between parent window and popup window (current (last) playlist, active item, last volume) */
	autoUpdateWindowData: true,

	/* soundcloudApiKey: If you want to use SoundCloud music, register you own api key here for free:
	'http://soundcloud.com/you/apps/new' and enter Client ID */
	soundcloudApiKey: '',
	/* soundcloud_result_limit: max number of results to retrieve from soundcloud. BEWARE! Some results may contain thousands of songs so keep this in mind!! */
	soundcloud_result_limit: 4,

	/* podcast_result_limit: max number of results to retrieve from podcast. 250 = max possible results by google api feed. */
	podcast_result_limit: 3,

	/*defaultVolume: 0-1 (Irrelevant on ios mobile) */
	defaultVolume:0.5,
	/*autoPlay: true/false (false on mobile by default) */
	autoPlay:false,
	/*autoLoad: auto/metadata/none (auto start sound load) */
	autoLoad:'auto',
	/*randomPlay: true/false */
	randomPlay:false,
	/*loopingOn: true/false (loop on the end of the playlist) */
	loopingOn:true,

	/* usePlaylistRollovers: true/false. Use rollovers on playlist items (mouseenter, mouseleave + callbacks) */
	usePlaylistRollovers: false,
	/* playlistItemContent: title/thumb/all. Auto create titles or thumbnails in playlist items, or both. */
	playlistItemContent: 'title',
	/* useNumbersInPlaylist: true/false. Prepend numbers in playlist items. */
	useNumbersInPlaylist: true,
	/* titleSeparator: String to append between song number and title. */
	titleSeparator: '.&nbsp;',

	/* autoSetSongTitle: true/false. Auto set song title in 'player_mediaName'. */
	autoSetSongTitle: true,

	/* useSongNameScroll: true/false. Use song name scrolling. */
	useSongNameScroll: true,
	/* scrollSpeed: speed of the scroll (number higher than zero). */
	scrollSpeed: 1,
	/* scrollSeparator: String to append between scrolling song name. */
	scrollSeparator: '&nbsp;&#42;&#42;&#42;&nbsp;',

	/* mediaTimeSeparator: String between current and total song time. */
	mediaTimeSeparator: '&nbsp;-&nbsp;',

	/* useVolumeTooltip: true/false. use tooltip over volume seekbar */
	useVolumeTooltip: true,

	/* useSeekbarTooltip: true/false. use tooltip over progress seekbar */
	useSeekbarTooltip: true,
	/* seekTooltipSeparator: String between current and total song position, for progress tooltip. */
	seekTooltipSeparator: '&nbsp;/&nbsp;',

	/* defaultArtistData: Default text for song media name. */
	defaultArtistData: 'Artist&nbsp;Name&nbsp;-&nbsp;Artist&nbsp;Title',

	/* useBtnRollovers: true/false. Use rollovers on buttons */
	useBtnRollovers: true,
	/* buttonsUrl: url of the buttons for normal and rollover state */
	buttonsUrl: {prev: '/images/icons/set1/prev.png', prevOn: '/images/icons/set1/prev_on.png',
				 next: '/images/icons/set1/next.png', nextOn: '/images/icons/set1/next_on.png',
				 pause: '/images/icons/set1/pause.png', pauseOn: '/images/icons/set1/pause_on.png',
				 play: '/images/icons/set1/play.png', playOn: '/images/icons/set1/play_on.png',
				 volume: '/images/icons/set1/volume.png', volumeOn: '/images/icons/set1/volume_on.png',
				 mute: '/images/icons/set1/mute.png', muteOn: '/images/icons/set1/mute_on.png',
				 download: '/images/icons/set1/download.png', downloadOn: '/images/icons/set1/download_on.png',
				 loop: '/images/icons/set1/loop.png', loopOn: '/images/icons/set1/loop_on.png',
				 shuffle: '/images/icons/set1/shuffle.png', shuffleOn: '/images/icons/set1/shuffle_on.png',
				 trackUrlIcon: '/images/icons/url.png',
				 trackDownloadIcon: '/images/icons/dlink.png',
				 trackRemoveIcon: '/images/icons/remove.png',
				 link_play: '/images/icons/link_play.png', link_pause: '/images/icons/link_pause.png'},

	/* useAlertMessaging: true/false. Alert error messages to user */
	useAlertMessaging: true,

	/* activatePlaylistScroll: true/false. activate jScrollPane. */
	activatePlaylistScroll: true,
	/* playlistScrollOrientation: vertical/horizontal. */
	playlistScrollOrientation: 'vertical',

	/* sortablePlaylistItems: true/false. Make playlist items sortable */
	sortablePlaylistItems: true,
	/* useRemoveBtnInTracks: true/false. Create remove buttons in playlist items for removing tracks. */
	useRemoveBtnInTracks: false,

	/* autoReuseMailForDownload: true/false. download backup for ios, save email after client first enters email address and auto send all emails to the same address */
	autoReuseMailForDownload: true,

	/* useKeyboardNavigation: false/false. Use keyboard navigation for music (space=toggle audio, left arrow=previous media, right arrow=next media, m=toggle volume) */
	useKeyboardNavigation: false,

	/* getTrackInfoFromID3: false/false. Get track info from id3 tags (title, artist, album, artwork) */
	getTrackInfoFromID3: false
};

var hap_settings3 = {
	/* sound_id: unique string for player identification (if multiple player instances were used, then strings need to be different!) */
	sound_id: 'full3b',

	/* playlistList: dom elements which holds list of playlists */
	playlistList: '#playlist_list',
	/* activePlaylist: set active playlist that will be loaded on beginning.
	param1: hidden (boolean) true/false (visible/hidden playlist)
	param2: id (pass element 'id' from the dom)
	Leave empty for no playlist loaded at start like this: activePlaylist: '' */
	activePlaylist: {hidden: false, id: '#playlist3'},
	/* activeItem: active item to start with when playlist is loaded (0 = first, 1 = second, 2 = third... -1 = none) */
	activeItem: 0,

	/* autoOpenPlayerInPopup: true/false. Auto open player in popup (removes player in parent window when player in popup opens) */
	autoOpenPlayerInPopup: false,
	/* autoUpdateWindowData: true/false. Auto update data between parent window and popup window (current (last) playlist, active item, last volume) */
	autoUpdateWindowData: true,

	/* soundcloudApiKey: If you want to use SoundCloud music, register you own api key here for free:
	'http://soundcloud.com/you/apps/new' and enter Client ID */
	soundcloudApiKey: '',
	/* soundcloud_result_limit: max number of results to retrieve from soundcloud. BEWARE! Some results may contain thousands of songs so keep this in mind!! */
	soundcloud_result_limit: 4,

	/* podcast_result_limit: max number of results to retrieve from podcast. 250 = max possible results by google api feed. */
	podcast_result_limit: 3,

	/*defaultVolume: 0-1 (Irrelevant on ios mobile) */
	defaultVolume:0.5,
	/*autoPlay: true/false (false on mobile by default) */
	autoPlay:false,
	/*autoLoad: auto/metadata/none (auto start sound load) */
	autoLoad:'auto',
	/*randomPlay: true/false */
	randomPlay:false,
	/*loopingOn: true/false (loop on the end of the playlist) */
	loopingOn:true,

	/* usePlaylistRollovers: true/false. Use rollovers on playlist items (mouseenter, mouseleave + callbacks) */
	usePlaylistRollovers: false,
	/* playlistItemContent: title/thumb/all. Auto create titles or thumbnails in playlist items, or both. */
	playlistItemContent: 'title',
	/* useNumbersInPlaylist: true/false. Prepend numbers in playlist items. */
	useNumbersInPlaylist: true,
	/* titleSeparator: String to append between song number and title. */
	titleSeparator: '.&nbsp;',

	/* autoSetSongTitle: true/false. Auto set song title in 'player_mediaName'. */
	autoSetSongTitle: true,

	/* useSongNameScroll: true/false. Use song name scrolling. */
	useSongNameScroll: true,
	/* scrollSpeed: speed of the scroll (number higher than zero). */
	scrollSpeed: 1,
	/* scrollSeparator: String to append between scrolling song name. */
	scrollSeparator: '&nbsp;&#42;&#42;&#42;&nbsp;',

	/* mediaTimeSeparator: String between current and total song time. */
	mediaTimeSeparator: '&nbsp;-&nbsp;',

	/* useVolumeTooltip: true/false. use tooltip over volume seekbar */
	useVolumeTooltip: true,

	/* useSeekbarTooltip: true/false. use tooltip over progress seekbar */
	useSeekbarTooltip: true,
	/* seekTooltipSeparator: String between current and total song position, for progress tooltip. */
	seekTooltipSeparator: '&nbsp;/&nbsp;',

	/* defaultArtistData: Default text for song media name. */
	defaultArtistData: 'Artist&nbsp;Name&nbsp;-&nbsp;Artist&nbsp;Title',

	/* useBtnRollovers: true/false. Use rollovers on buttons */
	useBtnRollovers: true,
	/* buttonsUrl: url of the buttons for normal and rollover state */
	buttonsUrl: {prev: '/images/icons/set1/prev.png', prevOn: '/images/icons/set1/prev_on.png',
				 next: '/images/icons/set1/next.png', nextOn: '/images/icons/set1/next_on.png',
				 pause: '/images/icons/set1/pause.png', pauseOn: '/images/icons/set1/pause_on.png',
				 play: '/images/icons/set1/play.png', playOn: '/images/icons/set1/play_on.png',
				 volume: '/images/icons/set1/volume.png', volumeOn: '/images/icons/set1/volume_on.png',
				 mute: '/images/icons/set1/mute.png', muteOn: '/images/icons/set1/mute_on.png',
				 download: '/images/icons/set1/download.png', downloadOn: '/images/icons/set1/download_on.png',
				 loop: '/images/icons/set1/loop.png', loopOn: '/images/icons/set1/loop_on.png',
				 shuffle: '/images/icons/set1/shuffle.png', shuffleOn: '/images/icons/set1/shuffle_on.png',
				 trackUrlIcon: '/images/icons/url.png',
				 trackDownloadIcon: '/images/icons/dlink.png',
				 trackRemoveIcon: '/images/icons/remove.png',
				 link_play: '/images/icons/link_play.png', link_pause: '/images/icons/link_pause.png'},

	/* useAlertMessaging: true/false. Alert error messages to user */
	useAlertMessaging: true,

	/* activatePlaylistScroll: true/false. activate jScrollPane. */
	activatePlaylistScroll: true,
	/* playlistScrollOrientation: vertical/horizontal. */
	playlistScrollOrientation: 'vertical',

	/* sortablePlaylistItems: true/false. Make playlist items sortable */
	sortablePlaylistItems: false,
	/* useRemoveBtnInTracks: true/false. Create remove buttons in playlist items for removing tracks. */
	useRemoveBtnInTracks: false,

	/* autoReuseMailForDownload: true/false. download backup for ios, save email after client first enters email address and auto send all emails to the same address */
	autoReuseMailForDownload: true,

	/* useKeyboardNavigation: false/false. Use keyboard navigation for music (space=toggle audio, left arrow=previous media, right arrow=next media, m=toggle volume) */
	useKeyboardNavigation: true,

	/* getTrackInfoFromID3: false/false. Get track info from id3 tags (title, artist, album, artwork) */
	getTrackInfoFromID3: false
};


/* START PLAYER INIT */

var hap_group = 'classic_api2', hap_player1, hap_player2, hap_player3, hap_players = [hap_player1, hap_player2, hap_player3], soundArr;
jQuery(document).ready(function($) {

	//init component
	hap_players[0] = $('#componentWrapper').html5audio(hap_settings);
	hap_players[1] = $('#componentWrapper2').html5audio(hap_settings2);
	hap_players[2] = $('#componentWrapper3').html5audio(hap_settings3);

	//sound array for controlling multiple sound instances (pause one when other starts)
	soundArr = [{player_id: hap_players[0], sound_id: 'full2a'},
				{player_id: hap_players[1], sound_id: 'full2b'},
				{player_id: hap_players[2], sound_id: 'full3b'}];
});

/* END PLAYER INIT */