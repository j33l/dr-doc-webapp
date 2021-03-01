import React, { useState } from 'react'

import axios from 'axios'

const App = () => {
	const [selectedFile, setSelectedFile] = useState(null)
	const [selectedProcess, setSelectedProcess] = useState("compress")
	
	// On file select (from the pop up)
	const onFileChange = event => {
		setSelectedFile(event.target.files[0])
	}

	const onProcessChange = event => {
		setSelectedProcess(event.target.value)
	}

	// On file upload (click the upload button)
	const onFileUpload = () => {
		// Create an object of formData
		const formData = new FormData()
		
		// Update the formData object
		formData.append(
			"avatar",
			selectedFile,
			selectedFile.name
		)
	
		// Request made to the backend api, Send formData object
		axios.post(`${process.env.REACT_APP_API_URL}/${selectedProcess}`, formData)
		.then(res => {

			console.log(" received success message ,,,", res)

			// on success of file process, chaining downloading request
			return axios({
				method: 'GET',
				url: `${process.env.REACT_APP_API_URL}/processedfile/${res.data.fileId}`,
				responseType: 'blob'
			}).then(res => {
				var data = res.data
		
				console.log('downloaded ,,,')
		
				// auto downloads the file for user
				var saveByteArray = (function () {
					var a = document.createElement("a")
					document.body.appendChild(a)
					a.style = "display: none"
					return function (data, name) {
						var blob = new Blob(data, { type: "application/pdf" }), url = window.URL.createObjectURL(blob)
						a.href = url
						a.download = name
						a.click()
						window.URL.revokeObjectURL(url)
					}
				}())
				
				saveByteArray([data], `${selectedProcess}-${selectedFile.name}.pdf`)
			})

  		}).catch(e => {
			console.log("Error occured!", e)
		})
	}
	
	// File content to be displayed after
	const fileData = () => {
		if (selectedFile) {
			return (
				<div>
					<h2>File Details:</h2>
					<p>File Name: {selectedFile.name}</p>
					<p>File Type: {selectedFile.type}</p>
					<p>Last Modified:{" "}
						{selectedFile.lastModifiedDate.toDateString()}
					</p>
				</div>
			)
		} else {
			return (
			<div>
				<br />
				<h4>Choose before Pressing the Upload button</h4>
			</div>
			)
		}
	}
	
	return (
		<div>
			<label htmlFor="process">Choose what to do:</label>
			<select name="process" id="process" onChange={onProcessChange} value={selectedProcess}>
				<option value="compression">Compress PDF</option>
				<option value="unlock">Unlock PDF</option>
				<option value="encrypt">Encrypt PDF</option>
				<option value="decrypt">Decrypt PDF</option>
				<option value="pageNumber">Add page numbers to PDF</option>
				<option value="merge">Merge PDF</option>
				<option value="convert">Convert to PDF</option>
			</select>
			<div>
				<input type="file" onChange={onFileChange} />
				<button
					onClick={onFileUpload}
				>
					Upload
				</button>
			</div>
			{fileData()}
		</div>
	)
}

export default App
