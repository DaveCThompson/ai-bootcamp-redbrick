import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './AnimatedLogo.module.css'

type AnimatedLogoProps = {
  size: 'header' | 'welcome'
  className?: string
}

const useAnimatedLogo = (svgRef: React.RefObject<SVGSVGElement | null>) => {
  // Use refs for GSAP instances to ensure they persist across renders without causing re-renders
  const tweensRef = useRef<{
    starRotation: gsap.core.Tween[]
    color: gsap.core.Tween | null
    colorRampIn: gsap.core.Timeline | null
  }>({ starRotation: [], color: null, colorRampIn: null })

  const exitTweensRef = useRef<gsap.core.Tween[]>([])
  const motionProxy = useRef({ amplitude: 0 }).current
  const oscillationTicker = useRef<((time: number) => void) | null>(null)

  useEffect(() => {
    const svgElement = svgRef.current
    if (!svgElement) return

    // --- ELEMENTS & CONSTANTS ---
    const mainLogoParts = gsap.utils.toArray<SVGPathElement>('.main-logo-part', svgElement)
    const stars = gsap.utils.toArray<SVGPathElement>('.star', svgElement)
    const brandPink = 'var(--brand-pink)'
    const darkGrey = 'var(--surface-fg-primary)'
    const basePinkHSL = 'hsl(349, 87%, 58%)'
    const desaturatedPink = 'hsl(349, 20%, 50%)'

    // --- ANIMATION PARAMETERS ---
    const ANIM_PARAMS = {
      rampDuration: 0.5,
      yAmplitude: 8,
      phaseOffset: 0.2,
      lightnessOsc: 5,
      stars: [
        { rotSpeed: 6, oscSpeed: 10 },
        { rotSpeed: 7, oscSpeed: 10 },
        { rotSpeed: 8, oscSpeed: 10 },
      ],
    }

    // --- 1. BUILD PERSISTENT ANIMATIONS (RUNS ONCE) ---
    const buildAnimations = () => {
      // Rotation
      tweensRef.current.starRotation = stars.map((star, i) => {
        const rotDuration = (11 - ANIM_PARAMS.stars[i].rotSpeed) / 2
        return gsap.to(star, {
          rotation: 360,
          duration: rotDuration,
          repeat: -1,
          ease: 'none',
          paused: true,
        })
      })

      // Color Oscillation
      const baseLightness = 58
      const colorProxy = { lightness: baseLightness }
      tweensRef.current.color = gsap.to(colorProxy, {
        lightness: baseLightness + ANIM_PARAMS.lightnessOsc,
        repeat: -1,
        yoyo: true,
        paused: true,
        duration: 1.5,
        ease: 'sine.inOut',
        // FIX: Explicitly use a block body to ensure a void return.
        onUpdate: () => {
          const newFill = `hsl(349, 87%, ${colorProxy.lightness}%)`
          gsap.set([...mainLogoParts, ...stars], { fill: newFill })
        },
      })

      // Y-axis Oscillation
      oscillationTicker.current = (time: number) => {
        stars.forEach((star, i) => {
          const oscSpeed = (11 - ANIM_PARAMS.stars[i].oscSpeed) * 2
          const wave = Math.sin(time * oscSpeed + i * ANIM_PARAMS.phaseOffset * 10)
          const yPos = wave * motionProxy.amplitude
          gsap.set(star, { y: yPos })
        })
      }
    }

    // --- 2. EVENT HANDLERS ---
    const handleMouseEnter = () => {
      exitTweensRef.current.forEach((t) => t.kill())
      exitTweensRef.current = []
      gsap.killTweensOf(motionProxy)
      void tweensRef.current.colorRampIn?.kill()

      tweensRef.current.colorRampIn = gsap
        .timeline({
          // FIX: Use the `void` operator to discard the PromiseLike return value of play().
          onComplete: () => void tweensRef.current.color?.play(0),
        })
        .to(mainLogoParts, { fill: desaturatedPink, duration: ANIM_PARAMS.rampDuration * 0.4, ease: 'power1.in' })
        .to([...mainLogoParts, ...stars], { fill: basePinkHSL, duration: ANIM_PARAMS.rampDuration * 0.6, ease: 'power1.out' })

      tweensRef.current.starRotation.forEach((tween) => tween.play())

      if (oscillationTicker.current) {
        gsap.ticker.add(oscillationTicker.current)
      }
      gsap.to(motionProxy, {
        amplitude: ANIM_PARAMS.yAmplitude,
        duration: ANIM_PARAMS.rampDuration,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      void tweensRef.current.colorRampIn?.kill()
      gsap.killTweensOf(motionProxy)
      void tweensRef.current.color?.pause()
      tweensRef.current.starRotation.forEach((tween) => tween.pause())

      const partExitTween = gsap.to(mainLogoParts, {
        fill: darkGrey,
        duration: ANIM_PARAMS.rampDuration,
        ease: 'power2.out',
      })
      exitTweensRef.current.push(partExitTween)

      const ampExitTween = gsap.to(motionProxy, {
        amplitude: 0,
        duration: ANIM_PARAMS.rampDuration,
        ease: 'power2.out',
        // FIX: Use a block body to ensure a void return.
        onComplete: () => {
          if (oscillationTicker.current) {
            gsap.ticker.remove(oscillationTicker.current)
          }
        },
      })
      exitTweensRef.current.push(ampExitTween)

      stars.forEach((star) => {
        const currentRotation = gsap.getProperty(star, 'rotation') as number
        const targetRotation = (Math.floor(currentRotation / 90) + 1) * 90
        const starExitTween = gsap.to(star, {
          rotation: targetRotation + '_cw',
          fill: brandPink,
          duration: ANIM_PARAMS.rampDuration,
          ease: 'power2.out',
        })
        exitTweensRef.current.push(starExitTween)
      })
    }

    // --- INITIALIZATION & CLEANUP ---
    gsap.set(stars, { y: 0, rotation: 0, transformOrigin: '50% 50%' })
    gsap.set(mainLogoParts, { fill: darkGrey })
    gsap.set(stars, { fill: brandPink })
    buildAnimations()

    svgElement.addEventListener('mouseenter', handleMouseEnter)
    svgElement.addEventListener('mouseleave', handleMouseLeave)

    // FIX: Capture the ref's `.current` values inside the effect for the cleanup function.
    const currentTweens = tweensRef.current
    const currentTicker = oscillationTicker.current

    return () => {
      svgElement.removeEventListener('mouseenter', handleMouseEnter)
      svgElement.removeEventListener('mouseleave', handleMouseLeave)
      gsap.killTweensOf([svgElement, ...mainLogoParts, ...stars, motionProxy])
      // Use the captured values in the cleanup.
      currentTweens.starRotation.forEach((t) => t.kill())
      void currentTweens.color?.kill()
      void currentTweens.colorRampIn?.kill()
      if (currentTicker) {
        gsap.ticker.remove(currentTicker)
      }
    }
  }, [svgRef, motionProxy])
}

export const AnimatedLogo = ({ size, className }: AnimatedLogoProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  useAnimatedLogo(svgRef)

  return (
    <svg
      ref={svgRef}
      className={`${styles.logoSvg} ${className ?? ''}`}
      data-size={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="besthuman-logo-title"
    >
      <title id="besthuman-logo-title">Besthuman Animated Logo</title>
      <g transform="translate(-10, -10) scale(0.2)">
        <path
          className="main-logo-part"
          d="M123.731 131.89C123.731 127.674 122.919 123.498 121.342 119.603C119.765 115.707 117.454 112.167 114.54 109.185C111.626 106.204 108.166 103.839 104.359 102.225C100.551 100.611 96.4708 99.7808 92.3498 99.7808C88.2288 99.7808 84.1481 100.611 80.3408 102.225C76.5335 103.839 73.074 106.204 70.16 109.185C67.246 112.167 64.9345 115.707 63.3575 119.603C61.7804 123.498 60.9687 127.674 60.9688 131.89H71.6383C71.6383 129.107 72.174 126.352 73.2149 123.78C74.2557 121.209 75.7813 118.873 77.7045 116.905C79.6278 114.937 81.911 113.376 84.4238 112.311C86.9367 111.246 89.6299 110.698 92.3498 110.698C95.0696 110.698 97.7629 111.246 100.276 112.311C102.789 113.376 105.072 114.937 106.995 116.905C108.918 118.873 110.444 121.209 111.485 123.78C112.526 126.352 113.061 129.107 113.061 131.89H123.731Z"
        />
        <path
          className="main-logo-part"
          d="M106.695 78.9778C106.695 86.9704 100.273 93.4497 92.3498 93.4497C84.4269 93.4497 78.0042 86.9704 78.0042 78.9778C78.0042 70.9852 84.4269 64.5059 92.3498 64.5059C100.273 64.5059 106.695 70.9852 106.695 78.9778Z"
        />
        <path
          id="star-1"
          className="star"
          d="M45.4906 73.9681L63.6586 77.9006L45.4998 81.8312C43.9574 82.165 42.7554 83.3746 42.4313 84.9192L38.5538 103.399L34.6763 84.9192C34.3522 83.3746 33.1502 82.165 31.6077 81.8312L13.4490 77.9006L31.6170 73.9681C33.1548 73.6352 34.3545 72.4319 34.6828 70.8931L38.5538 52.7471L42.4248 70.8931C42.7530 72.4319 43.9528 73.6352 45.4906 73.9681Z"
        />
        <path
          id="star-2"
          className="star"
          d="M69.9653 33.0259L85.1770 36.3185L69.9746 39.6091C68.4321 39.943 67.2301 41.1526 66.9060 42.6972L63.6586 58.1740L60.4111 42.6972C60.0870 41.1526 58.8850 39.943 57.3425 39.6091L42.1401 36.3185L57.3518 33.0259C58.8896 32.693 60.0893 31.4896 60.4176 29.9509L63.6586 14.7583L66.8995 29.9509C67.2278 31.4896 68.4275 32.693 69.9653 33.0259Z"
        />
        <path
          id="star-3"
          className="star"
          d="M124.925 33.6906L137.180 36.3433L124.934 38.9940C123.391 39.3279 122.189 40.5375 121.865 42.0820L119.248 54.5562L116.630 42.0820C116.306 40.5375 115.104 39.3279 113.562 38.9940L101.316 36.3433L113.571 33.6906C115.109 33.3577 116.309 32.1544 116.637 30.6156L119.248 18.3765L121.859 30.6156C122.187 32.1544 123.387 33.3577 124.925 33.6906Z"
        />
      </g>
    </svg>
  )
}