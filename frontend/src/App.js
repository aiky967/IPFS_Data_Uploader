import React, { Component } from "react";
import {Table, Container, Button, Form} from 'react-bootstrap';
import web3 from "./getWeb3";
import "./App.css";
// import ipfs from './ipfs';
import storeHash from './storeHash';
const ipfsClient = require('ipfs-api');

const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// https://gateway.ipfs.io/ipfs/QmaBbSBDW5TBU9SAu4xkSkEuZqdWgkSF3ezk369gBiqzDb

class App extends Component {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer: null };

  constructor(props) {
    super(props)

    this.state = {
      buffer: null,
      ipfsHash: null,
      ethAddress: '',
      blockNumber: '',
      transactionHash: '',
      gasUsed: '',
      txReceipt: ''
    }
    
  }

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => 
      this.convertToBuffer(reader)
    };
      convertToBuffer = async(reader) => {
        // File is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
        this.setState({buffer});
        console.log('buffer', this.state.buffer)
      }

      onClick = async () => {
        try {
          this.setState({blockNumber: "waiting..."});
          this.setState({gasUsed: "waiting..."});

          await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
            console.log(err, txReceipt);
            this.setState({txReceipt});
          });

          await this.setState({blockNumber: this.state.txReceipt.blockNumber});
          await this.setState({gasUsed: this.state.txReceipt.gasUsed});
        } 
        catch (error) {
          console.log(error);
        } 
      };
    
      onSubmit = async (event) => {
        event.preventDefault()

        // bring in user's metamask account address
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account:' + accounts[0]);

        // obtain contract from storeHash.js
        const ethAddress = await storeHash.options.address;
        this.setState({ethAddress});

        // Save document to IPFS, return its hash #, and set hash # to state
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
          console.log(err, ipfsHash);
          this.setState({ ipfsHash: ipfsHash[0].hash });

          // call Ethereum contract method "sendHash" and .send IPFS to 
          // ethereum contract return the transaction hash from the ethereum contract
          storeHash.methods.sendHash(this.state.ipfsHash).send({
            from: accounts[0]
          }, (error, transactionHash) => {
            console.log(transactionHash);
            this.setState({transactionHash});
          });
        })        
      };

      

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }

    return (
      <div className="App">
       <header className="App-header">
        <h1>Upload data on IPFS and get Unique Hash</h1>
       </header>

       <hr />


       <Container>
         <h3>Upload data image to IPFS</h3>
         <Form onSubmit={this.onSubmit}>
          <input 
            type = "file"
            onChange={this.captureFile}
          />
          <Button 
            bsStyle="primary"
            type="submit"
          >
            Send it  
          </Button>
         </Form>

         <hr />
         <Button onClick={this.onClick}> Get Transaction Receipt </Button>

         <Table bordered responsive>
           <thead>
             <tr>
               <th>Tx Receipt Category</th>
               <th>Values</th>
             </tr>
           </thead>

           <tbody>
             <tr>
               <td>IPFS Hash # stored on Ethereum Contract</td>
               <td>{this.state.ipfsHash}</td>
             </tr>
             <tr>
               <td>Ethereum Contract Address</td>
               <td>{this.state.ethAddress}</td>
             </tr>

             <tr>
               <td>Data link </td>
               <td>{`https://gateway.ipfs.io/ipfs/${this.state.ipfsHash}`}</td>
             </tr>

             {/* <tr>
               <td>Block Number # </td>
               <td>{this.state.blockNumber}</td>
             </tr>

             <tr>
               <td>Gas Used</td>
               <td>{this.state.gasUsed}</td>
             </tr>            */}
           </tbody>
         </Table>
       </Container>
      </div>
    );
  }
}

export default App;
