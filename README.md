# Infoscreen

This is a project for personal use. An infoscreen that shows:
- time
- weather & weather radar
- news
- calendar
- the next departures for bus and tram

## Requirements
The code in this repository is fine for me but to use it for yourself you need to change **at least** these things:

### secrets.json
This file needs to be placed in the root of the repository. 
It holds the secrets that are needed to connect to some services like the Google calendar.
You can see how some of the sections are structures by having a look in `src/lib/interfaces.ts`.
But you probably will need to change it anyways to your needs.

### Custom images
The submodule for custom images linked in this repository is and will stay private.
You can just create a folder and provide your own images. 
The folder must contain a `bg` folder where your background images are stored and a `sleep.gif`.
You probably will need to change `src/styles/global.css` to provide the correct path to the image used in night mode.

### Other stuff
To use other sites for news or other calendar providers you need to change them in the code yourself.
If you know what you're doing it should be pretty straight forward.

## Building
This project uses the Gatsby framework and can be build via CLI (`npm run build` && `npm run serve`) or Docker.

## Licencing
- Weather icons from [erikflowers/weather-icons](https://github.com/erikflowers/weather-icons) are licensed under [SIL OFL 1.1](http://scripts.sil.org/OFL).
- This project is licensed under [GPL v3.0](https://www.gnu.org/licenses/gpl-3.0.de.html).