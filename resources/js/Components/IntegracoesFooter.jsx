import {motion, animate, useMotionValue, AnimatePresence} from "framer-motion";
import  useMeasure from "react-use-measure";
import { useEffect, useState } from "react";

export const IntegracoesFooter = () => {

    const imgs = [
        "Adoorei.png",
        "Appmax.png",
        "Braip.png",
        "BuyGoods.png",
        "Doppus.png",
        "Eduzz.png",
        "Greenn.png",
        "Hotmart.png",
        "IExperience.png",
        "Kirvano.png",
        "Kiwify.png",
        "Monetizze.png",
        "OctusPay.png",
        "Payt.png",
        "Pepper.png",
        "PerfectPay.png",
        "Ticto.png",
        "Vega.png",
        "Yampi.png",
        "Zippify.png",
    ]

    const FAST_DURATION = 20;
    const SLOW_DURATION = 75;
  
    const [duration, setDuration] = useState(FAST_DURATION);
    let [ref, { width }] = useMeasure();
  
    const xTranslation = useMotionValue(0);
  
    const [mustFinish, setMustFinish] = useState(false);
    const [rerender, setRerender] = useState(false);
  
    useEffect(() => {
      let controls;
      let finalPosition = -width * 1.49;
  
      if (mustFinish) {
        controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
          ease: "linear",
          duration: duration * (1 - xTranslation.get() / finalPosition),
          onComplete: () => {
            setMustFinish(false);
            setRerender(!rerender);
          },
        });
      } else {
        controls = animate(xTranslation, [0, finalPosition], {
          ease: "linear",
          duration: duration,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        });
      }
  
      const stopAnimation = () => {
        if (controls) {
          controls.stop;
        }
      };
  
      return stopAnimation;
    }, [rerender, xTranslation, duration, width]);
  
    console.log([...imgs, ...imgs].length);
    return(
        <>
        <motion.div className="flex items-center w-full h-full gap-4" ref={ref} style={{ x: xTranslation}}>
            
           {[...imgs, ...imgs].map((img, index) => (
                <img key={index} src={`/${img}`} alt={img} className="h-6"/>
           ))}
           
        </motion.div>
        
        </>
    )
}