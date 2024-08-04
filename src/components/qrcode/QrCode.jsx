import React from 'react';
import QRCode from 'qrcode.react';
import styles from './QrCode.module.css'

function QrCodeGenerator() {
  const [value, setValue] = React.useState('https://queue-wise.com');

  return (
    <div style={{ width: '30%',  }}>
      <QRCode value={value} size={50} style={{ marginLeft: '120px', marginTop: '30px'}}/>
      {/* <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ marginTop: '10px', padding: '8px', fontSize: '16px' }}
      /> */}
    </div>
  );
}

export default QrCodeGenerator;
