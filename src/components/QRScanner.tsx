import React from 'react';
import QrReader from 'react-qr-reader';
import { IQRCode } from '../interfaces';

const QrScanner = (props: IQRCode) => {
  return <QrReader delay={300} facingMode={'environment'} {...props} />;
};

export default QrScanner;
