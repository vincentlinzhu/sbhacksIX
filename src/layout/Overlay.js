import {
  Container,
  Middle,
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
  Mid,
} from "./styles";

export default function Overlay() {
  return (
    <>
      <Container>
        <Middle>
          <div>
            <img
              src="giftsharelogotransparent2.png"
              alt="giftshare logo"
              style={{ width: "1200px" }}
              class="center"
            />
          </div>
        </Middle>
        <Mid>
          {/* <form style={{backgroundColor: "white", color: "#9E2129"}} action="https://gift-share-9825e.firebaseapp.com/home">    */}
          <form style={{minWidth:"5rem"}} action="/home">   
            <input className="done" style={{minWidth:"5rem", backgroundColor: "white", color: "#9E2129", borderRadius:"0.8rem", height:"5rem", width:"10rem"}} type="submit" value="Log In" />
          </form>
          {/* <button
            style={{ backgroundColor: "white", color: "#9E2129" }}
            onClick={handleSubmit()}
          >
            Log In
          </button> */}
        </Mid>

        <TopLeft></TopLeft>

        <BottomLeft>
          {/* <a>
            A runtime deconstruction of{" "}
            <a href="https://playful.software">playful.software</a>
          </a> */}
        </BottomLeft>

        <BottomRight>
          {/* <a>Created at SB Hacks IX</a> */}
          {/* <a>In React & Threejs</a> */}
        </BottomRight>

        <TopRight>
          {/* <form style={{}} action="https://gift-share-9825e.firebaseapp.com/">   
          <input type="submit" value="LOGIN" />
        </form> */}
        </TopRight>
      </Container>
    </>
  );
}
