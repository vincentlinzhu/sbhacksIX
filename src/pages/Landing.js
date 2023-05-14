import { Suspense, useState } from 'react'
import '../styles.css'
import Overlay from '../layout/Overlay'
import { FadeIn, LeftMiddle } from '../layout/styles'

import Bananas from '../Bananas'
// Comment the above and uncomment the following to import the WebGL BG lazily for faster loading times
// const Bananas = lazy(() => import('./Bananas'))

// function handleSubmit() {

// }

function Landing() {
  const [speed, set] = useState(1)
  return (
    <>
      <Suspense fallback={null}>
        <Bananas speed={speed} />
        <FadeIn />
      </Suspense>
      {/* <div>
        <img src="giftsharelogocropped.png" alt="giftshare logo" style={{ width: '900px', }} class="center" z-index="-1"/>
      </div> */}
      <Overlay />
      <LeftMiddle>
        <input type="range" min="0" max="10" value={speed} step="1" onChange={(e) => set(e.target.value)} />
      </LeftMiddle>
      {/* <button onCLick={handleSubmit()}>Login</button> */}
    </>
  )
}

export default Landing