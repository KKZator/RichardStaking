import React from 'react'
import { Button } from '@nextui-org/react';
import styles from '../styles/Homepage.module.sass'
import { useSigner, useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
export default function HomePage() {
  



  return (
    <div className={styles.StakeCardStyleWrapper}>
      <div className={styles.projectItem}>
        
        <div className={styles.projectInfo}>
                    <h4 className={styles.projectTitle}>Participat IGO Stake</h4>
                    <h3 className={styles.projectPrice}>256.50 BUSD</h3>
                    <span>Total Stake</span>
        </div>

        <ul className={styles.projectListing}>
                    <li>
                        <span className={styles.infoText}>Lock period: <strong>7 days</strong></span> <span className={styles.infoValue}>APY Rate</span>
                    </li>
                    <li>
                        <span className={styles.infoText}> Re-locks on registration: <strong>Yes</strong></span>
                        <span className={`${styles.bigText} ${styles.infoValue}`}>12 %</span>
                    </li>
                    <li>
                        <span className={styles.infoText}> Early unstake fee: <strong>25%</strong></span>
                        <span className={styles.infoValue}>*APY is dynamic</span>
                    </li>
                    <li>
                        <span className={styles.infoText}>Status: <strong>Unlocked</strong></span>
                    </li>
        </ul>
                <div className={styles.projectFormList}>
                    <h5>Balance: 2889.00 BUSD</h5>
                    <div className={styles.balanceFormArea}>
                        <label> MAX </label>
                        <input type="text" placeholder="00.00" />
                        <Button sm variant="blue">
                            Approve
                        </Button>
                    </div>

                    <h5>Staked: 256.50 BUSD</h5>
                    <div className={styles.balanceFormArea}>
                        <label className="max"> MAX </label>
                        <input type="text" placeholder="0.00" />
                        <Button sm variant="dark">
                            Widthdraw
                        </Button>
                  </div>
                  </div>

      </div>
    </div>
  )
}
