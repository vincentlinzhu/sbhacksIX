import { Container, Middle, TopLeft, TopRight, BottomLeft, BottomRight, Hamburger } from './styles'
// import Button from "../components/Button";

export default function Overlay() {
  return (
    <>
    <Container>
      <Middle>
        <div>
          <img src="giftsharelogotransparent2.png" alt="giftshare logo" style={{ width: '1200px', }} class="center"/>
        </div>
      </Middle>
      
      <TopLeft>  
      </TopLeft>

      <BottomLeft>
        <a>A runtime deconstruction of <a href="https://playful.software">playful.software</a></a>
      </BottomLeft>

      <BottomRight>
        <a>Created at SB Hacks IX</a>
        {/* <a>In React & Threejs</a> */}
      </BottomRight>

      <TopRight>        
        {/* <form style={{}} action="https://gift-share-9825e.firebaseapp.com/">   
          <input type="submit" value="LOGIN" />
        </form> */}
        {/* <Button style={{backgroundColor: "white", color: '#9E2129'}} type="submit">Log In</Button> */}
      </TopRight>
      
    </Container>
    </>
  )
}
