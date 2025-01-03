import React from "react";
import style from "@/styles/Charts.module.sass"
import { useState } from "react";
const Charts = () => {
    const [styles, setStyles] = useState([
        style.candleFast, style.candleSlow, style.candleMid,
        style.candleSemiFast, style.candleNotSoFast, style.candleSemiSlow,
        style.candleFastina, style.candleFast2, style.candleSlow2, style.candleMid2,
        style.candleSemiFast2, style.candleNotSoFast2, style.candleSemiSlow2,
        style.candleFastina2
    ])
    return(
        <div className={style.chart}>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
            <div className={`${style.candle} ${ styles[Math.floor(Math.random() * styles.length)] }`}/>
        </div>
    )
}

export default Charts;