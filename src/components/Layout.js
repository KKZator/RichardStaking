
import Navbarz2 from "./Navbar2";
import { Footer } from "./Footer";
import Head from "next/head"
import styles from '../styles/Layout.module.sass'
import ParticleBG from "./ParticleBG";
export const MainLayout = ({children}) =>{
    return(
        <>
        <Head>
            <title>RichardNFT Staking</title>
            <meta name="description" content="RichardNFT Staking" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/img/Untitled+design+(11).png" />
        </Head>
        <Navbarz2 />
            <main className={styles.main}>{children}</main>
        <Footer/>
        </>
    )
}