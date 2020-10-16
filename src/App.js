import React from 'react';
import Papa from 'papaparse';
import { shuffle } from 'lodash';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      matchedPairs: [],
      participants: [],
    };

    this.getData = this.getData.bind(this);
    this.matchParticipants = this.matchParticipants.bind(this);
  }

  componentDidMount() {
    this.getCsvData();
  }

  fetchCsv() {
    return fetch(`./secretSantaList.csv`).then((response) => {
      let reader = response.body.getReader();
      let decoder = new TextDecoder('utf-8');

      return reader.read().then(function (result) {
          return decoder.decode(result.value);
      });
    });
  }

  getData(result) {
    this.setState({ participants: result.data });
  }

  async getCsvData() {
    let csvData = await this.fetchCsv();

    Papa.parse(csvData, {
        complete: this.getData
    });
  }

  matchParticipants() {
    const { matchedPairs, participants } = this.state;

    if (participants.length === 0) {
      return;
    }

    // Names in a hat
    const receivers = shuffle(participants);

    // {
    //    giver name
    //    giver email
    //    recipient name
    // }
    for (let i = 0; i < participants.length; i++) {
      if (matchedPairs.length < participants.length) {
        matchedPairs.push({
          giverName: participants[i][0],
          giverEmail: participants[i][1],
          recipientName: ``,
        });
      }
    }

    for (let j = 0; j < matchedPairs.length; j++) {
      // Match a recipient who is not themselves, and recipient has not already been paired
      if (receivers[j] && matchedPairs[j].giverName !== receivers[j][0] && Object.values(matchedPairs[j]).indexOf(receivers[j][0]) === -1) {
        matchedPairs[j].recipientName = receivers[j][0];
      }
    } 

    return matchedPairs;
  }
  
  render() {
    const matching = this.matchParticipants();
    const secretSanta = [];

    if (!matching) {
      return null;
    }
    
    for (let i = 0; i < matching.length; i++) {
      secretSanta.push(<p key={i}>{`${matching[i].giverName} is paired with ${matching[i].recipientName}.`}</p>);
    }

    return (
      <div className={`container`}>
        <div className={`container-inner`}>
          {secretSanta}
        </div>
      </div>
    );
  }
}

export default App;
