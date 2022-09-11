import './main.css';
// import 'flowbite';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel';
/*
import axios from "axios";
const getCustomersData = () => {
  axios
  .get("https://api.yext.com/v2/accounts/me/customfields/790416?api_key=b88ccaa3c4599fcdcec98d95b6adab70&v=20161012")
  .then(data => alert(data.data))
  .catch(error => console.log(error));
  };
getCustomersData();
*/


function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const images = importAll(require.context('./images', false, /\.(gif|png|jpe?g|svg)$/));     
const fonts = importAll(require.context('./fonts', false, /\.(woff|woff2)$/));

