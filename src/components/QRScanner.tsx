import React from 'react'
import QrReader from 'react-qr-reader'
import { QRCode } from '../interfaces'

const QrScanner = (props: QRCode) => {
	return <QrReader delay={300} facingMode={'environment'} {...props} />
}

export default QrScanner
