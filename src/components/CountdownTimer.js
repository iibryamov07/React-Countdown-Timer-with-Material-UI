import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import CloseRounded from '@mui/icons-material/CloseRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import tick from '../assets/tick.mp3';
import start from '../assets/start.mp3';
import stop from '../assets/stop.mp3';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const CountdownTimer = () => {
const [duration, setDuration] = useState(60)
const [modalActive, setModalActive] = useState(false);
const [countdown, setCountdown] = useState(duration);
const [running, setRunning] = useState(false);
const [buttonIcon, setButtonIcon] = useState(<PlayArrowRoundedIcon/>);
const [buttonLabel, setButtonLabel] = useState('Start');
const [buttonVisibility, setButtonVisibility] = useState('')
const [progress, setProgress] = useState(0);
const [progressColor, setProgressColor] = useState('#6a58a2');

const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: progressColor,
      },
    },
  });

const tickAudioEffect = () => {
    new Audio(tick).play();
}

const startAudioEffect = () => {
    if(running===false){
        new Audio(start).play();
    } else if (running===true){
        new Audio(stop).play();
    }
}

const stopAudioEffect = () => {
    new Audio(stop).play();
}


const handleInput = (event) => {
    setDuration(event.target.value*60)
    setCountdown(event.target.value*60)
}

const handleRunning = () => {
    startAudioEffect();
    setRunning((prevRunning) => !prevRunning)
    running===false ? setButtonIcon(<PauseRoundedIcon/>) : setButtonIcon(<PlayArrowRoundedIcon/>);
    running ? setButtonLabel('Start') : setButtonLabel('Pause');
    running ? setButtonVisibility('') : setButtonVisibility('--hidden')
    setProgressColor('#6a58a2');
}

const handleReset = () =>{
    setCountdown(duration);
    setRunning(false);
    setButtonIcon(<PlayArrowRoundedIcon/>)
    setButtonLabel('Start')
    setButtonVisibility('')
    setProgressColor('#e0dedf');
    setProgress(0);
}

useEffect(()=>{
    let interval = null;

    if (running) {
        interval = setInterval(()=>{
            setCountdown((prevCountdown) => prevCountdown - 1);
            setProgress(((duration-countdown)/duration)*100);
            tickAudioEffect();
        },1000);
    }

    if(countdown === 0) {
        clearInterval(interval);
        handleReset();
        stopAudioEffect();
    }

   

    return () => clearInterval(interval);
}, [running, countdown]);



    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        const formattedMinutes = String(minutes).padStart(2,'0');
        const formattedSeconds = String(seconds).padStart(2,'0');

        return `${formattedMinutes}:${formattedSeconds}`
    }

    const openModal = () => {
        setModalActive(true);
    }

    const closeModal = () => {
        setModalActive(false);
    }

    

  return (
    <div className='timer-container'>
        <Modal className='modal'
        isOpen={modalActive}
        >
        <div className='modal__container'>
        <button className='modal__button' onClick={closeModal}><CloseRounded/></button>
        </div>
        <div className='modal__settings'>
        <h1 className='modal__h1'><SettingsRounded/>Settings</h1>
        </div>
        <label className='modal__label'><AccessTimeFilledRoundedIcon/>Countdown Duration (in Minutes)</label>
        <form className='modal__form'>
        <input
        className='modal__input'
        type='text'
        onChange={handleInput}
      
        />
        </form>
        </Modal>
        <div className='timer'>
        <ThemeProvider theme={theme}>
        <CircularProgress className='timer__progress-bar' variant='determinate' value={progress} size={150} color='primary' />
        </ThemeProvider>
        <h1 className='timer__label'>{formatTime(countdown)}</h1>
        <div className='button-container'>
        <button className={'button button--reset' + buttonVisibility} onClick={handleReset}><RestartAltRoundedIcon/></button>
        <button className='button button--running' onClick={handleRunning}>{buttonIcon}{buttonLabel}</button>
        <button className={'button button--settings' + buttonVisibility} onClick={openModal}><SettingsRounded/></button>
        </div>
        </div>
    </div>
  )
}

export default CountdownTimer