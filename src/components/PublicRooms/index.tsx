import styles from "./styles.module.scss";
import { FormEvent, useEffect, useState } from "react";
import Button from "../Button";
import { useHistory } from "react-router-dom";

import useAuth from "../../hooks/UseAuth";

import { database } from "../../services/firebase";

export default PublicRooms;

function PublicRooms() {
	const { user } = useAuth();
  const { containerBox } = styles;
	const roomsPath = `rooms/`;
	const roomsList = database.ref(roomsPath);
	const [titles, setTitles] = useState<string[]>([])
	const [search, setSearch] = useState("");
	useEffect(() => {
		roomsList.once('value', function(snapshot){
			snapshot.forEach(
				function(childSnapshot){
					setTitles(prevTitles => [...prevTitles, childSnapshot.val().title]);
				}
			)
		})
	}, [user?.id])

  return (
    <aside className={containerBox}>
			<h2 style={{position: "fixed", top:"10%", marginBottom:"1rem", fontSize:"1.5em"}}>Existing Rooms</h2>
			<form style={{color:"white"}}>
				<input 
					placeholder="Search for a room" 
          onChange={(e) => setSearch(e.target.value)}
          style={{marginBottom:"1rem", borderRadius:"0.8rem", width:"89%", minHeight:"4rem", padding:"1.4rem", border:"none", backgroundColor:"rgba(246,190,203, 0.2", boxShadow:"0 0.2rem 1.2rem rgba(0, 0, 0, 0.04)", resize:"none"}}>
				</input>
			</form>
			<div style={{height:"100%", overflow:"scroll"}}>
				{titles.filter((room) => {
              return search === '' ? room : room.includes(search);
          }).map((item) => {
					return (
						<div style={{marginTop:"0.5rem", marginBottom:"0.5rem", borderRadius:"0.8rem", display:"flex", flexDirection:"row"}}>
							<div style={{width:"70%", textAlign:"center", fontSize:"1.2em", padding:"1rem", marginRight:"0.5rem", backgroundColor:"white", color:"darkblue", boxShadow:"0 0.2rem 1.2rem rgba(0, 0, 0, 0.04)", borderRadius:"0.8rem"}}>{item}</div>
							{/* <button style={{padding:"1rem", backgroundColor:"white", color:"darkblue", boxShadow:"0 0.2rem 1.2rem rgba(0, 0, 0, 0.04)", borderRadius:"0.8rem", display:"flex"}}>Join Room</button> */}
							<form onSubmit={InitJoinRoomHandle(item)}>
								<Button style={{marginLeft:"0.5rem", backgroundColor:"rgba(246,190,203, 0.2"}} type="submit">Join</Button>
							</form>
						</div>
					)
				})}
			</div>
    </aside>
  );
}

function InitJoinRoomHandle(roomCode: string) {
  const history = useHistory();

  async function Handle(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") return;

    // ***

    const submitter: HTMLButtonElement =
      event.currentTarget.querySelector("[type='submit']") ||
      ({} as HTMLButtonElement);

    submitter.disabled = true; // ----I

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    submitter.disabled = false; // ----O

    if (!roomRef.exists()) {
      alert("Room does not exists!");
      return;
    }

    if (roomRef.val().closedAt) {
      alert("Room is already closed!");
      return;
    }

    // ***

    history.push(`/rooms/${roomRef.key}`);
  }

  return Handle;
}