import React from 'react'
import { CreditCard, GetApp, History, NotificationsNone, EmojiEvents, Subject, Close, FlashOn, Loop, ArrowBack, Check, Backspace } from '@material-ui/icons'
import { IconName } from '../interfaces'


const Icons = {
    pay: CreditCard,
    receive: GetApp,
    history: History,
    notifications: NotificationsNone,
    ranking: EmojiEvents,
    menu: Subject,
    close: Close,
    flash: FlashOn,
    flip: Loop,
    back :ArrowBack,
    check :Check,
    backspace:Backspace
 }
const Icon=(props: IconName)=>{
    const IconTag= Icons[props.name]  
    return <IconTag /> 
}

export default Icon