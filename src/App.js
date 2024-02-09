import './App.css';
import React, {useState, useEffect} from 'react';
import testTelemetry from "./functions/telemetryFunc";
import TelemetryList from "./component/TelemetryList";
import Loading from "./component/Loading";
import CheckCDN from "./component/CheckCDN";
import IntergrityCheck from "./component/IntegrityCheck";
import IframeComponent from './functions/iframe';

function App() {
  const [appInsights,setappInsights] = useState()
  const [isInitialized,setisInitialized] = useState(false)
  const [sv,setsv] = useState()
  const [ver,setver] = useState()
  const [cookie,setcookie] = useState()
  const [isloading,setisloading] = useState(true)
  const [sentTime, setsentTime] = useState()
  const [sentBuffer,setsentBuffer] = useState("")
  const [istrigger,setistrigger] = useState(false)
  const [response, setResponse] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      let insightOject =  window.appInsights;
      setappInsights(insightOject);
      insightOject.sv? setsv(insightOject.sv):setsv();
      insightOject.version? setver(insightOject.version):setver();
      insightOject.cookie? setcookie(insightOject.cookie):setcookie();
      if(insightOject.appInsights && insightOject.appInsights.core.isInitialized())
      {setisInitialized(true); setisloading(false);}
    }, 1000);
    return () => clearTimeout(timer);
  }, []); 
  
  useEffect(() =>{
    if (!isloading) {
      let notificationManager = appInsights.core.getNotifyMgr() || appInsights.core["_notificationManager"];
      notificationManager.addNotificationListener({ eventsSendRequest: (sendReason, isAsync) => {
            var sentData = sessionStorage.getItem("AI_sentBuffer");
            var newData = sentBuffer+sentData;
            setsentBuffer(newData);}  
    });}
  },[appInsights,sentBuffer,isloading]);

  useEffect(() => {
    if (!isloading) {
      testTelemetry(appInsights);
      setistrigger(true);
    }
    setsentTime(Date().toLocaleString());
  },[isloading,appInsights]);

  const runDemo = () => {
    if (window.sharedStorage) {
      window.sharedStorage.set('third-party-write-demo', "written into third-party storage by third-party code")
      console.log("runDemo written into third-party storage by third-party code")
      const iframe = document.querySelector('iframe');
      iframe.contentWindow.postMessage('run-third-party-write-demo', '*');
    }
  };

  // Function to reset the demo
  const resetDemo = () => {
    if (window.sharedStorage) {
      window.sharedStorage.delete('third-party-write-demo')
      window.parent.postMessage('clear-publisher-data', '*')
      const iframe = document.querySelector('iframe');

      iframe.contentWindow.postMessage('clear-publisher-data', '*');
    }
  };
  return (
 
    <div className="App">
  <div className="demo__buttons-container">
        <button className="mdl-button mdl-js-button mdl-button--raised demo__button" onClick={runDemo}>
          Write to both publisher's and third-party's shared storage
        </button>
        <button className="mdl-button mdl-js-button mdl-button--raised demo__button" onClick={resetDemo}>
          Delete publisher and third-party demo data
        </button>
      </div>
   
      <div className="App-wrapper">
        <p className="testing-title">Application Insights Snippet Testing 1</p>
        <div className="App-body">
        <div className="loading-wrapper">
          <Loading isloading={isloading} isInitialized={isInitialized} sv={sv} ver={ver} cookie={cookie}/>
        </div>
        <div className="switch-list-wrapper">
          {!isloading? <div className="test-tel-title">Telemetry Testing</div>:""}
          {(!isloading && sentTime)? <div className="test-sent-time">Telemetry sent time: {sentTime}</div>:""}
          {istrigger? <TelemetryList res = {sentBuffer}/>:""}
        </div>
        <div className="cdn-status">
          {!isloading? <div className="cdn-title">CDN Status</div>:""}
          {!isloading? <CheckCDN />:""}
        </div>
        <div>
          {!isloading? <div className="cdn-title">IntergrityCheck</div>:""}
          {/* {!isloading? <IntergrityCheck />:""} */}
        </div>
        <div>
      <h1>Package Versions</h1>
      <iframe src="http://www.test1.com:9001/AISKU/Tests/Manual/cookie.html" ></iframe>
      <script src="http://www.test1.com:9001/AISKU/Tests/Manual/cookie.js">what</script>
      <iframe srcdoc="
    <html>
    <head>
        <script>
            console.log('IFrame opened');
        </script>
    </head>
    <body>
        <!-- IFrame content goes here -->
    </body>
    </html>
"></iframe>

      {/* <IframeComponent src='http://www.test2.com:9001/AISKU/Tests/Manual/cookie.js' style={{ display: 'none' }}></IframeComponent> */}
    </div>
       </div>
      </div>
   </div>);
}
export default App;