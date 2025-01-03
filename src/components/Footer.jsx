import styles from "@/styles/Footer.module.sass"
import { SocialIcon } from 'react-social-icons';
import Image from "next/image";
import Link from "next/link";

export const Footer = () => (
    <footer className={styles.big}>        
        <div>
            <p>Developed by <a href="https://kkteam.net/">KKTeam</a></p>
        </div>       
    </footer>
)