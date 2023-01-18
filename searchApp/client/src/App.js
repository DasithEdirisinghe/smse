import axios from 'axios';
import { useState } from 'react';
import './App.css';

const App = () => {
  const [chosenQuery, setChosenQuery] = useState(null);
  const [chosenTitle, setChosenTitle] = useState(null);
  const [chosenWriter, setChosenWriter] = useState(null);
  const [chosenSinger, setChosenSinger] = useState(null);
  const [chosenMetopher, setChosenMetopher] = useState(null);
  const [chosenTarget, setchosenTarget] = useState(null);
  const [chosenSource, setchosenSource] = useState(null);
  const [documents, setDocuments] = useState(null);

  const sendSearchRequest = () => {
    const results = {
      method: 'POST',
      url: 'http://localhost:3001/api/search/result',
      data: {
        query: chosenQuery,
        field: chosenTitle | chosenWriter |chosenSinger |chosenMetopher
      },
    };
    axios
      .request(results)
      .then((response) => {
        console.log(response.data);
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='app'>
      <nav>
        <ul className='nav-bar'>
          <li>SMSE</li>
        </ul>
      </nav>
      <p className='directions'>
        {' '}
        Search for song metaphors using the following criteria:
      </p>
      <div className='main'>
        <div> 
        <li>
              <form>
                <label>
                  <input
                    className='form'
                    type='text'
                    placeholder='Enter Query'
                    value={chosenQuery}
                    onChange={(e) => setChosenQuery(e.target.value)}
                  />
                </label>
              </form>
            </li>
            <li>
            <button onClick={sendSearchRequest}>Search Query</button>
            </li>
        </div>
        <div className='type-selector'>
          <ul>
          <li>
              <form>
                <label>
                  <input
                    className='form'
                    type='text'
                    placeholder='Enter Song Title'
                    value={chosenTitle}
                    onChange={(e) => setChosenTitle(e.target.value)}
                  />
                </label>
              </form>
            </li>
            <li>
              <form>
                <label>
                  <input
                    className='form'
                    type='text'
                    placeholder='Enter Song Writer'
                    value={chosenWriter}
                    onChange={(e) => setChosenWriter(e.target.value)}
                  />
                </label>
              </form>
            </li>
            <li>
              <form>
                <label>
                  <input
                    className='form'
                    type='text'
                    placeholder='Enter Song Singer'
                    value={chosenSinger}
                    onChange={(e) => setChosenSinger(e.target.value)}
                  />
                </label>
              </form>
            </li>
            <li>
              <form>
                <label>
                  <input
                    className='form'
                    type='text'
                    placeholder='Enter Metopher'
                    value={chosenMetopher}
                    onChange={(e) => setChosenMetopher(e.target.value)}
                  />
                </label>
              </form>
            </li>
            <li>
              <form>
                <label>
                  <input
                    className='form'
                    type='text'
                    placeholder='Enter Target Domain'
                    value={chosenTarget}
                    onChange={(e) => setchosenTarget(e.target.value)}
                  />
                </label>
              </form>
            </li>
            <li>
              <button onClick={sendSearchRequest}>Search</button>
            </li>
          </ul>
        </div>
        {documents && (
          <div className='search-results'>
            {documents.length > 0 ? (
              <p> Number of hits: {documents.length}</p>
            ) : (
              <p> No results found. Try broadening your search criteria.</p>
            )}
            {documents.map((document) => (
              <div className='results-card'>
                <div className='results-text'>
                  <p>Title: {document._source.Title}</p>
                  <p>Writer: {document._source.Lyricist}</p>
                  <p>Singer: {document._source.Singer}</p>
                  <p>Lyrics: {document._source.Lyrics}</p>
                  <p>Metopher: {document._source.Metopher}</p>
                  <p>Meaning: {document._source.Meaning}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;