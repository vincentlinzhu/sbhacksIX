import styles from "./styles.module.scss";

import { Fragment } from "react";

import useAuth from "../../hooks/UseAuth";

export default ButtonSignOut;

function ButtonSignOut() {
  const { user, SignOut } = useAuth();

  function HandleSignOut() {
    if (window.confirm("Do you want to log out of this account?") === false) return;

    SignOut();
  }

  // ***

  const { containerBox } = styles;

  return (
    <Fragment>
      {user && (
        <button
          title="Do you want to log out of this account?"
          type="button"
          onClick={HandleSignOut}
          className={containerBox}
        >
          <img src={user.avatar} alt={user.name} />
        </button>
      )}
    </Fragment>
  );
}
