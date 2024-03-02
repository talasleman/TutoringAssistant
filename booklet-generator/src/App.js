import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import StudentForm from './StudentForm';

function App() {

  // useEffect(() => {
  //   fetch('http://localhost:8000/api/message')
  //     .then(response => response.json())
  //     .then(data => setMessage(data.message))
  //     .catch(err => console.error(err));
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1> Generate a Booklet for your Students!</h1>
      </header>
      <div className='submission-form'>
        <StudentForm/>
      </div>
    </div>
  );
}

export default App;
