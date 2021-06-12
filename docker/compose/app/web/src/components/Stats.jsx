import React, {Component, useCallback, useEffect, useState} from 'react';
import {getTaskDataPerUser} from "../utilities/StatsService";
import InfoModal from "./InfoModal";
import Plot from "react-plotly.js";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const StatsHook = () => {
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [userId, setUserId] = useState("");
    const [taskCount, setTaskCount] = useState(0);
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [showGraph, setShowGraph] = useState(false);

    const readChunkCallback = useCallback((reader) => {
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

                            if (dataObj && dataObj.row) {
                                let dataRow = dataObj.row;
                                if (dataRow.columns) {
                                    let dataCols = dataRow.columns;
                                    setUserId(dataCols[0]);
                                    setTaskCount(dataCols[1]);
                                }
                            }
                        });
                    } catch (e) {
                        console.error(e);
                    }
                }
                readChunkCallback(reader);
            }
        });
    }, [setUserId, setTaskCount]);

    const startTaskStream = () => {
        getTaskDataPerUser().then(res => {
                if (res['error_code']) {
                    setModalTitle('Error')
                    setModalText(res.message);
                    setShowInfo(true);
                } else {
                    let reader = res.body.getReader();
                    readChunkCallback(reader);
                }
            }
        );
    }

    useEffect(() => {
        setShowGraph(false);
        startTaskStream();
    }, []);

    useEffect(() => {
        if (userId) {
            let userLblIdx = labels.indexOf(userId);
            if (userLblIdx >= 0) {
                let updValues = [...values];
                updValues[userLblIdx] = taskCount;
                setValues(updValues);
            } else {
                setLabels(prevLabels => [...prevLabels, userId]);
                setValues(prevValues => [...prevValues, taskCount]);
            }
            setShowGraph(true);
        }
    }, [userId, taskCount]);

    return (
        <div className="container-fluid mt-3">
            {showGraph ?
                <Plot
                    data={[{
                        labels: labels,
                        values: values,
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
                                    text: 'Tasks',
                                }
                            ],
                            grid: {rows: 1, columns: 1}
                        }
                    }
                />
                :
                <FontAwesomeIcon icon={faSpinner} spin/>}
            <InfoModal showModal={showInfo} modalText={modalText} modalTitle={modalTitle}/>
        </div>
    );
}

class Stats extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <StatsHook/>
            </div>
        );
    }
}

export default Stats;