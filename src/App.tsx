import * as React from 'react';
import './App.css';

import { InputMention } from './InputMention/InputMention';
import { InputMentionListItem } from './InputMention/InputMentionInterfaces';

const optionList:InputMentionListItem[] = [
  {id: 0, mentionTag: "hucky", text: "Huckleberry Finn", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Huckleberry-finn-with-rabbit.jpg"},
  {id: 1, mentionTag: "matyas", text: "Mátyás, az Igazságos", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Matthias_Corvinus.jpg"},
  {id: 2, mentionTag: "mzperx", text: "Köbüki", imageUrl: "https://upload.wikimedia.org/wikipedia/hu/7/7b/Mzper_X.png"},
  {id: 3, mentionTag: "aladar", text: "Mézga Aladár", imageUrl: "https://upload.wikimedia.org/wikipedia/hu/4/40/M%C3%A9zga_Alad%C3%A1r_k%C3%BCl%C3%B6n%C3%B6s_kalandjai.jpg"},
  {id: 4, mentionTag: "mgeza", text: "Mézga Géza", imageUrl: "https://upload.wikimedia.org/wikipedia/hu/f/f6/M%C3%A9zga_csal%C3%A1d.png"},
  {id: 5, mentionTag: "foxi", text: "Foxi Maxi", imageUrl: "https://upload.wikimedia.org/wikipedia/hu/thumb/8/81/Foxi_maxi.jpg/250px-Foxi_maxi.jpg"},
];

class App extends React.Component {
  public render() {
    return (
      <InputMention list={optionList} showSearchBar={true} />
    );
  }
}

export default App;
