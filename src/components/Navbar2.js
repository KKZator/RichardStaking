import { Navbar, Link, Text, Avatar, Dropdown } from "@nextui-org/react";
import { ConnectButtonz } from "./ConnectButton";
import Image from "next/image";
export default function Navbarz2() {
  const collapseItems = [
    
  ];

  return (
    
      <Navbar isBordered variant="sticky" maxWidth='xs'>
        {/* <Navbar.Toggle showIn="xs" suppressHydrationWarning/> */}
          <Navbar.Brand>          
            <><Image src={'./img/Untitled+design+(11).png'} width={70} height={70} /></>
          </Navbar.Brand>
          <Navbar.Content hideIn="xs">
            {/* <Navbar.Link href="/" css={{fontWeight: '1000 !important'}}>Link</Navbar.Link> 
            <Navbar.Link href='/'
              css={{fontWeight: '1000 !important'}}
            >Link</Navbar.Link>  */}
          </Navbar.Content>
          
          <Navbar.Content
            css={{
              "@m": {
              w: "12%",
              jc: "flex-end",
              },
            }}
          > 

          <Navbar.Item>
                <ConnectButtonz/>
          </Navbar.Item>
        </Navbar.Content>

        <Navbar.Collapse>
          {collapseItems.map((links) => (
            <Navbar.CollapseItem key={links.Name}>
              <Link                
                css={{
                  minWidth: "100%",
                  color: '#F6903F',
                  fontWeight: '1000 !important'
                  }}
                  href={links.link}
                >
                {links.Name}
              </Link>
            </Navbar.CollapseItem>
          ))}
        </Navbar.Collapse>
      </Navbar>
   
  );
}