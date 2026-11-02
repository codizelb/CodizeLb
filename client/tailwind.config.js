/** Brand tokens derived from the Codize logo — recalibrated so mint is an accent, not a default text color. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { display: ['"Space Grotesk"', 'sans-serif'], body: ['Inter', 'sans-serif'] },
    colors: { brand: { bg: '#0a1712', surface: '#10241b', surface2: '#142e22', emerald: '#12a97e', moss: '#1f4d3a', mint: '#7ee8c4', text: '#e9f5ef', muted: '#7fa895', line: 'rgba(126,232,196,.14)' } },
    backgroundImage: { 'brand-grad': 'linear-gradient(120deg,#12a97e,#3ecfa0 55%,#7ee8c4)' },
    boxShadow: { glow: '0 16px 44px -18px rgba(18,169,126,.5)' },
    keyframes: {
      float: { '50%': { transform: 'translate(20px,-20px)' } },
      in: { from: { opacity: 0, transform: 'translateY(20px)' } },
      'bounce-slow': { '0%,100%': { transform: 'translateY(0)', opacity: .5 }, '50%': { transform: 'translateY(8px)', opacity: 1 } },
      marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-25%)' } },
    },
    animation: {
      float: 'float 13s ease-in-out infinite',
      in: 'in .8s cubic-bezier(.2,.7,.2,1) both',
      'bounce-slow': 'bounce-slow 2.2s ease-in-out infinite',
      marquee: 'marquee 22s linear infinite',
    },
  } },
}
