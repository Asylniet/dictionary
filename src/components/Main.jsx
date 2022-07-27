import React, { useEffect, useState } from "react";
import volume from "../assets/volume.svg";
const Main = () => {
  const [word, setWord] = useState("");
  const host = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const [wordInfo, setWordInfo] = useState();
  const [resultFound, setResultFound] = useState(true);

  //-------------------
  const spotBold = () => {
    const boldWord = word;
    document.querySelectorAll(".example").forEach((example) => {
      const words = {};
      words.q = example.innerHTML;
      words.q = words.q.replace(
        new RegExp("(" + boldWord + ")", "i"),
        makeBold("$1")
      );
      example.innerHTML = words.q;
    });
  };

  function makeBold(str) {
    return str.bold();
  }
  //-------------------

  //Fetch Info
  const fetchInfo = async () => {
    const res = await fetch(host);
    const data = await res.json();
    return data;
  };
  
  useEffect(() => {
    const getInfo = async () => {
      const infoFromServer = await fetchInfo();
      if (infoFromServer.title === "No Definitions Found") {
        setResultFound(false);
      } else {
        setResultFound(true);
        setWordInfo(infoFromServer);
      }
    };
    word && getInfo();
    if (!word || word.length === 0) {
      setResultFound(true);
      setWordInfo(undefined);
    }
  }, [word]);

  useEffect(() => {
    document.querySelectorAll(".volume").forEach((element) => {
      element.addEventListener("click", function () {
        var audio = element.previousElementSibling;
        audio.play();
      });
    });
    spotBold();
  }, [wordInfo]);

  const placeholders = [
    "dictionary",
    "code",
    "javascript",
    "developer",
    "map",
    "fog",
    "voter",
    "advance",
    "memorial",
    "exit",
    "nuance",
  ];

  const choice = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  return (
    <div className="flex column">
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          setWord(document.querySelector("form").firstChild.value);
        }}
        className="flex column start"
      >
        <input
          type="text"
          placeholder={`${choice(placeholders)}`}
          onChange={(e) => setWord(e.target.value)}
        />
        {wordInfo && wordInfo[0].phonetics && wordInfo[0].phonetics.length > 0 && (
          <div className="flex phonetics">
            {wordInfo[0].phonetics.map(
              (el) =>
                el.text &&
                el.audio && (
                  <div className="phonetic flex" key={el.audio}>
                    <span>{el.text.replace(/\//g, " ")}</span>
                    <audio>
                      <source src={el.audio} type="audio/mp3" />
                    </audio>
                    <img
                      src={volume}
                      alt=""
                      audio={el.audio}
                      className="volume"
                    />
                  </div>
                )
            )}
          </div>
        )}
      </form>
      {resultFound ? (
        wordInfo && (
          <div className="word flex column start">
            {wordInfo[0].meanings.map((meaning) => (
              <div
                className="meaning flex column start"
                key={meaning.definitions[0].definition}
              >
                <div>
                  {meaning.partOfSpeech}
                  {meaning.definitions.map((definition, index) => (
                    <div
                      className="definitions"
                      key={index}
                      data-order={index + 1}
                    >
                      <span className="definition">
                        {definition.definition}
                      </span>
                      {definition.example && (
                        <div className="flex column start extra">
                          <h4>Example:</h4>
                          <span className="example">{definition.example}</span>
                        </div>
                      )}
                      <span>{definition.antonyms}</span>
                      <span>{definition.synonyms}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <h4>Результатов не найдено</h4>
      )}
    </div>
  );
};
export default Main;
