import { Link, Head} from '@inertiajs/react';
import imageLogo from "../../../../public/utmize-icon.png"
import {Button} from '@/Components/ui/button';
import {motion} from 'framer-motion';
import { UtmizeLogo } from '@/Components/Svg/UtmizeLogo';
import { IntegracoesFooter } from '@/Components/IntegracoesFooter';
import { ThemeProvider } from '@/Components/ThemeContextProvider';
import ToggleTheme from '@/Components/ToggleTheme';


export default function Page({auth}) {

    const animate = { clipPath: ["polygon(0% 55%, 5% 25%, 20% 12%, 33% 14%, 46% 21%, 59% 37%, 67% 53%, 71% 65%, 79% 72%, 88% 65%, 95% 59%, 100% 67%, 100% 89%, 92% 96%, 76% 99%, 58% 99%, 44% 93%, 31% 83%, 13% 75%, 5% 64%)",
"polygon(0% 41%, 4% 19%, 12% 13%, 20% 8%, 29% 6%, 39% 14%, 49% 24%, 61% 37%, 68% 38%, 75% 28%, 77% 20%, 80% 10%, 83% 4%, 90% 2%, 90% 22%, 84% 45%, 75% 54%, 59% 56%, 44% 58%, 16% 51%)",
"polygon(0% 42%, 3% 52%, 11% 63%, 23% 71%, 35% 75%, 51% 75%, 58% 70%, 67% 58%, 70% 46%, 74% 34%, 75% 18%, 75% 6%, 62% 0%, 49% 2%, 40% 4%, 27% 5%, 18% 12%, 9% 14%, 6% 20%, 1% 32%)"], 
                        x: [-500, 10, 200],
                    rotate:[0, 90, 360 ]    }
    
    return(
        <ThemeProvider defaultTheme='dark'>
            <Head title='Utmize'/> 
            <nav className='flex pl-8 justify-between border-b border-border h-12 items-center fixed z-10 w-screen bg-card font-bold pr-8'>
                <img src={imageLogo} alt="Utmize" className='size-20'/>
                {auth.user ? (
                    <div className='flex items-center justify-center gap-4'>
                        <Link href={route('dashboard')}>
                            Dashboard
                        </Link>

                        {/* <ToggleTheme /> */}
                    </div>
                    ) : 
                    (
                        <div className='flex gap-2 pr-8 items-center justify-center'>
                            <Link href={route('login')} className='p-2 rounded-md text-xs font-normal font-rale border border-border hover:bg-white/20'>
                                Login
                            </Link>

                            <Link href={route('register')} className='bg-primary p-2 rounded-md text-xs font-normal font-rale border border-border hover:bg-primary/80'>
                                Registro
                            </Link>

                            {/* <ToggleTheme /> */}
                        </div>
                    
                    )}

                    
            </nav>

            <main className='relative w-screen h-min overflow-y-auto overflow-x-hidden'>
            <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-40 -z-10 left-40 sm:left-80 transform-gpu  blur-3xl sm:-top-1'>
            <motion.div
              animate={animate}
                transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
              className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0DF205] to-[#078C03] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
            />
          </div>
                <section className='h-screen w-screen pt-12 flex flex-col justify-between'>

                    <div className='flex flex-col sm:flex-row items-center h-[580px] p-12'>
                        <div className='flex-1 w-full h-full text-3xl font-semibold flex items-center justify-center flex-col text-left md;px-20 gap-8'>
                            <h1 className="w-96 px-8 md:p-0 font-title font-semibold">Otimize suas vendas com a <span className='text-primary font-bold'>Utmize </span>
                            Rastreie suas vendas de forma precisa, e aumente seu lucro em até 35% com um trackeamento incrível.
                            </h1>
                            <Button className="font-bold font-rale shadow-md">Crie uma conta gratuita</Button>
                        </div>

                        <div className='w-screen h-full flex items-center justify-center p-8 sm:pr-8 '>
                            <div className='rounded-[--radius] w-full overflow-hidden border border-border'>
                                <img src="/dashboard.png" alt=""/>
                            </div>
                        </div>
                    </div>

                    <div className='h-screen w-screen flex items-center overflow-hidden bg-white'>
                        <IntegracoesFooter />
                    </div>
                </section>

                <section className='h-screen w-screen bg-background flex items-center justify-center'>
                    <div className='w-full h-full flex flex-col'>
                            <div className=' w-full h-full flex items-center justify-center'>
                                    <div className='border-2 bg-zinc-950 shadow-inner border-border/50 text-wrap w-80 h-40 flex items-center justify-center text-center rounded-lg'>
                                        <h1>Tecnologia de ponta em rastreamento de dados</h1>
                                    </div>
                            </div>

                            <div className=' w-full h-full flex items-center justify-center'>
                                    <div className='border-2 bg-zinc-950 shadow-inner border-border/50 text-wrap w-80 h-40 flex items-center justify-center text-center rounded-lg'>
                                        <h1>Tecnologia de ponta em rastreamento de dados</h1>
                                    </div>
                            </div>
                    </div>

                    <div className='bg-red-800 w-full h-full'>


                    </div>

                    <div className='w-full h-full flex flex-col'>

                        <div className='w-full h-full flex flex-col items-center justify-center'>
                                <div className=' w-full h-full flex items-center justify-center'>
                                        <div className='border-2 bg-zinc-950 shadow-inner border-border/50 text-wrap w-80 h-40 flex items-center justify-center text-center rounded-lg'>
                                            <h1>Tecnologia de ponta em rastreamento de dados</h1>
                                        </div>
                                </div>

                                <div className=' w-full h-full flex items-center justify-center'>
                                        <div className='border-2 bg-zinc-950 shadow-inner border-border/50 text-wrap w-80 h-40 flex items-center justify-center text-center rounded-lg'>
                                            <h1>Tecnologia de ponta em rastreamento de dados</h1>
                                        </div>
                                </div>

                        </div>
                    </div>
                </section>
            </main>
        </ThemeProvider>
    )
}