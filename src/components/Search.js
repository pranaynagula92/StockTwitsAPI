import React from 'react';
import './Search.css';
import axios from 'axios';
import 'antd/dist/antd.css';
import { Row, Col, Input, Avatar, List, Spin } from 'antd';
import ReactTimeAgo from 'react-time-ago';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const { Search } = Input;

class Symbols extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            results: {},
            loading: false,
            message: ''
        }
        this.cancel = '';
    }

    fetchSearchResults = (query) => {
        const SearchUrl = `https://api.stocktwits.com/api/2/streams/symbol/${query}.json`;

        if (this.cancel) {
            this.cancel.cancel();
        }

        this.cancel = axios.CancelToken.source();

        axios.get(SearchUrl, {
            cancelToken: this.cancel.token
        })
            .then(res => {
                console.warn(res.data.messages)
                const resultNotFoundMsg = !res.data.messages.length
                    ? 'There are no more search results. Please try a new search.'
                    : '';
                this.setState({
                    results: res.data.messages,
                    message: resultNotFoundMsg,
                    loading: false
                })
            })
            .catch(error => {
                if (axios.isCancel(error) || error) {
                    this.setState({
                        loading: false,
                        message: 'Failed to fetch the data. Please check network'
                    })
                }
            })
    }

    handleOnInputChange = (event) => {
        const query = event.target.value;
        if (!query) {
            this.setState({
                query: query,
                results: {},
                message: ''
            })
        } else {
            this.setState({
                query: query,
                loading: true,
                message: ''
            }, () => {
                this.fetchSearchResults(query);
            })
        }
    }

    renderSearchResults = () => {
        const { results } = this.state;
        JavascriptTimeAgo.locale(en)
        if (Object.keys(results).length && results.length) {
            return (
                <div >
                    {results.map(result => {
                        return (
                            <div className="results-container">
                                <List.Item
                                    key={result.id}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar shape="square" size="large" src={result.user.avatar_url} />}
                                        title={<a>{result.user.name}</a>}
                                        description={<a>@{result.user.username} <i style={{ fontSize: 10, color: "grey" }}>Updated: <ReactTimeAgo date={new Date(result.created_at).toLocaleString()} /></i></a>}
                                    />
                                    {result.body}
                                </List.Item>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }

    render() {
        const { query, loading, message } = this.state;
        console.warn(this.state)
        return (
            <div className="container">
                {/*Heading*/}
                <h2 style={{ textAlign: 'left' }}
                    className="heading">@tweets</h2>
                <h4 style={{ textAlign: 'left' }}>
                    This application helps you in displaying the latest tweets from <a>#StockTwits</a></h4>
                <Row>
                    <Col span={24}>
                        <Search
                            placeholder="Please enter value"
                            onSearch={query}
                            size="large"
                            onChange={this.handleOnInputChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {this.renderSearchResults()}
                        {message && <p className='message'>{message}</p>}
                        <div className={`search-loading ${loading ? 'show' : 'hide'}`}>
                            <Spin size="large" />
                        </div>
                    </Col>
                </Row>

            </div>
        )
    }
}

export default Symbols;

