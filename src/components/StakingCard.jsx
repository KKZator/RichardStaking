import React, { use } from "react"
import { useState, useEffect } from "react";
import style from '@/styles/StakingCard.module.sass'
import { Input, Button } from "@nextui-org/react";
import { stakingAddress, tokenAddress, rewardTokenAddress, RPC } from "../../public/variable";
import {ethers} from 'ethers'
import { erc20ABI } from "wagmi";
import { useAccount, useSigner } from "wagmi";
import CountUp from 'react-countup';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


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

const StakingCard = ({tokenADecimals, tokenBDecimals}) => {
    const abiStaking = require('../../public/abi/abiStaking.json')
    const RPCi = new ethers.providers.JsonRpcProvider(RPC);
    const {data: signer} = useSigner();
    const {account, isConnected, address} = useAccount();
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [userBalance, setUserBalance] = useState(0);
    const [userInfo, setUserInfo] = useState({});
    const [amountToStake, setAmountToStake] = useState(0);
    const [amountToWithdraw, setAmountToWithdraw] = useState(0);
    const [allowance, setAllowance] = useState(0);
    const [decimals, setDecimals] = useState(0)
    const [depositedAmount, setDepositedAmount] = useState(0)

    const [rewardTokenDecimals, setRewardTokenDecimals] = useState(0)
    const [rewardTokenSymbol, setRewardTokenSymbol] = useState('')
    const [pendingReward, setPendingReward] = useState(0)
    const [newRewards, setNewRewards] = useState(0)
    const [stakingBalance, setStakingBalance] = useState(0)

    const [pStakingAddress, setPStakingAddress] = useState('')
    const [trigger, setTrigger] = useState(false)
    const [notyf, setNotyf] = useState()
    

    useEffect(() => {
        async function getTokensDecimals(){
            await getTokenDecimals()
            //console.log("decimals presi -> 1 useEffect")
            setNotyf(
                new Notyf({
                    duration: 3000,
                    position: {
                        x: 'center',
                        y: 'top',
                    }
                })
            )
        }
        getTokensDecimals()
    }, [])


    useEffect(() => {
        async function getTokenInformation(){
            if(!isConnected) return
                      //await getTokenDecimals();
                      await getTokenInfo();
                      await getStakingUserInfo()
                      await getAllowance()
                      await getUserInfo()
                      //await calculateAPY()
                      //console.log("Triggerato il resto perche ha preso i decimals")
        }
        getTokenInformation();
    }, [tokenBDecimals, tokenADecimals])
    


    useEffect(() => {
        async function getTokenInformation(){
            if(!isConnected) return
                      //await getTokenDecimals();
                      await getTokenInfo();
                      await getStakingUserInfo()
                      await getAllowance()
                      await getUserInfo()
                      await calculateAPY()
        }
        getTokenInformation();
    }, [signer, trigger, tokenADecimals])


    async function calculateAPY(){
        if(depositedAmount === 0) return
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
        const apr = await aprCalc(tokenPriceUSD, depositedAmount, staking, tokenPriceUSDB, 1)
        //console.log("APR",apr)
        const apy = apyCalc(apr)
        //console.log("APY", apy)
    }   



    async function getUserInfo(){        
        if(!signer) return        
        if(!isConnected) return

        try{
            const staking = new ethers.Contract(stakingAddress, abiStaking, signer)
            const userInfo = await staking.userInfo(address)
            setDepositedAmount(ethers.utils.formatUnits(userInfo[0].toString(), tokenADecimals ? tokenADecimals : 18))           
        } catch (error){
            console.log(error)
        }
    }



    async function getAllowance(){        
        if(!signer) return        
        if(!isConnected) return
        try{
            const token = new ethers.Contract(tokenAddress, erc20ABI, signer);
            const allowance = await token.allowance(address, stakingAddress);
            setAllowance(allowance.toString());
        } catch (error) {
            console.log(error)
        }
    }

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

    

    async function getStakingUserInfo(){
        if(!signer) return
        try{            
            const staking = new ethers.Contract(stakingAddress, abiStaking, signer);
            const hasStaking = await staking.userStaking(address)
            setPStakingAddress(hasStaking)
            const userInfo = await staking.userInfo(address);
            setUserInfo(userInfo);
        } catch (error) {
            console.log(error)
        }
    }


    async function getTokenInfo(){
        try{
            const token = new ethers.Contract(tokenAddress, erc20ABI, RPCi);
            const symbol = await token.symbol();
            
            //console.log({symbol})
            setTokenSymbol(symbol);
            
            const staking = new ethers.Contract(stakingAddress, abiStaking, RPCi);
            const stakingBalance = await staking.totalUsersStake();
            //console.log("Staking Balance: ", stakingBalance.toString())
            setStakingBalance(ethers.utils.formatUnits(stakingBalance.toString(), tokenADecimals ? tokenADecimals : 18))
            if(isConnected){
                var balance = await token.balanceOf(address);
                balance = ethers.utils.formatUnits(balance.toString(), tokenADecimals ? tokenADecimals : 18)
                //console.log("Balance: ", balance.toString(), " ")
                setUserBalance(balance);
            }
        } catch (error) {
            console.log(error)
        }
    }


    async function approve(){
        try{
            const token = new ethers.Contract(tokenAddress, erc20ABI, signer);
            setTrigger(true)
            const approve = await token.approve(stakingAddress, ethers.constants.MaxUint256 /* ethers.utils.parseUnits(amountToStake.toString(), decimals) */);
            await approve.wait();
            notyf.success("Token Approved succesfully")
            //console.log(approve)
        } catch (error) {
            console.log(error)            
            notyf.error(error.reason)
        } finally {
            setTrigger(false)
        }
    }

    async function deposit(){
        try{
            const staking = new ethers.Contract(stakingAddress, abiStaking, signer);
            //console.log("Depositing: ", amountToStake)
            setTrigger(true)
            const deposit = await staking.deposit(amountToStake.toString());
            let tx = await deposit.wait();
            //console.log(deposit)
            notyf.success("Token deposited succesfully")
        } catch (error) {            
            //console.log(error.reason, typeof error.reason)
            //console.log("MESSAGE", error)
            notyf.error(error.reason)
        } finally {
            setTrigger(false)
        }
    }

    async function createStaking(){
        try{
            const staking = new ethers.Contract(stakingAddress, abiStaking, signer);
            setTrigger(true)
            //console.log("Creating staking: ", amountToStake)
            const createStaking = await staking.createStaking(amountToStake.toString());
            await createStaking.wait();
            //console.log(createStaking)            
            notyf.success("Staking created succesfully")
        } catch (error) {
            console.log(error)            
            notyf.error(error.reason)
        } finally {
            setTrigger(false)
        }
    }

    async function withdraw(){
        try{
            const staking = new ethers.Contract(stakingAddress, abiStaking, signer);
            setTrigger(true)
            //console.log("Withdrawing: ", parseInt(amountToWithdraw.toString()))
            const withdraw = await staking.withdraw(amountToWithdraw.toString());
            await withdraw.wait();
            //console.log(withdraw)            
            notyf.success("Token withdrawn succesfully")
        } catch (error) {
            console.log(error)            
            notyf.error(error.reason)
        } finally{
            setTrigger(false)
        }
    }

    function handleSetAmountToStake(amountToStake){
        if(amountToStake > 0){
            //console.log(amountToStake)
            amountToStake = ethers.utils.parseUnits(amountToStake.toString(), tokenADecimals ? tokenADecimals : 18)
            //console.log(amountToStake.toString())
            setAmountToStake(amountToStake.toString())
        }
    }

    function handleSetAmountToWithdraw(amountToWithdraw){
        if(amountToWithdraw > 0){
            //console.log(amountToWithdraw)
            amountToWithdraw = ethers.utils.parseUnits(amountToWithdraw.toString(), tokenADecimals ? tokenADecimals : 18)
            //console.log("Amount to withdraw",amountToWithdraw.toString())
            setAmountToWithdraw(amountToWithdraw.toString())
        }
    }

    
  return (
    <div  className={style.stakeCardWrapper}>
        
        <div className={style.projectItem}> 
            <div className={style.projectInfo}>
                <h4 className={style.projectTitle}>RichardNFT Staking</h4>
                <h3><CountUp start={0} end={stakingBalance ? stakingBalance : 0}/> {tokenSymbol}</h3>
                <span>Total Stake</span>
            </div>


            <div className={style.lockForm}>
               <div className={style.approve}>
                    <h5>Balance: <CountUp start={0} end={userBalance ? userBalance : 0}/></h5>
                    <div className={style.approveButton}>
                        {trigger ? <Input disabled placeholder="Insert amount to stake" onChange={(e) => handleSetAmountToStake(e.target.value)}/> : <Input placeholder="Insert amount to stake" onChange={(e) => handleSetAmountToStake(e.target.value)}/>}
                        { 
                            trigger ? 
                                (
                                    (Number(allowance) < Number(amountToStake)) ?
                                        <Button size='sm' color='warning' disabled onClick={() => approve()}>Approve</Button>  :
                                        <Button size='sm' color='warning' disabled onClick={() => deposit()}>Stake</Button>
                                ) : 
                                (
                                    (Number(allowance) < Number(amountToStake)) ?
                                        <Button size='sm' color='warning' onClick={() => approve()}>Approve</Button>  :
                                        ((pStakingAddress == "0x0000000000000000000000000000000000000000") ? <Button size='sm' color='warning' onClick={()=> createStaking()}>Stake</Button> : <Button size='sm' color='warning' onClick={() => deposit()}>Stake</Button> )
                                )
                        } 
                    </div>
                </div> 

                <div className={style.withdraw}>
                    <div className={style.withdrawInfo}> 
                        <h5>Deposited: <CountUp start={0} end={depositedAmount}/></h5>
                        
                    </div>
                    <div className={style.withdrawButton}>
                        {trigger  ? <Input disabled placeholder="Insert amount to withdraw" onChange={(e) => handleSetAmountToWithdraw(e.target.value)}/> : <Input placeholder="Insert amount to withdraw" onChange={(e) => handleSetAmountToWithdraw(e.target.value)}/>}
                        { trigger ? 
                            <Button size='sm' color='warning' disabled onClick={() => withdraw()}>Withdraw</Button> : 
                            <Button size='sm' color='warning' onClick={() => withdraw()}>Withdraw</Button>
                        }
                    </div>
                    
                </div> 


            </div>
        </div>
    </div>
  )
};

export default StakingCard;
