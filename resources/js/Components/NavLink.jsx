import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function NavLink({ active = false, className = '', children, ...props }) {

    var link = props.href === window.location.href;
    var active = link ? true : false;

    if(props.href){

        if(props.href.includes("campanhas") && window.location.href.includes('campanhas')){

            active = true;

        }

    }

    return (
        <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ease: "linear", duration: 0.1 }}
        className={
            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
            (active
                ? 'border-primary text-card-foreground focus:border-primary hover:border-primary'
                : 'border-transparent text-muted-foreground hover:text-muted-foreground/50 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 ') +
            className
        }
        >
            <Link
                {...props}
               className={className + (active ? ' text-primary' : '')}
            >
                {children}
            </Link>
        </motion.div>
    );
}
