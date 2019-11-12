import React, { Component } from 'react';
import axios from 'axios';
import './mainpage.css';
let img = require ('../../assets/loader.gif');

let id, id1;
class MainPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: '',
            cityName: '',
            temp: '',
            description: '',
            showDetals: false,
            apiHit: false,
            showLoader: false
        }
        this.inputRef = React.createRef();
        this.dropDownRef = React.createRef();
    }

    func = (data)=>{
        let obj = {
            cityName: data.name,
            temp: data.main.temp,
            description: data.weather[0].description
        }
        let arr;
        if(JSON.parse(localStorage.getItem('pastSearches'))){
            arr = JSON.parse(localStorage.getItem('pastSearches'));
            let b = arr.filter((item) => {
                if(item.cityName === obj.cityName){
                    return item
                }
            })
            if(arr.length >= 3){
                arr = arr.slice(arr.length-2, arr.length);
            }
            if(b.length === 0){
                arr.push(obj);
                localStorage.setItem('pastSearches', JSON.stringify(arr));
            }
        }
        else{
            let temp = [];
            temp.push(obj);
            localStorage.setItem('pastSearches', JSON.stringify(temp));
        }
        this.setState({
           cityName: data.name,
           temp: data.main.temp,
           description: data.weather[0].description,
           showDetals: true,
           showLoader: false
        })
    }

    onChangeHandler = (e)=>{
        this.setState({
            inputValue: e.target.value,
            // showLoader: true
        })
        let m = e.target.value;
        clearTimeout(id);
        clearTimeout(id1);

        id1 = setTimeout(()=>{
            this.setState({
                showLoader: true,
                showDetals: false
            })
        },1000);

        id = setTimeout(() => {
            let q = m;
            let dropDownValue = this.dropDownRef.current.value;
            let url;
            switch(dropDownValue){
                case 'Name':
                        url = `http://api.openweathermap.org/data/2.5/weather?q=${q}&?units=metric&APPID=d565b38e30ff1b84851498f17b251104`;
                    break
                case 'Zip-Code':
                        url = `http://api.openweathermap.org/data/2.5/weather?q=${q}&?units=metric&APPID=d565b38e30ff1b84851498f17b251104`;
                    break
                case 'Lon-Lat':
                        let a,b;
                        [a, b] = q.split(' ');
                        url = `http://api.openweathermap.org/data/2.5/weather?lat=${a}&lon=${b}&?units=metric&APPID=d565b38e30ff1b84851498f17b251104`;
                    break
                default:
                    break
                }

            axios.get(url)
                .then(response => {
                    this.func(response.data);
                    this.setState({
                        apiHit: true,
                        showLoader: false,
                        showDetals: true
                    })
            })
            .catch(error => {
                this.setState({
                    apiHit: false,
                    showLoader: false,
                    showDetals: true
                })
                })
        },3000);
    }

    createBlock = (data) => {
        if(data){
            let d = data.map(item => {
                return (
                    <div className='single-block'>
                        <p>City: {item.cityName}</p>
                        <p>Status: {Math.floor(item.temp-273)}&#8451; ({item.description})</p>
                    </div>
                )
            })
            return d;
        }  
    }

    render() {
        let pastSearches = JSON.parse(localStorage.getItem('pastSearches'));
        return (
            <div className='container'>
                <div className='input-field-container'>
                    <input className='input-field' ref={this.inputRef} onChange={(e) => this.onChangeHandler(e)} type='input' value={this.state.inputValue}/>
                    {/* <button className='search-button'>Search</button> */}
                    <select className='dropdown-list' ref={this.dropDownRef}>
                        <option value="Name">Name</option>
                        <option value="Lon-Lat">Lon-Lat</option>
                        <option value="Zip-Code">Zip-Code</option>
                    </select>
                    { this.state.showLoader?
                    <div className='loader-container'><img src={img} alt='img-not-found'></img></div>:''}
                    {this.state.showDetals?(
                        this.state.apiHit?
                        <div className='display-weather-container'>
                        <p> <span style={{color: 'blue'}}>Weather Info : </span>{this.state.cityName} {Math.floor(this.state.temp)-273}&#8451; ({this.state.description})</p>
                    </div>:
                    <div className='city-not-found'>City Not Found</div>
                    )
                    : ''}

                    <div className='past-searches-container'>
                        <p id='id12'> Past searches </p>
                        {this.createBlock(pastSearches)}
                    </div>
                </div>
            </div>
        )
    }
}

export default MainPage;
