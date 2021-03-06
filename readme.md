TRT Hybrid Control Panel
------------------------

![Captura de pantalla](https://acmqpw.dm2301.livefilestore.com/y4mh6A37kR59YbMEQCGbQQee1NtKzr4whl1q5w4Fnlf4QSEUW2vheHP6_bgukuvgWm8iK17o6HDpfdLpznhdmj80Z3Bvm6RSp-T9-WPfEQNWpbHSP804o16SW8OIcz21Rx10jyQ8GR2OutHhW-vItGYUXvFXXBVqFE1QdGFveu_H-P9vjndGtgOFx-6E3hRIwMcui25zkYj9ylvVcq1xhnW6A?width=1673&height=871&cropmode=none)

This software connects via serial to a DI-155 dataloger.

This dataloger has this sensors conected:
- A1 -> Pressure sensor 1
- A2 -> Pressure sensor 2
- A3 -> Load cell
- A4 -> Continuity check

The following can be configured in conf.js
- Do1 -> Continuity check trigger
- Do2 -> Ignitor
- Do3 -> Gas electrovalve

The software is capable of checking the continuity, opening and closing the
valve and reading data from all sensors

## How to install

##### Software needed
- 1. Install Node.js from [here](https://nodejs.org/en/download/)
- 2. Drivers: 
  - If you are on windows, install the usb drivers from [here](http://www.dataq.com/145/145usbdriver.EXE)
  - If you are linux, install acm or usbserial

##### Download and install the program
- 3. Download this program with git or as a zip
- 4. Open a console (in windows search for "cmd")
- 5. Navigate to the directory of the project using `cd "C:\path\to your directory\hybrid-control-panel-web"`
- 6. type `npm install` (you'll need internet) (maybe there are some warnings, generally it's safe to ignore them) (`npm run build` will be runned automatically)
- 7. type `npm start`

##### Connect to the program
- 9. Open your favorite browser (chrome is recomended) and go to `localhost:5000`
- 10. The default password is `previsió`. After logging in, you can unlock the other controls by pressing down control. The password can be changed in conf.js

##### Configure
- 11. See conf.js to change the configuration of the software. Some changes may rquire restart of the server or `npm run build` to be executed (or both).

##### Develop and debug
- 12. If debug is needed, add a .env file to the root with the following content:
```
NODE_ENV=development
```
If debug mode is on, the ability to clik `CNTRL+H` in the client will be added. This will display a history of actions. Also, the console errors will now be correctly referenced to the correct file and line.
- 13. Run `npm run watch` to continuosly compile the files. (use `npm run build` to compile the minified and production files)
