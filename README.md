# tv-shows-file-renamer

CLI tool to automatically rename and group files for TV series.

Main functionality:

- Extract series metadata from [thetvdb.com](thetvdb.com) API.
- Group episodes by Season folders.
- Automatically change subtitles encoding to UTF-8 from specified encoding.
- Build filenames which are easily recognizable by [Plex](https://www.plex.tv/) mediaserver

So, if you have bunch of files named like this:

```
🎬 150.mkv
📝 150.eng.srt
🎬 S09E11 - ONEPIECE - 153.mkv
🎬 [CoolSubsTeam] - 196 - OnePiece.mkv
```

The tool provides a fast way to get this:

```
📁 Season 09
    🎬 S09E007 - 150 - Dreams Don't Come True! Bellamy vs. The Saruyama Alliance.mkv
    📝 S09E007 - 150 - Dreams Don't Come True! Bellamy vs. The Saruyama Alliance.eng.srt
    🎬 S09E010 - 153 - This is the Sea of the Sky! The Knight of the Sky and Heaven's Gate.mkv
📁 Season 10
    🎬 S10E001 - 196 - Emergency Announcement! An Infamous Pirate Ship has Invaded!.mkv
```
### Prerequisites
This tool is built with [NodeJS](https://nodejs.org/en/), so it should be installed in your system.
* NodeJS at least `v8.5.0`
* NPM at least `5.3.0`

### Installation

```
npm i -g tv-shows-file-renamer
```

### Usage

Just call it in folder with your series and specify parameters

```
tv-shows-file-renamer -s one-piece
```

Commandline parameters:

| Key | Value                 | Description                                                                                                                                                                                                                                                                         | Example        |
| --- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| -s  | serie identificator   | This is a serie identificator used by [thetvdb.com](thetvdb.com) API. To get it you need to locate you serie on the [thetvdb.com](thetvdb.com) website and copy part of URL. <br/> For example for this url: `https://www.thetvdb.com/series/one-piece` the serie id is `one-piece` | `-s one-piece` |
| -d  | dry run mode          | You can check expected output but without actual performing any operations on disk. Useful when you are not sure about whether metadata are correct.                                                                                                                                | `-d`           |
| -m  | only extract metadata | Does not perform any operations with you series, only downloads metadata for given serie from [thetvdb.com](thetvdb.com) API and saves that to `META.json` file.                                                                                                                    | `-m`           |
| -e  | encode subtitles      | Performs re-encoding of `*.srt` files from specified encoding to **UTF-8**                                                                                                                                                                                                          | `-e cp1251`    |

Please use it on your own risk, if you are not sure please make backup of your data first!


Licence: [MIT](https://opensource.org/licenses/MIT)
