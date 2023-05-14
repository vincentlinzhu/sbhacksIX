import styles from "../styles/room.module.scss";

import { useEffect, MouseEvent, Fragment } from "react";
import { useParams, useHistory } from "react-router-dom";

import useAuth from "../hooks/UseAuth";
import useRoom from "../hooks/UseRoom";

import { database } from "../services/firebase";

import HeaderRoom from "../components/HeaderRoom";
import Button from "../components/Button";
import NullQuestionsBox from "../components/NullQuestionsBox";
import QuestionBox from "../components/QuestionBox";
import { StarRating } from "./Room";

export default AdminRoom;

type RoomParamsType = {
  id: string;
};

function AdminRoom() {
  const history = useHistory();
  const { id: roomCode } = useParams<RoomParamsType>();

  const { user } = useAuth();
  const { isClosed, title, questions } = useRoom(roomCode);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomCode}`);

    roomRef.get().then((roomState) => {
      if (user?.id === roomState.val()?.authorId) return;

      if (!title) return;

      history.replace("/");
    });

    roomRef.on("child_removed", (state) => {
      if (state.key === "title") history.replace("/");
    });

    function unsubscribe() {
      roomRef.off("child_removed");
    }

    return unsubscribe;
  }, [title, roomCode, user?.id, history]);

  const isLoading = !title;

  // ***

  const {
    containerBox,
    closeRoomBox,
    loadingBox,
    contentBox,
    nullQuestionsBox,
    questionsBox,
    checkBox,
    answerBox,
    deleteBox,
    likeBox,
  } = styles;

  return (
    <div className={containerBox}>
      <HeaderRoom roomCode={roomCode}>
        {!isLoading && (
          <Button
            className={closeRoomBox}
            isOutlined
            disabled={isClosed}
            onClick={InitEndRoomHandle(roomCode, history)}
          >
            Close Room
          </Button>
        )}
      </HeaderRoom>

      {isLoading && <span className={loadingBox} />}

      <main className={contentBox} style={isLoading ? { display: "none" } : {}}>
        <header>
          <h1>Room - {title}</h1>
          {questions.length > 0 && <span>{questions.length} Recommendation(s)</span>}
        </header>

        {questions.length === 0 && (
          <NullQuestionsBox className={nullQuestionsBox} />
        )}

        <ul className={questionsBox}>
          {[...questions]
            .sort((a, b) => b.likesCount - a.likesCount)
            .map(({ id: questionId, likeId, likesCount, rating, ...rest }) => (
              <QuestionBox key={questionId} {...rest}>
                {!rest.isAnswered && (
                  <Fragment>
                    <li>
                      <button
                        type="button"
                        className={checkBox}
                        onClick={InitCheckQuestionAsAnsweredHandle(
                          roomCode,
                          questionId
                        )}
                        aria-label="Marca essa pergunta como respodida"
                        data-alt="Check"
                      />
                    </li>
                    <li>
                      <button
                        type="button"
                        className={answerBox}
                        onClick={InitHighlightQuestionHandle(
                          roomCode,
                          questionId
                        )}
                        aria-label="Marca essa pergunta como destaque"
                        data-alt="Answer"
                      />
                    </li>
                  </Fragment>
                )}
                <li>
                  <button
                    type="button"
                    className={deleteBox}
                    onClick={InitDeleteQuestionHandle(roomCode, questionId)}
                    aria-label="Deletar essa pergunta"
                    data-alt="Delete"
                  />
                </li>
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
                    aria-label="Like"
                    data-alt="Like"
                    style={{ width: "75px" }}
                    data-count={likesCount}
                    data-is-active={String(Boolean(likeId))}
                  />
                </li>
              </QuestionBox>
            ))}
        </ul>
      </main>
    </div>
  );
}

// #region Private Functions

function InitEndRoomHandle(roomCode: string, history: any) {
  async function Handle() {
    if (window.confirm("Do you really want to close this Room?") === false)
      return;

    await database.ref(`rooms/${roomCode}`).update({
      closedAt: new Date(),
    });

    history.push("/");
  }

  return Handle;
}

function InitCheckQuestionAsAnsweredHandle(
  roomCode: string,
  questionId: string
) {
  async function Handle() {
    if (
      window.confirm(
        "Do you really want to close this Room?"
      ) === false
    )
      return;

    await database
      .ref(`rooms/${roomCode}/questions/${questionId}`)
      .update({ isAnswered: true });
  }

  return Handle;
}

function InitHighlightQuestionHandle(roomCode: string, questionId: string) {
  async function ChangeHighlightState(isHighlighted: boolean) {
    const roomRefString = `rooms/${roomCode}/questions/${questionId}`;

    await database.ref(roomRefString).update({ isHighlighted });
  }

  // ----

  async function Handle({
    currentTarget: element,
  }: MouseEvent<HTMLButtonElement>) {
    const isActive = element.dataset.isActive === "true";

    ChangeHighlightState(!isActive);

    element.dataset.isActive = String(!isActive);
  }

  return Handle;
}

function InitDeleteQuestionHandle(roomCode: string, questionId: string) {
  async function Handle() {
    if (window.confirm("Do you really want to delete this question?") === false)
      return;

    await database.ref(`rooms/${roomCode}/questions/${questionId}`).remove();
  }

  return Handle;
}

// #endregion Private Functions
