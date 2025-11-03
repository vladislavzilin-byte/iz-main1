import React, { Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Environment, ScrollControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'

import GlassButton from './components/GlassButton'
import StarsEnhanced from './components/StarsEnhanced'
import AccountPill from './components/AccountPill'   // ⬅️ добавили

import Portfolio from './pages/Portfolio'
import Shop from './pages/Shop'
import Training from './pages/Training'
import Contacts from './pages/Contacts'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

type Lang = 'lt' | 'en' | 'ru'
const palette = { bg:'#000000' }
const i18n: Record<Lang, any> = {
  lt:{ hero:{sub:'Ateities grožio sistema: 3D gylis, švelnūs efektai ir polimero mygtukai.'}, buttons:['Portfelis','Parduotuvė','Mokymai','Kontaktai'] },
  en:{ hero:{sub:'Future-ready beauty system: depth, soft motion and polymer UI.'}, buttons:['Portfolio','Shop','Training','Contacts'] },
  ru:{ hero:{sub:'Система будущего: глубина, мягкие анимации и полимерные кнопки.'}, buttons:['Портфолио','Магазин','Обучение','Контакты'] },
}

/** Верхняя панель: слева логин-капсула, справа — языки */
function TopBar({lang,setLang}:{lang:Lang,setLang:(l:Lang)=>void}) {
  const langs:Lang[] = ['lt','en','ru']
  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
      {/* ЛОГИН-КАПСУЛА (как меню языков) */}
      <AccountPill />

      {/* ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl px-3 py-2 flex gap-2 shadow-lg">
        {langs.map(L => (
          <button
            key={L}
            onClick={()=>setLang(L)}
            className={`text-sm font-medium tracking-wide px-2 py-1 rounded-lg ${lang===L?'bg-white/15 text-white':'text-white/80 hover:text-white'}`}
          >
            {L.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

function Scene(){
  return(
    <>
      <StarsEnhanced count={7000} radius={200} intensity={1.1} />
      <ambientLight intensity={0.35}/>
      <directionalLight intensity={0.8} position={[4,6,6]}/>
      <Environment preset='city'/>
      <EffectComposer>
        <Bloom intensity={0.35} luminanceThreshold={0.22} luminanceSmoothing={0.6}/>
        <Noise opacity={0.008}/>
        <Vignette eskil={false} offset={0.18} darkness={0.55}/>
      </EffectComposer>
    </>
  )
}

function Home({lang}:{lang:Lang}){
  const copy = i18n[lang]
  return(
    <div className='relative min-h-screen'>
      <div className='fixed inset-0 -z-0'>
        <Canvas camera={{position:[0,0,8], fov:45}}>
          <color attach='background' args={[palette.bg]}/>
          <ScrollControls pages={2}>
            <Suspense fallback={null}><Scene/></Suspense>
          </ScrollControls>
        </Canvas>
      </div>

      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6'>
        <img src='/iz-logo.svg' className='w-44 md:w-56 mb-4 opacity-90' alt='logo'/>
        <p className='max-w-2xl text-white/70 mb-8'>{copy.hero.sub}</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <GlassButton label={copy.buttons[0]} to='/portfolio'/>
          <GlassButton label={copy.buttons[1]} to='/shop' delay={0.05}/>
          <GlassButton label={copy.buttons[2]} to='/training' delay={0.1}/>
          <GlassButton label={copy.buttons[3]} to='/contacts' delay={0.15}/>
        </div>
        <div className='mt-10 text-sm text-white/60'>
          izhairtrend.shop · support@izhairtrend.shop · <a href='https://www.instagram.com/irinazilina.hairtrend' target='_blank' className='underline' rel="noreferrer">Instagram</a>
        </div>
      </div>
    </div>
  )
}
