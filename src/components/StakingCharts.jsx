import React from "react"
import style from '@/styles/StakingCharts.module.sass'
import CountUp from 'react-countup';
import { stakingAddress, tokenAddress, RPC, nftAddress, rewardTokenAddress } from "../../public/variable";
import {ethers} from 'ethers'
import { erc20ABI, erc721ABI } from "wagmi";
import { useAccount, useSigner } from "wagmi";
import { useState, useEffect } from "react";
import Charts from "./Charts";



export async function aprCalc(
    tokenPriceA, // api dex tools
    totalTokenDepositedBalance, // deposit amount by user
    stakingC, // contract instance
    tokenPriceB, // api dex tools
    log
  ) {
    let tokenPerBlock = await stakingC.rewardPerBlock()
    let blockPerDay = 345600
    const no_of_reward_tokens = tokenPerBlock.mul(blockPerDay * 365)
  
    const total_value_of_reward_token = no_of_reward_tokens * tokenPriceB
    const total_value_of_staked_token = totalTokenDepositedBalance * tokenPriceA
  
    let apr_calc =
      (total_value_of_reward_token / total_value_of_staked_token) * 100
  
    if (log === 1) console.log(`apr: ${apr_calc}`)
  
    return apr_calc / 1000000
  }
  
  export function apyCalc(apr) {
    return parseFloat((Math.floor((apr / 100) * 12) * 100).toFixed(2))
  }

const StakingCharts = ({tokenADecimals, tokenBDecimals}) => {
    const RPCi = new ethers.providers.JsonRpcProvider(RPC);    
    const {data: signer} = useSigner();
    const {account, address, isConnected} = useAccount();
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [stakingBalanceUSD, setStakingBalanceUSD] = useState(0); 
    const [totalStakers, setTotalStakers] = useState(0);   
    const [heldNft, setHeldNft] = useState(0);
    const abiStaking = require('../../public/abi/abiStaking.json')
    const [rewardTokenDecimals, setRewardTokenDecimals] = useState(0)
    const [rewardTokenSymbol, setRewardTokenSymbol] = useState('')
    const [pendingReward, setPendingReward] = useState(0)
    const [newRewards, setNewRewards] = useState(0)
    const [depositedAmount, setDepositedAmount] = useState(0)    
    const [decimals, setDecimals] = useState(0)
    const [apyPercentage, setApyPercentage] = useState(0)

    useEffect(() => {
        async function getSTakingChartInfo(){
                
                await getTokenDecimals()
                await getTotalValueLocked();
                await getTotalStakers();
                if(isConnected) await calculateAPY()
        }
        getSTakingChartInfo();
    }, [])

    useEffect(() => {
        async function getNFT(){
            await getHeldNft();  
        }
        getNFT();
    }, [signer])

    
    useEffect(() => {
        async function getTokenInformation(){
            if(!isConnected) return
            try{
                      //await getTokenDecimals();
                      /* await getTokenInfo();
                      await getStakingUserInfo()
                      await getAllowance() */
                      await getUserInfo()
                      await calculateAPY()
                      //await calculateAPY()
                      //console.log("Triggerato il resto perche ha preso i decimals")
            } catch (error){
                console.log(error)
            }

        }
        getTokenInformation();
    }, [tokenBDecimals, tokenADecimals, signer, isConnected])



    useEffect(() => {
        async function pendingRewards(){            
            if(!signer) return
            if(!isConnected) return
            if(!tokenADecimals || !tokenBDecimals) await getTokenDecimals()
            try{
            const staking = new ethers.Contract(stakingAddress, abiStaking, signer)
            // const userInfo = await staking.userInfo(address)
            const pendingReward = await staking.pendingReward(address)
            setNewRewards(ethers.utils.formatUnits(pendingReward.toString(), tokenBDecimals))
            //console.log("vengo chiamato ogni 10secondi")
            //console.log( ethers.utils.formatUnits(pendingReward.toString(), rewardTokenDecimals))
            await calculateAPY()
            console.log("vengo chiamato ogni 10secondi")
            } catch (error){
                console.log(error)
            }

        }
        const interval = setInterval(() => {
                pendingRewards()
        }, 5000);
      
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
      }, [ tokenADecimals ,tokenBDecimals, signer])


      async function calculateAPY(){
        console.log("CALCULATE APY, qual'e il problema?")
        
        console.log("depositedAmount", depositedAmount)
        console.log("il balance??")
        if(!isConnected) return
        console.log("o la connessione??")
        console.log("isConnected", isConnected)
        //console.log('vengo chiamata??')
        const tokenPrice = await fetch('https://api.dexscreener.com/latest/dex/pairs/ethereum/0x5f9c50c22CbBE6AE1797aE4Ac36666a2d2184186')
        //console.log("TOKEN PRICE",tokenPrice)
        const tokenPriceJson = await tokenPrice.json() 
        const tokenPriceUSD = tokenPriceJson.pair.priceUsd
        const tokenPriceB = await fetch('https://api.dexscreener.com/latest/dex/pairs/ethereum/0x3416cF6C708Da44DB2624D63ea0AAef7113527C6')
        const tokenPriceJsonB = await tokenPriceB.json()
        const tokenPriceUSDB = tokenPriceJsonB.pair.priceUsd

        //console.log("TOKEN PRICE USDT",tokenPriceUSD)
        const staking = new ethers.Contract(stakingAddress, abiStaking, signer)
        const userInfo = await staking.userInfo(address)
        //console.log(userInfo)
        //console.log('Deposited Amount: ', Number(userInfo[0])) 

        setDepositedAmount(ethers.utils.formatUnits(userInfo[0].toString(), tokenADecimals))
        
        const apr = await aprCalc(tokenPriceUSD, depositedAmount, staking, tokenPriceUSDB, 1)
        //console.log("APR",apr)
        const apy = apyCalc(apr)
        //console.log("APY", apy.toFixed(2))
        setApyPercentage(apy)
    }  


    async function getTokenDecimals(){
        try{
            const token = new ethers.Contract(tokenAddress, erc20ABI, RPCi);
            const decimals = await token.decimals();
            //console.log("Decimals: ", decimals.toString())
            setDecimals(decimals)
            const token2 = new ethers.Contract(rewardTokenAddress, erc20ABI, RPCi)
            const rewardDecimals = await token2.decimals()
            //console.log("Reward token decimals: ", rewardDecimals.toString())
            const token2Symbol = await token2.symbol()
            //console.log("Token 2 symbol: ", token2Symbol)
            setRewardTokenSymbol(token2Symbol)
            setRewardTokenDecimals(rewardDecimals)
        } catch (error) {
            console.log(error)
        }
    }





    async function getUserInfo(){        
        if(!signer) return        
        if(!isConnected) return

        try{
            const staking = new ethers.Contract(stakingAddress, abiStaking, signer)
            const userInfo = await staking.userInfo(address)
            //console.log(userInfo)
            //console.log('Deposited Amount: ', Number(userInfo[0])) 

            setDepositedAmount(ethers.utils.formatUnits(userInfo[0].toString(), tokenADecimals))           
            const pendingReward = await staking.pendingReward(address)
            setPendingReward(ethers.utils.formatUnits(pendingReward.toString(), tokenBDecimals))
            //console.log("Pending reward primo: ", ethers.utils.formatUnits(pendingReward.toString(), rewardTokenDecimals))
        } catch (error){
            console.log(error)
        }
    }


    async function getTotalValueLocked(){
        try{
            const token = new ethers.Contract(tokenAddress, erc20ABI, RPCi);
            var stakingBalance = await token.balanceOf(stakingAddress);
            //console.log("Stakign balance ", stakingBalance.toString())
            stakingBalance = ethers.utils.formatUnits(stakingBalance, 9);
           // console.log("Staking Balance Format",stakingBalance)
            const usdPrice = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binance-usd&vs_currencies=usd')
            const usdPriceJson = await usdPrice.json();
            //console.log("USD PRICE", usdPriceJson['binance-usd'].usd)
            //console.log("Balance USD staking", stakingBalance * usdPriceJson['binance-usd'].usd)
            setStakingBalanceUSD(stakingBalance * usdPriceJson['binance-usd'].usd)
       } catch (error) {
            console.log(error)
        }

    }

    async function getTotalStakers(){
        try{
            const staking = new ethers.Contract(stakingAddress, abiStaking, RPCi);
            var totalStakers = await staking.totalUsersInStaking();
            //console.log(totalStakers.toString())
            setTotalStakers(totalStakers.toString());
       } catch (error) {
            console.log(error)
        }

    }

    async function getHeldNft(){
        if(!signer) return
        if(!isConnected) return
        try{
            const nft = new ethers.Contract(nftAddress, erc721ABI, signer);
            var heldNft = await nft.balanceOf(address);
            //console.log(heldNft.toString())
            setHeldNft(heldNft.toString())         

        } catch (error) {
            console.log(error)
        }
    }


    //console.log("APY percentage", apyPercentage)
  return (
   
      <div className={style.chartsContainer}>


            <div className={`${style.pendingReward} ${style.infoCont}`}>
                
                <div className={style.info}>
                    <h6>PENDING REWARDS</h6>
                    <h5><CountUp decimals={4} start={(pendingReward === newRewards) ?
                            pendingReward : newRewards} end={(pendingReward !== newRewards) ? 
                            newRewards : pendingReward}/> {rewardTokenSymbol}</h5>
                </div>   
                    
                    <Charts />
                    {/* <img src={'/img/rank.png'} style={{color: "orange"}}/> */}
                
            </div>
            <div className={`${style.totalValueLocke} ${style.infoCont}`}>
                
                <div className={style.info}>
                    <h4>TVL</h4>
                    <h5><CountUp start={20000} end={stakingBalanceUSD}/> BUSD</h5>
                </div>   
                    
                    <Charts />
                    {/* <img src={'/img/rank.png'} style={{color: "orange"}}/> */}
                
            </div>

            <div className={`${style.apy} ${style.infoCont}`}>
                <div className={style.info}>                    
                    <h4>APY</h4>
                    <h5><CountUp start={100} end={apyPercentage}/>%</h5>
                </div>                
                    <Charts />
                
            </div>

            <div className={`${style.numOfStakers} ${style.infoCont}`} >
            <div className={style.info}>
                    <h4>STAKERS</h4>
                    <h5><CountUp start={0} end={totalStakers}/></h5>
            </div>                
                    <Charts />
                
            </div>

            <div className={`${style.totalValueLocke} ${style.infoCont}`}>
                <div className={style.info}>
                    <h4>HELD NFT</h4>
                    <h5><CountUp start={0} end={heldNft}/></h5>
                    
                </div>                
                    <Charts />
                
            </div>
        </div>
  )
};

export default StakingCharts;
