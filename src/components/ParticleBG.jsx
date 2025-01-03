import React from "react"
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticleBG = (props) => {

  const particlesInit = useCallback(async engine => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={
                {
                  fullScreen:{
                      "enable": true,
                      "zIndex": 0,
                  },
                  background: {
                        color: {
                            value: "#000000",
                        },
                    },
                  
                  
                  fpsLimit: 30,
                  
                  particles: {
                      color: {
                          value: "#202020",
                      },
                      
                      collisions: {
                          enable: true,
                      },
                      move: {
                          directions: "none",
                          enable: true,
                          outModes: {
                              default: "bounce",
                          },
                          random: true,
                          speed: 0.4,
                          straight: false,
                      },
                      number: {
                          density: {
                              enable: true,
                              area: 1500,
                          },
                          value: 90,
                      },
                      opacity: {
                          value: 0.3,
                      },
                      shape: {
                          type: "square",
                      },
                      size: {
                          value: { min: 65, max: 95 },
                      },
                  },
                  detectRetina: true,
              }
              }
        />
    );
};

export default ParticleBG;
