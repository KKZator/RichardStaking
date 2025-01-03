import React from 'react'
import { Button } from '@nextui-org/react';
import styles from '../styles/Homepage.module.sass'
import style from '../styles/Staking.module.sass'
import { useSigner, useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import StakingCard from './StakingCard';
import StakingCharts from './StakingCharts';
import Charts from './Charts';
import { erc20ABI } from 'wagmi';
import { Loading } from '@nextui-org/react';

import { stakingAddress, tokenAddress, rewardTokenAddress, RPC } from "../../public/variable";


export default function Staking() {
    const [decimals, setDecimals] = useState(0)
    const [rewardTokenDecimals, setRewardTokenDecimals] = useState(0)
    const [rewardTokenSymbol, setRewardTokenSymbol] = useState('')    
    const [isloading, setLoading] = useState(true)
    const RPCi = new ethers.providers.JsonRpcProvider(RPC);

    useEffect(() => {
        async function getDecimals(){
            await getTokenDecimals()
            console.log("DOVREI ESSERE PRIMO")
            setLoading(false)            
        }
        getDecimals()
    }, [])

    async function getTokenDecimals(){
        try{
            const token = new ethers.Contract(tokenAddress, erc20ABI, RPCi);
            const decimals = await token.decimals();
            setDecimals(decimals)
            const token2 = new ethers.Contract(rewardTokenAddress, erc20ABI, RPCi)
            const rewardDecimals = await token2.decimals()
            const token2Symbol = await token2.symbol()
            setRewardTokenSymbol(token2Symbol)
            setRewardTokenDecimals(rewardDecimals)           
        } catch (error) {
            console.log(error)
        }
    }
    

    



        return(
        <div className={style.stakingBody}>
            <div><StakingCard tokenADecimals={decimals} tokenBDecimals={rewardTokenDecimals} /></div>
            <div><StakingCharts tokenBDecimals={rewardTokenDecimals} tokenADecimals={decimals} /></div>
        </div>
    )
    }
