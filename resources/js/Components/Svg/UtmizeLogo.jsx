import {motion} from 'framer-motion';

export  const UtmizeLogo = ({className}) => {

    const icon = {
        hidden: { opacity:0, pathLength: 0, fill: "rgba(13, 242, 5, 0)" },
        visible: { opacity:1, pathLength: 1, fill: "rgba(13, 242, 5, 1)", stroke: "rgba(13, 242, 5, 1)"}
    }
    return(
        <motion.svg id="Camada_1" data-name="Camada 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 246.33 315.63" className={className}>
            <motion.path variants={icon} initial="hidden" animate="visible" transition={{ default: {duration: 2, ease: "easeInOut"}, fill:{ duration: 2, ease: [1, 0, 0.8, 1]}}} strokeWidth={1}  d="M92.48,89.77C117.72,60.04,142.96,30.32,168.7,0c26,30.31,51.54,60.08,77.63,90.48-2.02.25-3.22.52-4.43.53-8.16.04-16.34.21-24.49-.05-4.53-.14-6.08,1.38-6.06,6.03.16,36.66.17,73.32.02,109.97-.03,6.62-.52,13.33-1.71,19.83-6.76,36.9-26.87,64.31-61.43,78.84-38.3,16.1-75.48,13.49-109.14-13.24-.73-.58-1.39-1.25-1.27-1.14,9.78.59,20.27,2.47,30.53,1.61,26.85-2.25,42.8-18.69,51.65-42.99,5-13.73,7.09-27.92,6.95-42.62-.34-35.65-.12-71.31-.14-106.97q0-9.23-9.45-9.24c-7.98,0-15.97,0-23.95,0-.31-.42-.61-.85-.92-1.27Z"/>
            <motion.path variants={icon} initial="hidden" animate="visible" transition={{ default: {duration: 2, ease: "easeInOut"}, fill:{ duration: 2, ease: [1, 0, 0.8, 1]}}} strokeWidth={1}  d="M.09,167.79c0-16.32.09-32.64-.07-48.96-.04-4,1.11-5.52,5.35-5.49,24.31.17,48.63.19,72.94,0,4.5-.04,5.65,1.54,5.63,5.78-.13,28.81-.05,57.62-.07,86.43,0,7.93,1.29,15.31,8.05,20.55,1.31,1.01,2.68,2,4.14,2.76,6.6,3.43,6.62,3.4,4.31,10.47-7.41,22.7-28.19,34.15-53.41,30.56C17.74,265.71,1.47,241.49.36,216.24c-.71-16.12-.13-32.3-.13-48.45-.04,0-.09,0-.13,0Z"/>
        </motion.svg>
    )
}