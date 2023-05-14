import styles from "./styles.module.scss";

export default Logo2;

type LogoProps = {
  className?: string;
};

function Logo2({ className }: LogoProps) {
  const { containerBox } = styles;

  const enhancedContainer = (() => {
    const container = [containerBox];

    if (className) container.push(className);

    return container.join(" ");
  })();

  return <i className={enhancedContainer} />;
}
