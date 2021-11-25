// noinspection RequiredAttributes

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {WeightEntry} from "../models/weight-entry";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {DateUtils} from "../helpers/date.utils";
import {Button, ButtonGroup, Col, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Weight By Date',
        },
    },
};

const getYear = (weightEntry: WeightEntry) => DateUtils.parseDate(weightEntry.dt).getFullYear();

const Chart = () => {
    const weightEntries: WeightEntry[] = useSelector((st: any) => st.weightEntries);
    const [yearFilter, setYearFilter] = useState("All Years");
    const [weightChartData, setWeightChartData] = useState([]);
    const allLabels: string[] = weightEntries.map((we: WeightEntry) => we.dt);
    const [weightChartLabels, setWeightChartLabels] = useState([]);
    const uniqueYears: number[] = [];
    weightEntries.map(w => getYear(w)).forEach(y => !uniqueYears.includes(y) ? uniqueYears.push(y) : () => {});
    let data = {
        labels: weightChartLabels,
        datasets: [
            {
                label: 'Pounds',
                data: weightChartData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    };
    useEffect(() => {
        setWeightChartData(weightEntries.map(we => we.lbs));
        setWeightChartLabels(allLabels);
    }, [weightEntries]);

    const handleYear = (year) => {
        setYearFilter(year);
        const filteredWeightEntries = weightEntries.filter(we => getYear(we) === parseInt(year));
        setWeightChartData(filteredWeightEntries.map(we => we.lbs));
        setWeightChartLabels(filteredWeightEntries.map((we: WeightEntry) => we.dt));
    };

    const handleAll = () => {
        setYearFilter("All Years");
        setWeightChartData(weightEntries.map(we => we.lbs));
        setWeightChartLabels(allLabels);
    };

    return (
        <>
            <Container>
                <Row className="mt-2">
                    <Col lg="1" className="me-2">
                        <DropdownButton
                            as={ButtonGroup}
                            variant="primary"
                            title={yearFilter}
                            onSelect={handleYear}
                        >
                            {uniqueYears.length > 0 && uniqueYears.map(y => <Dropdown.Item key={y} eventKey={y}>{y}</Dropdown.Item>)}
                        </DropdownButton>
                    </Col>
                    {"All Years" !== yearFilter && <Col lg="2"><Button onClick={handleAll}>All Years</Button></Col>}
                </Row>
                <Row>
                    <Col>
                        <Line options={options} data={data}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Chart;