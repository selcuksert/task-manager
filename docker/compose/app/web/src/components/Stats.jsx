import React, { Component, useCallback, useEffect, useState, useContext } from 'react';
import { getTaskDataPerUser, getTaskDistPerUser, addTaskTableToKSql, addTaskStreamToKSql, addTaskHistoryTableToKSql } from "../utilities/StatsService";
import InfoModal from "./InfoModal";
import Plot from "react-plotly.js";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Context } from "../Store";
import Moment from 'moment';
import Progress from './Progress';

const StatsHook = () => {
    Moment.locale('tr');

    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [tpuLoading, setTpuLoading] = useState(false);
    const [distLoading, setDistLoading] = useState(false);
    const [tpuUserId, setTpuUserId] = useState("");
    const [taskCount, setTaskCount] = useState(0);
    const [tpuLabels, setTpuLabels] = useState([]);
    const [tpuValues, setTpuValues] = useState([]);
    const [showTpuGraph, setShowTpuGraph] = useState(false);
    const [showDistGraph, setShowDistGraph] = useState(false);
    const [distKsqlData, setDistKsqlData] = useState([]);
    const [distChartData, setDistChartData] = useState([]);
    const [windowSize, setWindowSize] = useState(5);
    const [windowStartDate, setWindowStartDate] = useState("");
    const [windowEndDate, setWindowEndDate] = useState("");
    const [showTpuProgress, setShowTpuProgress] = useState(false);
    const [showDistProgress, setShowDistProgress] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const [state, dispatch] = useContext(Context);

    const readTpuChunkCallback = useCallback((reader) => {
        let decoder = new TextDecoder('utf-8');
        let dataArr = [];

        reader.read().then(function (result) {
            if (!result.done) {
                let chunkData = decoder.decode(result.value);

                if (chunkData && chunkData.trim()) {
                    chunkData = chunkData
                        .replaceAll('[{', '{')
                        .replaceAll('`', '')
                        .replaceAll('\n', '');

                    let parsedChunkData = chunkData.split('},').filter(d => d !== '').map(d => d + '}');

                    dataArr = dataArr.concat(parsedChunkData);

                    try {
                        dataArr.forEach(data => {
                            let dataObj = JSON.parse(data);

                            if (dataObj.header && dataObj.header.queryId) {
                                dispatch({ type: 'KSQL_QUERY', payload: { ksqlQueryId: dataObj.header.queryId } })
                            }

                            if (dataObj && dataObj.row) {
                                let dataRow = dataObj.row;
                                if (dataRow.columns) {
                                    let dataCols = dataRow.columns;
                                    setTpuUserId(dataCols[0]);
                                    setTaskCount(dataCols[1]);
                                }
                            }
                        });
                    } catch (e) {
                        console.error(e);
                    }
                }
                readTpuChunkCallback(reader);
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setTpuUserId, setTaskCount]);

    const readDistChunkCallback = useCallback((reader) => {
        let decoder = new TextDecoder('utf-8');
        let dataArr = [];

        reader.read().then(function (result) {
            if (!result.done) {
                let chunkData = decoder.decode(result.value);

                if (chunkData && chunkData.trim()) {
                    chunkData = chunkData
                        .replaceAll('[{', '{')
                        .replaceAll('`', '')
                        .replaceAll('\n', '');

                    let parsedChunkData = chunkData.split('},').filter(d => d !== '').map(d => d + '}');

                    dataArr = dataArr.concat(parsedChunkData);

                    try {
                        dataArr.forEach(data => {
                            let dataObj = JSON.parse(data);

                            if (dataObj.header && dataObj.header.queryId) {
                                dispatch({ type: 'KSQL_QUERY', payload: { ksqlQueryId: dataObj.header.queryId } })
                            }

                            if (dataObj && dataObj.row) {
                                let dataRow = dataObj.row;
                                if (dataRow.columns) {
                                    let dataCols = dataRow.columns;
                                    setDistKsqlData(oldData => [...oldData, dataCols]);
                                }
                            }
                        });
                    } catch (e) {
                        console.error(e);
                    }
                }
                readDistChunkCallback(reader);
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setDistKsqlData]);

    const startTpuStream = () => {
        setTpuLoading(true);
        setShowTpuGraph(false);
        setShowInfo(false);
        setShowTpuProgress(false);
        getTaskDataPerUser().then(res => {
            setTpuLoading(false);
            if (res['error_code']) {
                setModalTitle('Error')
                setModalText(res.message);
                setShowInfo(true);
            } else {
                let reader = res.body.getReader();
                readTpuChunkCallback(reader);
                setShowTpuProgress(true);
            }
        });
    }

    const startDistStream = () => {
        setDistLoading(true);
        setShowDistGraph(false);
        setShowInfo(false);
        setDistChartData([]);
        setDistKsqlData([]);
        setShowDistProgress(false);
        let startEpoch = Moment(windowStartDate).unix() * 1000;
        let endEpoch = Moment(windowEndDate).unix() * 1000;
        getTaskDistPerUser(startEpoch, endEpoch).then(res => {
            setDistLoading(false);
            if (res['error_code']) {
                setModalTitle('Error')
                setModalText(res.message);
                setShowInfo(true);
            } else {
                let reader = res.body.getReader();
                readDistChunkCallback(reader);
                setShowDistProgress(true);
            }
        });
    }

    const resetTpuKTable = () => {
        setTpuLoading(true);
        setShowTpuGraph(false);
        setShowInfo(false);
        addTaskTableToKSql().then(res => {
            setTpuLoading(false);
            if (res['error_code'] || res['error']) {
                setModalTitle('Error');
                setModalText(res.message);
                setShowInfo(true);
            } else {
                setModalTitle('Success')
                if (Array.isArray(res)) {
                    let modalText = '';
                    res.forEach(r => modalText += ' ' + r.commandStatus.message);
                    setModalText(modalText);
                }
                else {
                    setModalText(res.commandStatus.message);
                }
                setShowInfo(true);
            }
        }
        );
    }

    const resetTaskStream = () => {
        setDistLoading(true);
        setShowDistGraph(false);
        setShowInfo(false);
        addTaskStreamToKSql().then(res => {
            setDistLoading(false);
            if (res['error_code'] || res['error']) {
                setModalTitle('Error');
                setModalText(res.message);
                setShowInfo(true);
            } else {
                setModalTitle('Success')
                if (Array.isArray(res)) {
                    let modalText = '';
                    res.forEach(r => modalText += ' ' + r.commandStatus.message);
                    setModalText(modalText);
                }
                else {
                    setModalText(res.commandStatus.message);
                }
                setShowInfo(true);
            }
        }
        );
    }

    const resetTaskHistoryTable = () => {
        setDistLoading(true);
        setShowDistGraph(false);
        setShowInfo(false);
        addTaskHistoryTableToKSql(windowSize).then(res => {
            setDistLoading(false);
            if (res['error_code'] || res['error']) {
                setModalTitle('Error');
                setModalText(res.message);
                setShowInfo(true);
            } else {
                setModalTitle('Success');
                let modalText = '';
                if (Array.isArray(res)) {
                    res.forEach(r => modalText += ' ' + r.commandStatus.message);
                }
                else {
                    modalText = res.commandStatus.message;
                }
                setModalText(modalText);
                setShowInfo(true);
            }
        }
        );
    }

    const updateDistChartData = (distKsqlData) => {
        let chartData = [];
        let commonX = []

        distKsqlData.forEach(data => {
            if (data.length === 4) {
                let windowStart = data[1];
                let windowEnd = data[2];
                let windowSE = `${windowStart} | ${windowEnd}`;

                let windowIdx = commonX.indexOf(windowSE);

                if (windowIdx < 0) {
                    commonX.push(windowSE);
                }

                commonX.sort((a, b) => {
                    let winStartA = a.split('|')[0].trim();
                    let winStartB = b.split('|')[0].trim();

                    let winStartAts = Moment(winStartA, 'DD-MM-YYYY hh:mm:ss').unix();
                    let winStartBts = Moment(winStartB, 'DD-MM-YYYY hh:mm:ss').unix();

                    return (winStartAts - winStartBts);
                })
            }
        });

        distKsqlData.forEach(data => {
            let name = data[0];
            let windowStart = data[1];
            let windowEnd = data[2];
            let taskCount = data[3];
            let windowSE = `${windowStart} | ${windowEnd}`;
            let windowIdx = commonX.indexOf(windowSE);

            if (chartData.filter(data => data.name === name).length === 0) {
                chartData.push({
                    name: name,
                    type: 'bar',
                    x: commonX,
                    y: Array(commonX.length).fill(0)
                });
            }

            chartData = chartData.map((data) => {
                data.x = commonX;
                if (data.name === name) {
                    data.y[windowIdx] = taskCount;
                }
                return data;
            });
        });

        setDistChartData(chartData);
        setShowDistGraph(true);
    }

    useEffect(() => {
        setShowTpuGraph(false);
        setTpuLoading(false);
        setShowDistGraph(false);
        setTpuLoading(false);
        setShowTpuProgress(false);
        setShowDistProgress(false);
    }, []);

    useEffect(() => {
        if (tpuUserId) {
            let userLblIdx = tpuLabels.indexOf(tpuUserId);
            if (userLblIdx >= 0) {
                let updValues = [...tpuValues];
                updValues[userLblIdx] = taskCount;
                setTpuValues(updValues);
            } else {
                setTpuLabels(prevLabels => [...prevLabels, tpuUserId]);
                setTpuValues(prevValues => [...prevValues, taskCount]);
            }
            setShowTpuGraph(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tpuUserId, taskCount]);

    useEffect(() => {
        if (distKsqlData.length > 0) {
            updateDistChartData(distKsqlData);
        }
    }, [distKsqlData]);


    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-5">
                    <div className="card">
                        <div>
                            {showTpuProgress ?
                                <Progress width="100" />
                                :
                                ''
                            }
                            {tpuLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : showTpuGraph ?
                                <Plot
                                    data={[{
                                        labels: tpuLabels,
                                        values: tpuValues,
                                        name: '# of tasks',
                                        hole: .4,
                                        hoverinfo: 'label+name+value',
                                        type: 'pie'
                                    }]}
                                    layout={
                                        {
                                            title: 'Number of tasks per user',
                                            annotations: [
                                                {
                                                    font: {
                                                        size: 20
                                                    },
                                                    showarrow: false,
                                                    text: 'Tasks'
                                                }
                                            ],
                                            grid: { rows: 1, columns: 1 }
                                        }
                                    }
                                    onInitialized={() => setShowTpuProgress(false)}
                                    onError={() => setShowTpuProgress(false)}
                                />
                                :
                                ''}
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Tasks per User</h5>
                            <p className="card-text">Pie chart to display actual task count per user using ksqlDB push query</p>
                            <div className="btn-group" role="group">
                                <button
                                    type="button"
                                    className="btn btn-info"
                                    onClick={resetTpuKTable}>Add TpU Table</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={startTpuStream}>Start</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-7">
                    <div className="card">
                        <div>
                            {showDistProgress ?
                                <Progress width="100" />
                                :
                                ''
                            }
                            {distLoading ? <FontAwesomeIcon icon={faSpinner} spin /> :
                                showDistGraph ?
                                    <Plot
                                        data={distChartData}
                                        layout={
                                            {
                                                title: 'Task distribution',
                                                barmode: 'stack'
                                            }
                                        }
                                        onInitialized={() => setShowDistProgress(false)}
                                        onError={() => setShowDistProgress(false)}
                                    />
                                    :
                                    ''}
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Task Distribution</h5>
                            <p className="card-text">Stack diagram to display actual task distribution in windowed (tumbling) mode using ksqlDB push query</p>

                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" for="windowSize">Window size in minutes</label>
                                </div>
                                <input
                                    type="number"
                                    id="windowSize"
                                    className="form-control"
                                    placeholder="Window size in minutes"
                                    onChange={(e) => setWindowSize(e.target.value)}
                                    value={windowSize}>
                                </input>
                                <div className="input-group-append">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={resetTaskStream}>Reset Task Stream</button>
                                    <button
                                        type="button"
                                        className="btn btn-info"
                                        onClick={resetTaskHistoryTable}>Reset TH Table</button>

                                </div>
                            </div>

                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" for="windowSize">Window start and end date</label>
                                </div>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="startDate"
                                    onChange={(e) => setWindowStartDate(e.target.value)}
                                    value={windowStartDate}>
                                </input>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="endDate"
                                    onChange={(e) => setWindowEndDate(e.target.value)}
                                    value={windowEndDate}>
                                </input>
                                <div className="input-group-append">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={startDistStream}>Start</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <InfoModal showModal={showInfo} modalText={modalText} modalTitle={modalTitle} />
                </div>
            </div>
        </div>
    );
}

class Stats extends Component {

    render() {
        return (
            <div>
                <StatsHook />
            </div>
        );
    }
}

export default Stats;