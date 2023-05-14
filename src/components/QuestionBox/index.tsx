import styles from "./styles.module.scss";

import { ReactNode } from "react";

export default QuestionBox;

type QuestionBoxType = {
  content: string;
  price: string;
  occasion: string;

  author: {
    name: string;
    avatar: string;
    id: string;
  };

  isAnswered?: boolean;
  isHighlighted?: boolean;

  children?: ReactNode;
};

function QuestionBox({
  children,
  content,
  price,
  occasion,
  author: { name, avatar },
  isAnswered = false,
  isHighlighted = false,
}: QuestionBoxType) {
  const { containerBox, highlightedContainer, answeredContainer, userInfoBox } =
    styles;

  const enhancedContainer = (() => {
    const containerClasses = [containerBox];

    if (isAnswered) containerClasses.push(answeredContainer);
    if (isHighlighted) containerClasses.push(highlightedContainer);

    return containerClasses.join(" ");
  })();

  if (price.includes("$")) {
    price = price.slice(1);
  }

  return (
    <li className={enhancedContainer} style={{overflowWrap: "break-word"}}>
      <div style={{display: "flex", flexDirection: "row", marginBottom: "2rem",}}>
        <p style={{marginRight: "2rem"}}><b>Price: </b>${price}</p>
        {/* <p ><b>Occasion: </b>{occasion}</p> */}
      </div>
      
      <p>{content}</p>

      <footer>
        <section className={userInfoBox}>
          <img src={avatar} alt={name} />
          <span>{name}</span>
        </section>

        <ul>{children}</ul>
      </footer>
    </li>
  );
}
