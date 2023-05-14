import styles from "../styles/room.module.scss";

import {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  Fragment,
} from "react";
import { useParams, useHistory } from "react-router-dom";

import useAuth from "../hooks/UseAuth";
import useRoom, { ParsedQuestionType } from "../hooks/UseRoom";

import { database } from "../services/firebase";

import HeaderRoom from "../components/HeaderRoom";
import Button from "../components/Button";
import NullQuestionsBox from "../components/NullQuestionsBox";
import QuestionBox from "../components/QuestionBox";

export default Room;

type RoomParamsType = {
  id: string;
};

function Room() {
  const [newQuestion1, setNewQuestion1] = useState("");
  const [newQuestion2, setNewQuestion2] = useState("");
  const [newQuestion3, setNewQuestion3] = useState("");
  const [budget, setBudget] = useState("");
  console.log(budget);

  const { id: roomCode } = useParams<RoomParamsType>();
  const { user, SignInWithGoogle } = useAuth();

  const history = useHistory();
  const { isClosed, title: roomTitle, questions } = useRoom(roomCode);

  const isLoading = !roomTitle;

  useEffect(() => {
    if (roomTitle === "" || isClosed) history.replace("/");

    // ***

    const roomRef = database.ref(`rooms/${roomCode}`);

    roomRef.on("child_removed", (state) => {
      if (state.key === "title") history.replace("/");
    });

    function unsubscribe() {
      roomRef.off("child_removed");
    }

    return unsubscribe;
  }, [roomTitle, roomCode, isClosed, history]);

  // ***

  const {
    containerBox,
    loadingBox,
    contentBox,
    userBox,
    nullQuestionsBox,
    questionsBox,
    likeBox,
  } = styles;

  return (
    <div className={containerBox}>
      <HeaderRoom roomCode={roomCode} />

      {isLoading && <span className={loadingBox} />}

      <main className={contentBox} style={isLoading ? { display: "none" } : {}}>
        <header>
          <h1>Welcome - {roomTitle}</h1>
          {questions.length > 0 && <span>{questions.length} Gift Suggestion(s)</span>}
        </header>

        <h2 style={{marginTop:"3rem", marginBottom:"3rem"}}>Create a post</h2>
        <form onSubmit={InitSendQuestionHandle(newQuestion1, newQuestion2, newQuestion3, setNewQuestion1, setNewQuestion2, setNewQuestion3)}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <textarea
              style={{resize: "none", marginRight: "1rem"}}
              placeholder="Suggest a Gift"
              onChange={InitChangeQuestionHandle(setNewQuestion1)}
              onKeyDown={InitSendQuestionByKeyboardHandle()}
              value={newQuestion1}
            />
            <div style={{ display: "flex", flexDirection: "column"}}>
              <textarea
                style={{resize: "none", minHeight: "5rem", marginBottom: "0.5rem"}}
                placeholder="Price"
                onChange={InitChangeQuestionHandle(setNewQuestion2)}
                onKeyDown={InitSendQuestionByKeyboardHandle()}
                value={newQuestion2}
              />

              {/* <textarea
                style={{resize: "none", minHeight: "5rem", marginTop: "0.5rem"}}
                placeholder="Occasion"
                onChange={InitChangeQuestionHandle(setNewQuestion3)}
                onKeyDown={InitSendQuestionByKeyboardHandle()}
                value={newQuestion3}
              /> */}

              <Button style={{marginTop: "0.5rem"}} type="submit" disabled={!user || !newQuestion1 || !newQuestion2}>
                Submit
              </Button>
            </div>
          </div>

          <footer>
            {!user ? (
              <span>
                To suggest a gift idea,{" "}
                <button type="button" onClick={SignInWithGoogle}>
                  login here
                </button>
              </span>
            ) : (
              <div className={userBox}>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            )}
          </footer>
        </form>

        <div style={{marginTop:"2rem", display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
          <h2 style={{marginTop:"2rem"}}>Posts</h2>
          <form>
            <input 
              placeholder="Filter below price: $" 
              onChange={(e) => setBudget(e.target.value)}
              style={{borderRadius:"0.8rem", width:"100%", minHeight:"4rem", padding:"1.4rem", border:"none", backgroundColor:"rgba(246,190,203, 0.2", boxShadow:"0 0.2rem 1.2rem rgba(0, 0, 0, 0.04)", resize:"none"}}
            ></input>
          </form>
        </div>

        {questions.length === 0 && (
          <NullQuestionsBox className={nullQuestionsBox} />
        )}
        <ul className={questionsBox}>
          {questions.filter((recommendation) => {
              if (recommendation.price.includes("$")) {
                recommendation.price = recommendation.price.slice(1);
              }
              return budget === '' ? recommendation : Number(recommendation.price) <= Number(budget)
          }).map(
            ({ id: questionId, likeId, likesCount, rating, ...rest }) => (
              <QuestionBox key={questionId} {...rest}>
                {!rest.isAnswered && (
                  <Fragment>
                    <li>
                      <StarRating
                        initRating={rating}
                        key={"star-" + questionId}
                        question={{
                          id: questionId,
                          roomCode,
                          likeId,
                          likesCount,
                          rating,
                          ...rest,
                        }}
                      />
                    </li>
                    <li>
                      <button
                        type="button"
                        disabled={!user}
                        className={likeBox}
                        onClick={InitLikeQuestionHandle(
                          roomCode,
                          questionId,
                          likeId,
                          user?.id
                        )}
                        aria-label="Like"
                        data-alt="Like"
                        data-count={likesCount}
                        data-is-active={String(Boolean(likeId))}
                      />
                    </li>
                  </Fragment>
                )}
              </QuestionBox>
            )
          )}
        </ul>
      </main>
    </div>
  );
}

type extendedQuestionType = ParsedQuestionType & { roomCode: string };
export const StarRating = (props: {
  initRating: number;
  question: extendedQuestionType;
}) => {
  const { initRating, question } = props;
  const [rating, setRating] = useState(initRating);
  const [hover, setHover] = useState(initRating);
  const { id } = question;
  const { user } = useAuth();
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <span key={id + "-" + index} className="star-container">
            {question.author.id !== user?.id ? (
              <button type="button" className={index <= rating ? "on" : "off"}>
                <span className="star">&#9733;</span>
              </button>
            ) : (
              <button
                type="button"
                className={index <= (hover || rating) ? "on" : "off"}
                onClick={InitRatingHandle(question, setRating, setHover, index)}
                onDoubleClick={InitRatingHandle(
                  question,
                  setRating,
                  setHover,
                  0
                )}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
              >
                <span className="star">&#9733;</span>
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
};
// #region Private Functions

function InitRatingHandle(
  question: extendedQuestionType,
  setRating: React.Dispatch<React.SetStateAction<number>>,
  setHover: React.Dispatch<React.SetStateAction<number>>,
  index: number
) {
  const roomRefString = `rooms/${question.roomCode}/questions/${question.id}/rating`;

  async function Handle({
    currentTarget: element,
  }: MouseEvent<HTMLButtonElement>) {
    setRating(index);
    setHover(index);
    await database.ref(roomRefString).set(index);
  }

  return Handle;
}

function InitSendQuestionHandle(
  newQuestion1: string,
  newQuestion2: string,
  newQuestion3: string,
  setNewQuestion1: (value: string) => void,
  setNewQuestion2: (value: string) => void,
  setNewQuestion3: (value: string) => void
) {
  const { user } = useAuth();
  const { id: roomCode } = useParams<RoomParamsType>();

  async function Handle(event: FormEvent) {
    event.preventDefault();

    // ***

    if (newQuestion1.trim() === "") return;

    if (!user) throw new Error("You must be logged in");

    // ***

    const question = {
      content: newQuestion1,
      price: newQuestion2,
      occasion: newQuestion3,
      author: {
        name: user?.name,
        avatar: user?.avatar,
        id: user?.id,
      },
      isAnswered: false,
      isHighlighted: false,
    };

    setNewQuestion1("");
    setNewQuestion2("");
    setNewQuestion3("");

    await database.ref(`rooms/${roomCode}/questions`).push(question);
  }

  return Handle;
}

function InitChangeQuestionHandle(setNewQuestion: (value: string) => void) {
  function Handle({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) {
    setNewQuestion(value);
  }

  return Handle;
}

function InitSendQuestionByKeyboardHandle(key: string = "Enter") {
  function Handle({
    repeat,
    ctrlKey: isValid,
    key: pressedKey,
    currentTarget: { form },
  }: KeyboardEvent<HTMLTextAreaElement>) {
    if (repeat) return;

    if (!isValid) return;

    if (pressedKey !== key) return;

    form?.querySelector<HTMLInputElement>("[type=submit]")?.click();
  }

  return Handle;
}

function InitLikeQuestionHandle(
  roomCode: string,
  questionId: string,
  likeId?: string,
  authorId?: string
) {
  const roomRefString = `rooms/${roomCode}/questions/${questionId}/likes`;

  async function Like() {
    await database.ref(roomRefString).push({ authorId });
  }

  async function Unlike() {
    await database.ref(`${roomRefString}/${likeId}`).remove();
  }

  // ----

  async function Handle({
    currentTarget: element,
  }: MouseEvent<HTMLButtonElement>) {
    const isActive = element.dataset.isActive === "true";

    if (!isActive) await Like();
    if (isActive) await Unlike();

    element.dataset.isActive = String(!isActive);
  }

  return Handle;
}

// #endregion Private Functions
