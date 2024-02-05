import axios from 'axios';
import CryptoJS from 'crypto-js';
import React, {useState, useEffect} from 'react';


const IntergrityCheck = () => {
  const [message, setMessages] = useState([]);
  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  function calculateHash(source) {
        let sha256 = CryptoJS.SHA256(source).toString(CryptoJS.enc.Base64);
        let sha384 = CryptoJS.SHA384(source).toString(CryptoJS.enc.Base64);
        let sha512 = CryptoJS.SHA512(source).toString(CryptoJS.enc.Base64);
        return "sha256-" + sha256 + " sha384-" + sha384 + " sha512-" + sha512;
    }
    async function fetchFile(url) {
        var readedFile;
        try {
        const response = await axios.get(url);
        readedFile = response.data;
        } catch (error) {
        console.error('Error:', error.message);
        }
        return readedFile || "";
    }
    const check = async () => {
        const integrityUrl = 'https://js.monitor.azure.com/beta/ai.3.integrity.json';
        var integrityFile = await fetchFile(integrityUrl);
        const integrityDictionary = {};
    
        for (const key in integrityFile.ext) {
          if (Object.hasOwnProperty.call(integrityFile.ext, key)) {
              const fileMember = integrityFile.ext[key];
              integrityDictionary[fileMember.file] = fileMember.integrity;
          }
        }
    
        for (const key in integrityDictionary) {
          const value = integrityDictionary[key];
          var originUrl = 'https://js.monitor.azure.com/scripts/b/' + key;
          var originalFile = await fetchFile(originUrl);
          let calcualteSha = calculateHash(originalFile, 'sha256');
          if (value !== calcualteSha) {
              console.error(originUrl + " intergrity check failed");
              addMessage(originUrl + " failed");
          } else {
              console.log(originUrl + " intergrity check to be: " +(value === calcualteSha));
              addMessage(originUrl + " passed");
          }
        }
    };

    useEffect(() => {
        // Call the async function when the component mounts
        check();
      }, []); // Empty dependency array to ensure it runs only once
    

    return (

    <div>
      {message && (
         <ul>
         {message.map((message, index) => (
           <li key={index}>{message}</li>
         ))}
       </ul>
      )}
    </div>
       
);   
}
export default IntergrityCheck;

