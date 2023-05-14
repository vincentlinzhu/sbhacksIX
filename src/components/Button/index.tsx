import styles from "./styles.module.scss";

import { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

const Button = forwardRef(
  (props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    const { className, isOutlined, ...rest } = props;
    const { commonBtn, outlinedBtn } = styles;

    const enhancedBtn = () => {
      const btnClasses = [commonBtn];

      if (className) btnClasses.push(className);
      if (isOutlined) btnClasses.push(outlinedBtn);

      return btnClasses.join(" ");
    };

    return (
      <button ref={ref} type="button" className={enhancedBtn()} {...rest} />
    );
  }
);

export default Button;
