import React, {useState, useEffect} from 'react';
const IframeComponent = ({ src }) => {
    useEffect(() => {
      // Add event listener to listen for messages from parent
      const handleMessage = event => {
        console.log('Received message from parent:', event.data);
        window.sharedStorage.set('third-party-write-domain', 'written into publisher storage by third-party code');
        // You can perform any other action here based on the received message
      };
      window.addEventListener('message', handleMessage);
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, []);
  
    return (
      <iframe src={src} title="Embedded Content" style={{ width: '100%', height: '500px' }}></iframe>
    );
  };
export default IframeComponent;