import * as React from 'react';
import './App.css';

import { InputMention, InputMentionListItem } from './InputMention/InputMention';

const optionList:InputMentionListItem[] = [
  {mentionTag: "hucky", text: "Huckleberry Finn", imageUrl: "https://freekidsbooks.org/wp-content/uploads/2017/01/huckleberry-finn-updated-language-version-1.png"},
  {mentionTag: "matyi", text: "Mátyás, az Igazságos", imageUrl: "http://www.ivad.hu/2016/wp-content/uploads/2016/03/image.aspx_.jpg"},
  {mentionTag: "mz/x", text: "Köbüki", imageUrl: "https://www.mindenegyben.com/post_image/2017/08/1000_19510337_1763032007057762_2447845037042409697_n_20170823_151832.jpg"},
  {mentionTag: "aladar", text: "Mézga Aladár", imageUrl: "https://i.ytimg.com/vi/vBLC0cOyGuU/hqdefault.jpg"},
  {mentionTag: "mgeza", text: "Mézga Géza", imageUrl: "https://m.blog.hu/mu/musorvizio/amezgacsaladfolytatas.jpg"},
  {mentionTag: "gerevicha", text: "Gerevich Aladár", imageUrl: "https://upload.wikimedia.org/wikipedia/ru/thumb/c/c3/%D0%90%D0%BB%D0%B0%D0%B4%D0%B0%D1%80_%D0%93%D0%B5%D1%80%D0%B5%D0%B2%D0%B8%D1%87.jpg/236px-%D0%90%D0%BB%D0%B0%D0%B4%D0%B0%D1%80_%D0%93%D0%B5%D1%80%D0%B5%D0%B2%D0%B8%D1%87.jpg"},
];

class App extends React.Component {
  public render() {
    return (
      <InputMention list={optionList} />
    );
  }
}

export default App;
