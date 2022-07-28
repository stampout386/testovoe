import './App.css';
import {useState} from "react";

function App() {

    const [files, setFiles] = useState([])

    const downloadFiles = () => {
        fetch('http://aloteq-test-tasks.s3-website.eu-central-1.amazonaws.com/list.txt')
            .then(response => response.text())
            .then(data => {
                const files = data.split(/\r?\n/)

                return Promise.all(files.map(file => {
                    return fetch(file)
                        .then(response => {
                            if (response.ok === false) {
                                return {file: 'файл не найден'}
                            } else {

                                const name = new URL(file)
                                return response.blob()
                                    .then(file => {
                                        return {fileName: name.pathname.slice(1), fileSize: response.headers.get('content-length'), file}
                                    })

                            }


                        }).catch(error => console.log(error))
                }))

            })
            .then(data => {
                console.log(data)
                setFiles(data)
            })
            .catch(console.log)


    }

    return (
        <div className="App">
            <button onClick={downloadFiles}>download</button>
            <div>{files.map(file => <div>{file}</div>)}</div>
        </div>
    );
}

export default App;
