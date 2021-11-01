// Derived from kafka-streams-viz project: https://github.com/zz85/kafka-streams-viz
import { Component, useContext, useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../Store";
import { getTopologyData } from "../utilities/TopologyService";
import { Module, render } from 'viz.js/lite.render';
import Viz from 'viz.js';
import rough from 'roughjs/bundled/rough.esm';

const TopologyHook = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [state, dispatch] = useContext(Context);
    const [ksTopoTxt, setKsTopoTxt] = useState("");
    const svgContainerRef = useRef(null);
    const graphvizCodeRef = useRef(null);
    const canvasRef = useRef(null);

    let rc, ctx;
    let secObj = state.keycloak;

    const processName = (name) => {
        return name.replace(/-/g, '-\\n');
    }

    // converts kafka stream ascii topo description to DOT language
    const convertTopoToDot = (topo) => {
        var lines = topo.split('\n');
        var results = [];
        var outside = [];
        var stores = new Set();
        var topics = new Set();
        var entityName;

        // dirty but quick parsing
        lines.forEach(line => {
            var sub = /Sub-topology: ([0-9]*)/;
            var match = sub.exec(line);

            if (match) {
                if (results.length) results.push(`}`);
                results.push(`subgraph cluster_${match[1]} {
			label = "${match[0]}";

			style=filled;
			color=lightgrey;
			node [style=filled,color=white];
			`);

                return;
            }

            match = /(Source:|Processor:|Sink:)\s+(\S+)\s+\((topics|topic|stores):(.*)\)/.exec(line)

            if (match) {
                entityName = processName(match[2]);
                var type = match[3]; // source, processor or sink
                var linkedNames = match[4];
                linkedNames = linkedNames.replace(/\[|\]/g, '');
                linkedNames.split(',').forEach(linkedName => {
                    linkedName = processName(linkedName.trim());

                    if (linkedName === '') {
                        // short circuit
                    }
                    else if (type === 'topics') {
                        // from
                        outside.push(`"${linkedName}" -> "${entityName}";`);
                        topics.add(linkedName);
                    }
                    else if (type === 'topic') {
                        // to
                        outside.push(`"${entityName}" -> "${linkedName}";`);
                        topics.add(linkedName);
                    }
                    else if (type === 'stores') {
                        if (entityName.includes("JOIN")) {
                            outside.push(`"${linkedName}" -> "${entityName}";`);
                        } else {
                            outside.push(`"${entityName}" -> "${linkedName}";`);
                        }

                        stores.add(linkedName);
                    }
                });

                return;
            }

            match = /-->\s+(.*)$/.exec(line);

            if (match && entityName) {
                var targets = match[1];
                targets.split(',').forEach(name => {
                    var linkedName = processName(name.trim());
                    if (linkedName === 'none') return;

                    results.push(`"${entityName}" -> "${linkedName}";`);
                });
            }
        })

        if (results.length) results.push(`}`);

        results = results.concat(outside);

        stores.forEach(node => {
            results.push(`"${node}" [shape=cylinder];`)
        });

        topics.forEach(node => {
            results.push(`"${node}" [shape=rect];`)
        });

        return `
        digraph G {
            label = "Kafka Streams Topology"

            ${results.join('\n')}
        }
        `;
    }

    const nullIfNone = (attribute) => {
        return attribute === 'none' ? null : attribute;
    }

    const getFillStroke = (child) => {
        var fill = nullIfNone(child.getAttribute('fill'));
        var stroke = nullIfNone(child.getAttribute('stroke'));
        var isBaseRectangle = child.nodeName === 'polygon' && child.parentNode.id === 'graph0';

        return {
            fill: isBaseRectangle ? 'white' : fill,
            fillStyle: isBaseRectangle ? 'solid' : 'hachure',
            stroke: stroke
        };
    }

    // node traversal function
    const traverseSvgToRough = (child) => {

        if (child.nodeName === 'path') {
            var d = child.getAttribute('d');
            let opts = getFillStroke(child);
            rc.path(d, opts);
            return;
        }

        if (child.nodeName === 'ellipse') {
            var cx = +child.getAttribute('cx');
            var cy = +child.getAttribute('cy');
            var rx = +child.getAttribute('rx');
            var ry = +child.getAttribute('ry');

            rc.ellipse(cx, cy, rx * 1.5, ry * 1.5);
            return;
        }

        if (child.nodeName === 'text') {
            var fontFamily = child.getAttribute('font-family')
            var fontSize = +child.getAttribute('font-size')
            var anchor = child.getAttribute('text-anchor')

            if (anchor === 'middle') {
                ctx.textAlign = 'center';
            }

            if (fontFamily) {
                ctx.fontFamily = fontFamily;
            }

            if (fontSize) {
                ctx.fontSize = fontSize;
            }

            ctx.fillText(child.textContent, child.getAttribute('x'), child.getAttribute('y'));
            return;
        }

        if (child.nodeName === 'polygon') {
            var pts = child.getAttribute('points')

            var opts = getFillStroke(child);
            rc.path(`M${pts}Z`, opts);

            return;
        }

        if (child.nodeName === 'g') {
            let transform = child.getAttribute('transform');
            ctx.save();

            if (transform) {
                let scale = /scale\(([^)]*)\)/.exec(transform);
                if (scale) {
                    let args = scale[1].split(' ').map(parseFloat);
                    ctx.scale(...args);
                }

                let rotate = /rotate\(([^)]*)\)/.exec(transform);
                if (rotate) {
                    let args = rotate[1].split(' ').map(parseFloat);
                    ctx.rotate(...args);
                }

                let translate = /translate\(([^)]*)\)/.exec(transform);
                if (translate) {
                    let args = translate[1].split(' ').map(parseFloat);
                    ctx.translate(...args);
                }
            }

            [...child.children].forEach(traverseSvgToRough);

            ctx.restore();
            return;
        }
    }

    const draw = (topo) => {
        let dotCode = convertTopoToDot(topo);
        graphvizCodeRef.value = dotCode;

        let params = {
            engine: 'dot',
            format: 'svg'
        };

        let viz = new Viz({ Module, render });

        viz.renderSVGElement(dotCode, params).then(result => {
            svgContainerRef.innerHTML = result;
            let svg = svgContainerRef.innerHTML;
            let dpr = window.devicePixelRatio;
            let canvas = canvasRef.current;
            canvas.width = svg.viewBox.baseVal.width * dpr | 0;
            canvas.height = svg.viewBox.baseVal.height * dpr | 0;
            canvas.style.width = `${svg.viewBox.baseVal.width}px`;
            canvas.style.height = `${svg.viewBox.baseVal.height}px`;

            rc = rough.canvas(canvas);
            ctx = rc.ctx
            ctx.scale(dpr, dpr);

            let g = svg.firstElementChild;

            try {
                traverseSvgToRough(g);
                setKsTopoTxt(topo);
            }
            catch (e) {
                console.error('Exception generating graph', e);
            }
        }).catch(error => {
            console.error('SVG render error', error);
        });

    }

    const drawTopology = () => {
        getTopologyData(secObj, props.topoUrl).then(dataArr => {
            dataArr = dataArr.map(data => data.replaceAll("\\n", "\n"));
            let normalizedData = dataArr.join('\n');
            draw(normalizedData);
        }).catch(err => console.error(err));
    }

    const drawTopologyClick = (e) => {
        drawTopology();
    }

    useEffect(() => {
        if (!state.authenticated) {
            state.keycloak.logout();
        } else {
            drawTopology();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container-fluid mt-3">
            <h1 className="mb-2">
                Processor Topology
                <FontAwesomeIcon key="refresh" icon={faRedo}
                    title="Refresh"
                    id="refresh-icon"
                    style={{ marginLeft: "2vmin" }}
                    onClick={drawTopologyClick} />
            </h1>

            <div className="row">
                <div className="col-9">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Topology Diagram</h5>
                            <canvas ref={canvasRef}></canvas>
                            <textarea id="graphviz-code" ref={graphvizCodeRef}></textarea>
                            <div id="svg-container" ref={svgContainerRef}></div>
                        </div>
                    </div>
                </div>

                <div className="col-3">
                    <div id="ks-topology" className="card">
                        <div className="card-body">
                            <h5 className="card-title">Topology Definition</h5>
                            <div className="overflow-auto">
                                <code>{ksTopoTxt}</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

class Topology extends Component {
    render() {
        return (
            <div>
                <TopologyHook topoUrl={this.props.topoUrl} />
            </div>
        )
    }
}

export default Topology;