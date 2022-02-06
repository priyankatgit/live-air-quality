# Real time [Live Air Quality Index tracker](https://live-air-quality.vercel.app/)
[https://live-air-quality.vercel.app/](https://live-air-quality.vercel.app/)

### App is made using the React and hosted on [Vercel](https://vercel.com/). App data is updated real-time using websocket connection.

#### Other libraries:

- [Ant](https://ant.design/) UI library used for basic layout and list component.
- [Ant-Chat](https://charts.ant.design/en) used for the chat component.
  <br />

| What is done?| Approx taken time(Hours) |
|--------------|:-----:|
| Live feed city wise table to show AQI. Filter and sorting added over AQI category |  4 |
| Live chart added which includes all cities feed update. |  2 |
| History dialog added to view city wise past data.| 1 |
| Data provider(AQIDataService.js) including Websocket failure handling and mimic live updates using fake data emitter.| 4 |
| Added on git and deployed on vercel.| 2 | 
 

## App Structure

components folder contains all UI the components to build app. `service/AQIDataService.js` works to provide data to the app.

- `AQI.js`
  - It's root components contains two other elements `AQIChart` and `AQIList`.
  - Handles and manipulates AQI data received from `AQIDataService.js` and passes to the chat and list components.
- `AQIDataService.js`

  - Subscribes to the websocket and emits data to the AQI component.
  - websocket.onmessage event is triggering with high intensity. In orders to keep app performant, random throttling added to the callback function.

  ```javascript
  function throttle(func, arg) {
    isCallbackInCallStack = true;
    let rand = Math.round(Math.random() * 5);
    clearTimeout(throttleTimerID);
    throttleTimerID = setTimeout(() => {
      try {
        func(arg);
      } finally {
        isCallbackInCallStack = false;
      }
    }, rand * 1000);
  }

  webSocket.onmessage = function (event) {
    if (isCallbackInCallStack || isSocketErrorStarts) return;

    const data = Array.isArray(event.data)
      ? event.data
      : JSON.parse(event.data);

    /*
          onmessage event is triggering with high intensity. 
          In orders to keep app performant, random throttling added to the callback function.
          */
    throttle(callback, data);
  };
  ```

  - After certain time connection starts throwing an error "Insufficient resource". To handle failure, fakeEmitter function is used as workaround which looks like live updates.

  ```javascript
      function* getFakeAQIData() {
          ...
          ...
          for (let i = 0; ; i++) {
              if (i === aqiDummyData.length) i = 0;
              yield aqiDummyData[i];
          }
      }

      function fakeEmitter(callback) {
      const dataGen = getFakeAQIData();

      (function loop() {
          let rand = Math.round(Math.random() * 10);
          setTimeout(() => {
              callback(dataGen.next().value);
              console.log(`Delayed ${rand} secs`);
              loop();
              }, rand * 1000);
          })();
      }
  ```
