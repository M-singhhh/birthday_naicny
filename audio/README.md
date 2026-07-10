Drop your music file here and name it `song.mp3`.

That's it — js/music-player.js already looks for `audio/song.mp3` and will
try to autoplay it (softly fading in), with a small floating note button
(bottom-right) as a fallback/toggle if the browser blocks autoplay.

If you want a different filename or an additional format (e.g. .ogg for
older browser support), just update the path in the last line of
js/music-player.js:

    window.musicPlayer = new MusicPlayer('audio/song.mp3');
