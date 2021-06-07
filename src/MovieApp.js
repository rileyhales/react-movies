import React, {useState, useEffect} from "react";

import TitleSearch from "./TitleSearch"
import TimeSearch from "./TimeSearch";
import SearchButtons from "./SearchButtons";
import MoviePoster from "./MoviePoster";

import {URL_dbJSON} from "./urls";

import './MovieApp.css';
import WatchButtons from "./WatchButtons";


function MovieApp() {
    const [db, setDb] = useState({})
    const [titlesList, setTitlesList] = useState([])
    const [timesList, setTimesList] = useState([])

    const [posters, setPosters] = useState([])
    const [posterIsVisible, setPosterIsVisible] = useState([])

    const [searchTime, setSearchTime] = useState(0)
    const [searchTitle, setSearchTitle] = useState("")

    useEffect(() => {
        fetch(URL_dbJSON)
            .then(res => {
                return res.json()
            })
            .then(res => {
                setDb(res)
                setTitlesList(Object.keys(res))
            })
    }, [])

    useEffect(() => {
        setPosterIsVisible(Array(titlesList.length).fill(true))

        setTimesList(titlesList.map(item => {
            return Number(db[item].time)
        }))
    }, [titlesList])
    useEffect(() => {
        setPosters(titlesList.map(
            (movie, index) => {
                return <MoviePoster key={index} src={db[movie].poster} visible={posterIsVisible[index]} title={movie}
                                    click={setSearchTitle}/>
            }))
    }, [posterIsVisible])

    useEffect(() => {
        let titleMatches
        if (searchTitle === "") {
            titleMatches = Array(titlesList.length).fill(true)
        } else {
            titleMatches = searchByTitle(searchTitle)
        }
        const timeMatches = searchByTime(searchTime)
        setPosterIsVisible(titleMatches.map((item, index) => {
            return item && timeMatches[index]
        }))
    }, [searchTitle, searchTime])

    useEffect(() => {

    }, [timesList])

    const searchByTitle = function (searchStr) {
        // `.replace` on searchStr encodes regex special characters with backslashes
        // https://stackoverflow.com/questions/874709/converting-user-input-string-to-regular-expression
        const regexString = RegExp(`.*(${searchStr.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')}).*`, "i")
        return titlesList.map(item => regexString.test(item))
    }

    const searchByTime = function (maxTime) {
        // return timesList.map(time => {return time < searchTime})
        return timesList.map(time => {
            return time < maxTime
        })
    }

    const clickRandom = function (event) {
        setSearchTitle(titlesList[Math.floor(Math.random() * titlesList.length)])
    }

    return (
        <div className="app">
            <div className="controls-bar">
                <h2>Hales Movie Database</h2>
                <TitleSearch list={titlesList} value={searchTitle} set={setSearchTitle}/>
                <TimeSearch list={timesList} value={searchTime} set={setSearchTime}/>
                <div className={"buttons-container"}>
                    <SearchButtons clickRandom={clickRandom} setSearchTitle={setSearchTitle}/>
                    <WatchButtons movie={searchTitle} db={db}/>
                </div>
            </div>

            <div className="gallery">
                <div className="posters-container">
                    {posters}
                </div>
            </div>
        </div>
    );
}

export default MovieApp;
