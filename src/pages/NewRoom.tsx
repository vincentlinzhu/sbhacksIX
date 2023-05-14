import styles from "../styles/auth.module.scss";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Link, useHistory } from "react-router-dom";

import useAuth from "../hooks/UseAuth";

import { database } from "../services/firebase";
import { useRef } from "react";

import ButtonSignOut from "../components/ButtonSignOut";
import Logo from "../components/Logo";
import Button from "../components/Button";
import PublicRooms from "../components/PublicRooms";

export default NewRoom;

function NewRoom() {
  const [newRoom, setNewRoom] = useState("");

  const { user } = useAuth();
  const history = useHistory();
  const submit = useRef<HTMLButtonElement>(null);

  // ***

  useEffect(() => {
    !user && history.replace("/");
  }, [user, history]);

  // ***

  const { containerBox, contentBox, logoBox, newRoomBox } = styles;

  return (
    <div className={containerBox}>
      <PublicRooms />
      <ButtonSignOut />

      <main>
        <section className={`${contentBox} ${newRoomBox}`}>
          <Logo className={logoBox} />
          <h2>Create a new Room</h2>
          <form onSubmit={InitCreateRoomHandle(newRoom, submit)}>
            <input
              type="text"
              placeholder="Enter the name of the Room"
              value={newRoom}
              onChange={InitChangeRoomHandle(setNewRoom)}
            />
            <Button ref={submit} type="submit">
              Create Room
            </Button>
            <p>
            Want to join an existing Room?{" "}
              <Link to="/" replace>
                click here
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

// #region Private Functions

function InitCreateRoomHandle(
  newRoom: string,
  submit: React.RefObject<HTMLButtonElement>
) {
  const { user } = useAuth();
  const history = useHistory();

  async function Handle(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") return;

    const roomRef = database.ref(`rooms/${newRoom}`);
    if ((await roomRef.get()).val() !== null) {
      alert("Room already exists");
      return;
    }

    submit.current?.setAttribute("disabled", "true");

    await roomRef.set({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/admin/rooms/${newRoom}`);
  }

  return Handle;
}

function InitChangeRoomHandle(setNewRoom: (value: string) => void) {
  function Handle({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    setNewRoom(value);
  }

  return Handle;
}

// #endregion Private Functions
