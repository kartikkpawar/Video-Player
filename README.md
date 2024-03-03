# Video player

**Live link:- [Click Here](https://kaleidoscopic-faun-0f2f0f.netlify.app/)**
**Lighthouse Score:- [View Here](https://kaleidoscopic-faun-0f2f0f.netlify.app/lighthouse)**

# Features

- Traverse within playlist
- OnClick to load the selected video
- Play / Pause
- Seekbar
- Volume Controls (on keybindings)
- Forward / Reverse video by 10s (on keybindings)
- Video time
- Fullscreen mode
- Video to continue from where it was left last time.
- Playlist Search
- Drag and Drop for re-ordering of the playlist
- **All player related features are built in-house no 3rd party lib used**
- Action Messages
- And all other mentioned required features

## Keyboard Shorcuts

- **SPACEBAR** - Play/Pause video
- **RIGHT_ARROW & LEFT_ARROW** - Forward / Reverse Video by 10s
- **F** - Enter / Exit Fullscreen mode
- **ARROW_UP & ARROW_DOWN** - Increase / Descrease Volume
- **M** - Mute / Unmute Video
- **\> & <** - Increase / Descrease video playback speed by **0.25 MIN - 0.25 & MAX - 2**
- **SHIFT + N** -Traverse to next video in the playlist
- **SHIFT + P** - Traverse to previous video in the playlist
- **ESC** - To exit Fullscreen

## Project Structure

- App.js entry point
- VideoPlayer.jsx - Manages all the functionality related to video player
- VideoList.jsx and VideoTile.jsx - Responsible for showing playlist
- PlayerContext.jsx - Manages state across the app
