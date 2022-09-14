const Lifx  = require('node-lifx-lan');

function DiscoverLights(){
    Lifx.discover().then((device_list: any) => {
        console.log("Yay")
        device_list.forEach((device: any) => {
          console.log([
            device['ip'],
            device['mac'],
            device['deviceInfo']['label']
          ].join(' | '));
        });
      }).catch((error: any) => {
        console.error(error);
      });
}



export default DiscoverLights