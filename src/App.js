import './App.css';
import { useState } from 'react';
import {ethers} from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
	// store greeting in local state
	const [greeting, setGreetingValue] = useState()

	// request access to the user's MetaMask account
	async function requestAccount() {
		await window.ethereum.request({method: 'eth_requestAccounts'});
	}

	// call the smart contract, read the current greeting value
	async function fetchGreeting() {
		if(typeof window.ethereum != 'undefined') {
			console.log("fetchGreeting")

			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
			try{
				// const address = await window.ethereum.enable();
				// const obj = {
				// 	connectedStatus: true,
				// 	status: "",
				// 	address: address
				// }
				// return obj;
				console.log("data")

				const data = await contract.greet()
				console.log('data: ', data)
			} catch (error) {
				return {
					connectedStatus: false,
					status: "🦊 Connect to Metamask using the button on the top right."
				}
			}
		} else {
			return {
				connectedStatus: false,
				status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
			}
		}
	}

	// call the smart contract, send an update
	async function setGreeting() {
		if(!greeting) return
		if(typeof window.ethereum != 'undefined') {
			await requestAccount()
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner()
			const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
			const transaction = await contract.setGreeting(greeting)
			await transaction.wait()
			fetchGreeting()
		}
	}

	return(
		<div className="App">
			<header className="App-header">
				<button onClick={fetchGreeting}>Fetch Greeting</button>
				<button onClick={setGreeting}>Set Greeting</button>
				<input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting"/>
			</header>
		</div>
	);
}

export default App;