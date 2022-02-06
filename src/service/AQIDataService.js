// Generator function to return AQI data sequentially.
function* getFakeAQIData() {
  let aqiDummyData = [
    [
      { city: "Mumbai", aqi: 180.16695392185457 },
      { city: "Bengaluru", aqi: 188.36066593241233 },
      { city: "Hyderabad", aqi: 202.26223247163614 },
      { city: "Indore", aqi: 48.94452493719441 },
      { city: "Chandigarh", aqi: 47.96183655634891 },
      { city: "Lucknow", aqi: 74.3661189722597 },
    ],
    [
      { city: "Mumbai", aqi: 178.49618513995154 },
      { city: "Bengaluru", aqi: 193.5004034410809 },
      { city: "Delhi", aqi: 300.42205948613577 },
      { city: "Chennai", aqi: 142.36520592061868 },
      { city: "Hyderabad", aqi: 198.16876734707213 },
      { city: "Chandigarh", aqi: 44.33806003287792 },
      { city: "Lucknow", aqi: 73.40215410026718 },
    ],
    [
      ({ city: "Mumbai", aqi: 180.44489260086718 },
      { city: "Bengaluru", aqi: 189.58336213192607 },
      { city: "Delhi", aqi: 299.85448889273357 },
      { city: "Kolkata", aqi: 201.66986815637694 },
      { city: "Bhubaneswar", aqi: 101.6354126574218 },
      { city: "Chennai", aqi: 138.5619285566037 },
      { city: "Pune", aqi: 220.27936191199123 },
      { city: "Jaipur", aqi: 138.93871119256576 },
      { city: "Chandigarh", aqi: 48.03062793593334 },
      { city: "Lucknow", aqi: 73.2992729761127 }),
    ],
    [
      { city: "Delhi", aqi: 302.89473391506993 },
      { city: "Bhubaneswar", aqi: 100.91332955537248 },
      { city: "Pune", aqi: 221.0752006909453 },
      { city: "Hyderabad", aqi: 203.1251193149767 },
      { city: "Jaipur", aqi: 142.76306860890892 },
      { city: "Chandigarh", aqi: 44.019711656707464 },
    ],
    [
      { city: "Delhi", aqi: 303.0378360194612 },
      { city: "Kolkata", aqi: 202.51556152746574 },
      { city: "Bhubaneswar", aqi: 98.85912241876034 },
      { city: "Chennai", aqi: 140.92144174316 },
      { city: "Indore", aqi: 48.30269932627987 },
      { city: "Jaipur", aqi: 140.29425077608306 },
      { city: "Lucknow", aqi: 78.77841277656101 },
    ],
    [
      { city: "Mumbai", aqi: 181.694576450154 },
      { city: "Kolkata", aqi: 200.49480597024888 },
      { city: "Pune", aqi: 218.74103491837548 },
      { city: "Jaipur", aqi: 143.07777405516836 },
      { city: "Chandigarh", aqi: 45.31710933306367 },
      { city: "Lucknow", aqi: 73.48805166406977 },
    ],
    [
      { city: "Delhi", aqi: 301.0647466977337 },
      { city: "Chennai", aqi: 139.26042026688 },
      { city: "Pune", aqi: 218.85811846963102 },
      { city: "Hyderabad", aqi: 200.31186064697008 },
      { city: "Lucknow", aqi: 76.90748849658813 },
    ],
    [
      { city: "Mumbai", aqi: 183.17000505358223 },
      { city: "Delhi", aqi: 298.91420369997536 },
      { city: "Kolkata", aqi: 198.68857162156306 },
      { city: "Chennai", aqi: 140.6057190894277 },
      { city: "Pune", aqi: 222.4482353763461 },
      { city: "Jaipur", aqi: 138.58764610055218 },
      { city: "Chandigarh", aqi: 48.683330379272824 },
      { city: "Lucknow", aqi: 74.16959927674833 },
    ],
  ];

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

let webSocket = null;
export default function aqiDataEmitter(callback) {
  if (webSocket) return;

  let isCallbackInCallStack = false;
  let isSocketErrorStarts = false;
  let throttleTimerID = null;

  webSocket = new WebSocket("wss://city-ws.herokuapp.com/");

  /*
     After certain time connection starts throwing an error "Insufficient resource". It could be due to some-kind of throttling.
     fakeEmitter function is used as workaround which looks like live updates.
  */
  webSocket.onerror = (error) => {
    if (isSocketErrorStarts) {
      return;
    }
    isSocketErrorStarts = true;

    fakeEmitter(callback);
  };

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
}
